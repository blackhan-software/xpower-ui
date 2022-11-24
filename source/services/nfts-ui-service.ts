import { Store } from '@reduxjs/toolkit';
import { Blockchain } from '../blockchain';
import { Bus } from '../bus';
import { buffered } from '../functions';
import { setNftsUiAmounts, setNftsUiDetails, setNftsUiMinter } from '../redux/actions';
import { onAftWalletChanged, onTokenSwitch } from '../redux/observers';
import { nftAmounts } from '../redux/reducers';
import { aftWalletBy, xtokenOf } from '../redux/selectors';
import { AppState } from '../redux/store';
import { Address, Amount, MAX_UINT256, Nft, NftAmounts, NftDetails, NftIssue, NftLevel, NftLevels, NftMinterApproval, NftTokens, Token, TokenInfo } from '../redux/types';
import { Tokenizer } from '../token';
import { MoeWallet, NftWallet, NftWalletMock } from '../wallet';
import { Years } from '../years';

import { NftImageMeta } from '../../views/nfts/details/nft-image-meta';

export const NftsUiService = (
    store: Store<AppState>
) => {
    /**
     * nft-amounts:
     */
    onAftWalletChanged(
        store, buffered(sync_amounts)
    );
    onTokenSwitch(
        store, sync_amounts
    );
    function sync_amounts(token: Token) {
        const xtoken = Tokenizer.xify(token);
        const { items } = aftWalletBy(
            store.getState(), xtoken
        );
        const item = items[xtoken];
        if (item !== undefined) {
            store.dispatch(setNftsUiAmounts({
                ...nft_amounts(xtoken, item)
            }));
        }
    }
    const nft_amounts = (
        token: Token, { amount }: { amount: Amount }
    ) => {
        const { decimals } = TokenInfo(token);
        const balance = amount / BigInt(10 ** decimals);
        const nft_token = Nft.token(token);
        const entries = Array.from(NftLevels()).map((nft_level): [
            NftLevel, NftAmounts[NftLevel]
        ] => {
            const remainder = balance % 10n ** (BigInt(nft_level) + 3n);
            const nft_amount = remainder / 10n ** BigInt(nft_level);
            return [nft_level, {
                amount: nft_amount, max: nft_amount, min: 0n
            }];
        });
        return {
            amounts: Object.assign(nftAmounts(), {
                [nft_token]: Object.fromEntries(entries)
            })
        };
    };
    /**
     * ui-details:
     */
    Bus.on('toggle-issue', function toggleDetails({
        level, issue, flag
    }) {
        const levels = level !== undefined
            ? [level] : Array.from(NftLevels());
        const issues = issue !== undefined
            ? [issue] : Array.from(Years());
        const details = Object.fromEntries(
            Array.from(NftTokens()).map(
                (t) => [t, Object.fromEntries(
                    levels.map((l) => [
                        l, Object.fromEntries(
                            issues.map((i) => [
                                i, { toggled: flag }
                            ])
                        )
                    ])
                )]
            )
        );
        store.dispatch(setNftsUiDetails({ details }));
    });
    /**
     * ui-{image,minter}:
     */
    Blockchain.onceConnect(async function initImagesAndMinter({
        address, token
    }) {
        const nft_images = [];
        for (const level of NftLevels()) {
            for (const issue of Years({ reverse: true })) {
                nft_images.push(nft_image(level, issue, token));
            }
        }
        const [approval, ...images] = await Promise.all([
            nft_approval(address, token), ...nft_images
        ]);
        store.dispatch(setNftsUiMinter(
            approval
        ));
        store.dispatch(setNftsUiDetails(
            images.reduce((l, r) => $.extend(true, l, r))
        ));
    }, {
        per: () => xtokenOf(store.getState())
    });
    const nft_approval = async (
        address: Address, token: Token
    ) => {
        const moe_wallet = new MoeWallet(address, token);
        const nft_wallet = new NftWallet(address, token);
        const nft_contract = await nft_wallet.contract;
        const allowance = await moe_wallet.allowance(
            address, nft_contract.address
        );
        const approval = allowance === MAX_UINT256
            ? NftMinterApproval.approved
            : NftMinterApproval.unapproved;
        return {
            minter: { [Nft.token(token)]: { approval } }
        };
    };
    const nft_image = async (
        level: NftLevel, issue: NftIssue, token: Token
    ) => {
        const nft_token = Nft.token(token);
        const details = (
            image: Partial<NftDetails[0][0]['image']>
        ) => ({
            details: {
                [nft_token]: {
                    [level]: {
                        [issue]: { image }
                    }
                }
            }
        });
        const [url_content, url_market] = await Promise.all([
            await nft_meta({ issue, level, token }).then(
                ({ image }) => image
            ),
            await nft_href({ issue, level, token }),
        ]);
        return details({
            url_market: url_market?.toString() ?? null,
            url_content
        });
    }
    async function nft_meta({ level, issue, token }: {
        level: NftLevel, issue: NftIssue, token: Token
    }) {
        const address = await Blockchain.selectedAddress;
        const avalanche = await Blockchain.isAvalanche();
        return address && avalanche
            ? await NftImageMeta.get(address, { level, issue, token })
            : await NftImageMeta.get(null, { level, issue, token });
    }
    async function nft_href({ level, issue, token }: {
        level: NftLevel, issue: NftIssue, token: Token
    }) {
        const address = await Blockchain.selectedAddress;
        const avalanche = await Blockchain.isAvalanche();
        const nft_wallet = address && avalanche
            ? new NftWallet(address, token)
            : new NftWalletMock(0n, token);
        const nft_id = Nft.coreId({ level, issue });
        const supply = await nft_wallet.totalSupply(nft_id);
        if (supply > 0) {
            const nft_contract = await nft_wallet.contract;
            const market = 'https://opensea.io/assets/avalanche';
            return new URL(`${market}/${nft_contract.address}/${nft_id}`);
        }
        return null;
    }
    /**
     * ui-fallback: on no or wrong chain
     */
    Promise.all([
        Blockchain.isInstalled(),
        Blockchain.isAvalanche()
    ]).then(function initImages([
        installed, avalanche
    ]) {
        const nft_images = async (token: Token) => {
            const nft_images = [];
            for (const level of NftLevels()) {
                for (const issue of Years({ reverse: true })) {
                    nft_images.push(nft_image(level, issue, token));
                }
            }
            const nft_details = await Promise.all([...nft_images]);
            store.dispatch(setNftsUiDetails(
                nft_details.reduce((l, r) => $.extend(true, l, r))
            ));
        };
        if (!installed || !avalanche) {
            onTokenSwitch(store, nft_images);
            nft_images(xtokenOf(store.getState()));
        }
    });
}
export default NftsUiService;
