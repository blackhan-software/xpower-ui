import { Store } from '@reduxjs/toolkit';
import { Blockchain } from '../blockchain';
import { Bus } from '../bus';
import { buffered } from '../functions';
import { setNftsUiAmounts, setNftsUiDetails, setNftsUiMinter } from '../redux/actions';
import { onAftWalletChanged, onNftChanged, onTokenSwitch } from '../redux/observers';
import { nftAmounts } from '../redux/reducers';
import { aftWalletBy, nftsBy } from '../redux/selectors';
import { AppState } from '../redux/store';
import { Account, Amount, MAX_UINT256, Nft, NftAmounts, NftDetails, NftIssue, NftLevel, NftLevels, NftMinterApproval, Token, TokenInfo } from '../redux/types';
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
    onNftChanged(
        store, buffered(() => sync_amounts())
    );
    onTokenSwitch(
        store, sync_amounts
    );
    function sync_amounts() {
        const { items } = aftWalletBy(
            store.getState()
        );
        const item = items[Token.XPOW];
        if (item !== undefined) {
            store.dispatch(setNftsUiAmounts({
                ...nft_amounts(item)
            }));
        }
    }
    const nft_amounts = (
        { amount }: { amount: Amount }
    ) => {
        const { decimals } = TokenInfo(Token.XPOW);
        const entries = Array.from(NftLevels()).map((nft_level): [
            NftLevel, NftAmounts[NftLevel]
        ] => {
            const amount1m = by_moe(nft_level);
            const amount1b = by_nft_burnable(nft_level);
            const amount2u = by_nft_upgradeable(nft_level);
            const range1 = {
                amount1: amount1m, max1: amount1m, min1: -amount1b
            };
            const range2 = {
                amount2: amount2u, max2: amount2u, min2: 0n
            };
            return [nft_level, { ...range1, ...range2 }];
        });
        return {
            amounts: Object.assign(
                nftAmounts(), Object.fromEntries(entries)
            )
        };
        /**
         * @return number of NFTs (for minting)
         */
        function by_moe(nft_level: NftLevel) {
            const balance = amount / BigInt(10 ** decimals);
            const remainder = balance % 10n ** (BigInt(nft_level) + 3n);
            return remainder / 10n ** BigInt(nft_level);
        }
        /**
         * @return number of NFTs (for burning)
         */
        function by_nft_burnable(
            level: NftLevel, total = 0n
        ) {
            // burn from youngest to oldest (backwards):
            const issues = Array.from(Years()).reverse();
            for (const issue of issues) {
                if (issue + 2 ** (level / 3) - 1 > issues[0]) {
                    continue; // irredeemable
                }
                const nfts = nftsBy(store.getState(), {
                    level, issue
                });
                for (const item of Object.values(nfts.items)) {
                    total += item.amount;
                }
            }
            return total;
        }
        /**
         * @return number of NFTs (for upgrading)
         */
        function by_nft_upgradeable(
            level: NftLevel, total = 0n
        ) {
            if (level < 3) {
                return total;
            }
            for (const issue of Years()) {
                const nfts = nftsBy(store.getState(), {
                    level: level - 3, issue
                });
                for (const item of Object.values(nfts.items)) {
                    total += item.amount / 1000n;
                }
            }
            return total;
        }
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
            levels.map((l) => [
                l, Object.fromEntries(
                    issues.map((i) => [
                        i, { toggled: flag }
                    ])
                )
            ])
        );
        store.dispatch(setNftsUiDetails({ details }));
    });
    /**
     * ui-{image,minter}:
     */
    Blockchain.onceConnect(async function initImagesAndMinter({
        account
    }) {
        const nft_images = [];
        for (const level of NftLevels()) {
            for (const issue of Years({ reverse: true })) {
                nft_images.push(nft_image(level, issue));
            }
        }
        const [approval, ...images] = await Promise.all([
            nft_approval(account), ...nft_images
        ]);
        store.dispatch(setNftsUiMinter(
            approval
        ));
        store.dispatch(setNftsUiDetails(
            images.reduce((l, r) => $.extend(true, l, r))
        ));
    });
    const nft_approval = async (
        address: Account
    ) => {
        const moe_wallet = new MoeWallet(address);
        const nft_wallet = new NftWallet(address);
        const allowance = await moe_wallet.allowance(
            address, await nft_wallet.address
        );
        const approval = allowance === MAX_UINT256
            ? NftMinterApproval.approved
            : NftMinterApproval.unapproved;
        return {
            minter: { approval }
        };
    };
    const nft_image = async (
        level: NftLevel, issue: NftIssue
    ) => {
        const details = (
            image: Partial<NftDetails[0][0]['image']>
        ) => ({
            details: {
                [level]: {
                    [issue]: { image }
                }
            }
        });
        const [url_content, url_market] = await Promise.all([
            await nft_meta({ issue, level }).then(
                ({ image }) => image
            ),
            await nft_href({ issue, level }),
        ]);
        return details({
            url_market: url_market?.toString() ?? null,
            url_content
        });
    }
    async function nft_meta({ level, issue }: {
        level: NftLevel, issue: NftIssue
    }) {
        const address = await Blockchain.account;
        const avalanche = await Blockchain.isAvalanche();
        return address && avalanche
            ? await NftImageMeta.get(address, { level, issue })
            : await NftImageMeta.get(null, { level, issue });
    }
    async function nft_href({ level, issue }: {
        level: NftLevel, issue: NftIssue
    }) {
        const address = await Blockchain.account;
        const avalanche = await Blockchain.isAvalanche();
        const nft_wallet = address && avalanche
            ? new NftWallet(address)
            : new NftWalletMock(0n);
        const nft_id = Nft.fullId({
            level, issue
        });
        const supply = await nft_wallet.totalSupply(nft_id);
        if (supply > 0) {
            const nft_contract = await nft_wallet.get;
            const nft_address = await nft_contract.getAddress();
            const market = 'https://opensea.io/assets/avalanche';
            return new URL(`${market}/${nft_address}/${Nft.realId(nft_id)}`);
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
        const nft_images = async () => {
            const nft_images = [];
            for (const level of NftLevels()) {
                for (const issue of Years({ reverse: true })) {
                    nft_images.push(nft_image(level, issue));
                }
            }
            const nft_details = await Promise.all([...nft_images]);
            store.dispatch(setNftsUiDetails(
                nft_details.reduce((l, r) => $.extend(true, l, r))
            ));
        };
        if (!installed || !avalanche) {
            onTokenSwitch(store, nft_images);
            nft_images();
        }
    });
}
export default NftsUiService;
