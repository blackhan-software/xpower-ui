import { Store } from '@reduxjs/toolkit';
import { Blockchain } from '../blockchain';
import { Bus } from '../bus';
import { PptTreasuryFactory } from '../contract';
import { buffered } from '../functions';
import { setPptsUiAmounts, setPptsUiDetails, setPptsUiMinter } from '../redux/actions';
import { onNftChanged, onPptChanged, onTokenSwitch } from '../redux/observers';
import { pptAmounts } from '../redux/reducers';
import { nftTotalBy, pptTotalBy, xtokenOf } from '../redux/selectors';
import { AppState } from '../redux/store';
import { Address, Nft, NftIssue, NftLevel, NftLevels, NftToken, NftTokens, PptAmounts, PptDetails, PptMinterApproval, Token } from '../redux/types';
import { NftWallet, PptWallet, PptWalletMock } from '../wallet';
import { Years } from '../years';

import { PptImageMeta } from '../../views/ppts/details/ppt-image-meta';

export const PptsUiService = (
    store: Store<AppState>
) => {
    /**
     * ppt-amounts
     */
    onNftChanged(store, buffered(function syncAmounts() {
        const nft_token = Nft.token(xtokenOf(store.getState()));
        store.dispatch(setPptsUiAmounts({
            ...ppt_amounts(nft_token)
        }));
    }));
    onPptChanged(store, buffered(function syncAmounts() {
        const nft_token = Nft.token(xtokenOf(store.getState()));
        store.dispatch(setPptsUiAmounts({
            ...ppt_amounts(nft_token)
        }));
    }));
    const ppt_amounts = (
        ppt_token: NftToken
    ) => {
        const entries = Array.from(NftLevels()).map((nft_level): [
            NftLevel, PptAmounts[NftLevel]
        ] => {
            const { amount: max } = nftTotalBy(store.getState(), {
                level: nft_level, token: ppt_token
            });
            const { amount: min } = pptTotalBy(store.getState(), {
                level: nft_level, token: ppt_token
            });
            return [nft_level, {
                amount: max, max, min: -min
            }];
        });
        return {
            amounts: Object.assign(pptAmounts(), {
                [ppt_token]: Object.fromEntries(entries)
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
        store.dispatch(setPptsUiDetails({ details }));
    });
    /**
     * ui-{image,minter}:
     */
    Blockchain.onceConnect(async function initImagesAndMinter({
        address, token
    }) {
        const ppt_images = [];
        for (const level of NftLevels()) {
            for (const issue of Years({ reverse: true })) {
                ppt_images.push(ppt_image(level, issue, token));
            }
        }
        const [approval, ...images] = await Promise.all([
            ppt_approval(address, token), ...ppt_images
        ]);
        store.dispatch(setPptsUiMinter(
            approval
        ));
        store.dispatch(setPptsUiDetails(
            images.reduce((l, r) => $.extend(true, l, r))
        ));
    }, {
        per: () => xtokenOf(store.getState())
    });
    const ppt_approval = async (
        address: Address, token: Token
    ) => {
        const ppt_treasury = await PptTreasuryFactory({ token });
        const nft_wallet = new NftWallet(address, token);
        const approved = await nft_wallet.isApprovedForAll(
            ppt_treasury.address
        );
        const approval = approved
            ? PptMinterApproval.approved
            : PptMinterApproval.unapproved;
        return {
            minter: { [Nft.token(token)]: { approval } }
        };
    };
    const ppt_image = async (
        level: NftLevel, issue: NftIssue, token: Token
    ) => {
        const ppt_token = Nft.token(token);
        const details = (
            image: Partial<PptDetails[0][0]['image']>
        ) => ({
            details: {
                [ppt_token]: {
                    [level]: {
                        [issue]: { image }
                    }
                }
            }
        });
        const [url_content, url_market] = await Promise.all([
            await ppt_meta({ issue, level, token }).then(
                ({ image }) => image
            ),
            await ppt_href({ issue, level, token }),
        ]);
        return details({
            url_market: url_market?.toString() ?? null,
            url_content
        });
    }
    async function ppt_meta({ level, issue, token }: {
        level: NftLevel, issue: NftIssue, token: Token
    }) {
        const address = await Blockchain.selectedAddress;
        const avalanche = await Blockchain.isAvalanche();
        return address && avalanche
            ? await PptImageMeta.get(address, { level, issue, token })
            : await PptImageMeta.get(null, { level, issue, token });
    }
    async function ppt_href({ level, issue, token }: {
        level: NftLevel, issue: NftIssue, token: Token
    }) {
        const address = await Blockchain.selectedAddress;
        const avalanche = await Blockchain.isAvalanche();
        const ppt_wallet = address && avalanche
            ? new PptWallet(address, token)
            : new PptWalletMock(0n, token);
        const ppt_id = Nft.fullId({
            level, issue, token: Nft.token(token)
        });
        const supply = await ppt_wallet.totalSupply(ppt_id);
        if (supply > 0) {
            const ppt_contract = await ppt_wallet.contract;
            const market = 'https://opensea.io/assets/avalanche';
            return new URL(`${market}/${ppt_contract.address}/${Nft.realId(ppt_id)}`);
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
        const ppt_images = async (token: Token) => {
            const ppt_images = [];
            for (const level of NftLevels()) {
                for (const issue of Years({ reverse: true })) {
                    ppt_images.push(ppt_image(level, issue, token));
                }
            }
            const ppt_details = await Promise.all([...ppt_images]);
            store.dispatch(setPptsUiDetails(
                ppt_details.reduce((l, r) => $.extend(true, l, r))
            ));
        };
        if (!installed || !avalanche) {
            onTokenSwitch(store, ppt_images);
            ppt_images(xtokenOf(store.getState()));
        }
    });
}
export default PptsUiService;
