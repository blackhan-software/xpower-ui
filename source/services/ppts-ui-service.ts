import { Store } from '@reduxjs/toolkit';
import { Blockchain } from '../blockchain';
import { Bus } from '../bus';
import { PptTreasuryFactory } from '../contract';
import { buffered } from '../functions';
import { setPptsUiAmounts, setPptsUiDetails, setPptsUiMinter } from '../redux/actions';
import { onNftChanged, onPptChanged, onTokenSwitch } from '../redux/observers';
import { pptAmounts } from '../redux/reducers';
import { nftTotalBy, pptTotalBy } from '../redux/selectors';
import { AppState } from '../redux/store';
import { Account, Nft, NftIssue, NftLevel, NftLevels, PptAmounts, PptDetails, PptMinterApproval } from '../redux/types';
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
        store.dispatch(setPptsUiAmounts({
            ...ppt_amounts()
        }));
    }));
    onPptChanged(store, buffered(function syncAmounts() {
        store.dispatch(setPptsUiAmounts({
            ...ppt_amounts()
        }));
    }));
    const ppt_amounts = () => {
        const entries = Array.from(NftLevels()).map((nft_level): [
            NftLevel, PptAmounts[NftLevel]
        ] => {
            const { amount: max } = nftTotalBy(store.getState(), {
                level: nft_level
            });
            const { amount: min } = pptTotalBy(store.getState(), {
                level: nft_level
            });
            return [nft_level, {
                amount: max, max, min: -min
            }];
        });
        return {
            amounts: Object.assign(
                pptAmounts(), Object.fromEntries(entries)
            )
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
            levels.map((l) => [
                l, Object.fromEntries(
                    issues.map((i) => [
                        i, { toggled: flag }
                    ])
                )
            ])
        );
        store.dispatch(setPptsUiDetails({ details }));
    });
    /**
     * ui-{image,minter}:
     */
    Blockchain.onceConnect(async function initImagesAndMinter({
        account
    }) {
        const ppt_images = [];
        for (const level of NftLevels()) {
            for (const issue of Years({ reverse: true })) {
                ppt_images.push(ppt_image(level, issue));
            }
        }
        const [approval, ...images] = await Promise.all([
            ppt_approval(account), ...ppt_images
        ]);
        store.dispatch(setPptsUiMinter(
            approval
        ));
        store.dispatch(setPptsUiDetails(
            images.reduce((l, r) => $.extend(true, l, r))
        ));
    });
    const ppt_approval = async (
        address: Account
    ) => {
        const ppt_treasury = PptTreasuryFactory();
        const nft_wallet = new NftWallet(address);
        const approved = await nft_wallet.isApprovedForAll(
            ppt_treasury.address
        );
        const approval = approved
            ? PptMinterApproval.approved
            : PptMinterApproval.unapproved;
        return {
            minter: { approval }
        };
    };
    const ppt_image = async (
        level: NftLevel, issue: NftIssue
    ) => {
        const details = (
            image: Partial<PptDetails[0][0]['image']>
        ) => ({
            details: {
                [level]: {
                    [issue]: { image }
                }
            }
        });
        const [url_content, url_market] = await Promise.all([
            await ppt_meta({ issue, level }).then(
                ({ image }) => image
            ).catch((e) => {
                console.error(e);
                return null;
            }),
            await ppt_href({ issue, level }),
        ]);
        return details({
            url_market: url_market?.toString() ?? null,
            url_content
        });
    }
    async function ppt_meta({ level, issue }: {
        level: NftLevel, issue: NftIssue
    }) {
        const account = await Blockchain.account;
        const avalanche = await Blockchain.isAvalanche();
        return account && avalanche
            ? await PptImageMeta.get(account, { level, issue })
            : await PptImageMeta.get(null, { level, issue });
    }
    async function ppt_href({ level, issue }: {
        level: NftLevel, issue: NftIssue
    }) {
        const account = await Blockchain.account;
        const avalanche = await Blockchain.isAvalanche();
        const ppt_wallet = account && avalanche
            ? new PptWallet(account)
            : new PptWalletMock(0n);
        const ppt_id = Nft.fullId({
            level, issue
        });
        const supply = await ppt_wallet.totalSupply(ppt_id);
        if (supply > 0) {
            const ppt_contract = await ppt_wallet.get;
            const ppt_address = await ppt_contract.getAddress();
            const market = 'https://opensea.io/assets/avalanche';
            return new URL(`${market}/${ppt_address}/${Nft.realId(ppt_id)}`);
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
        const ppt_images = async () => {
            const ppt_images = [];
            for (const level of NftLevels()) {
                for (const issue of Years({ reverse: true })) {
                    ppt_images.push(ppt_image(level, issue));
                }
            }
            const ppt_details = await Promise.all([...ppt_images]);
            store.dispatch(setPptsUiDetails(
                ppt_details.reduce((l, r) => $.extend(true, l, r))
            ));
        };
        if (!installed || !avalanche) {
            onTokenSwitch(store, ppt_images);
            ppt_images();
        }
    });
}
export default PptsUiService;
