import { Blockchain } from '../../source/blockchain';
import { Bus } from '../../source/bus';
import { PptTreasuryFactory } from '../../source/contract';
import { buffered } from '../../source/functions';
import { setPptsUiAmounts, setPptsUiDetails, setPptsUiMinter } from '../../source/redux/actions';
import { pptAmounts } from '../../source/redux/reducers';
import { nftTotalBy, pptTotalBy, tokenOf } from '../../source/redux/selectors';
import { Store } from '../../source/redux/store';
import { Address, Nft, NftIssue, NftLevel, NftLevels, NftToken, NftTokens, PptAmounts, PptDetails, PptMinterApproval, Token } from '../../source/redux/types';
import { NftWallet, PptWallet, PptWalletMock } from '../../source/wallet';
import { Years } from '../../source/years';
import { PptImageMeta } from '../ppts/details/ppt-image-meta';
/**
 * ppts-ui:
 */
Store.onNftChanged(buffered(() => {
    const nft_token = Nft.token(tokenOf(Store.state));
    Store.dispatch(setPptsUiAmounts({
        ...ppt_amounts(nft_token)
    }));
}));
Store.onPptChanged(buffered(() => {
    const nft_token = Nft.token(tokenOf(Store.state));
    Store.dispatch(setPptsUiAmounts({
        ...ppt_amounts(nft_token)
    }));
}));
const ppt_amounts = (
    ppt_token: NftToken
) => {
    const entries = Array.from(NftLevels()).map((nft_level): [
        NftLevel, PptAmounts[NftLevel]
    ] => {
        const { amount: max } = nftTotalBy(Store.state, {
            level: nft_level, token: ppt_token
        });
        const { amount: min } = pptTotalBy(Store.state, {
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
Bus.on('toggle-issue', ({
    level, issue, flag
}) => {
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
    Store.dispatch(setPptsUiDetails({ details }));
});
/**
 * ui-{image,minter}:
 */
Blockchain.onceConnect(async ({
    address, token
}) => {
    const ppt_images = [];
    for (const level of NftLevels()) {
        for (const issue of Years({ reverse: true })) {
            ppt_images.push(ppt_image(level, issue, token));
        }
    }
    const [approval, ...images] = await Promise.all([
        ppt_approval(address, token), ...ppt_images
    ]);
    Store.dispatch(setPptsUiMinter(
        approval
    ));
    Store.dispatch(setPptsUiDetails(
        images.reduce((l, r) => $.extend(true, l, r))
    ));
}, {
    per: () => tokenOf(Store.state)
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
    const ppt_id = Nft.coreId({ level, issue });
    const supply = await ppt_wallet.totalSupply(ppt_id);
    if (supply > 0) {
        const ppt_contract = await ppt_wallet.contract;
        const market = 'https://nftrade.com/assets/avalanche';
        return new URL(`${market}/${ppt_contract.address}/${ppt_id}`);
    }
    return null;
}
/**
 * ui-fallback: on no or wrong chain
 */
Promise.all([
    Blockchain.isInstalled(),
    Blockchain.isAvalanche()
]).then(([
    installed, avalanche
]) => {
    const ppt_images = async (token: Token) => {
        const ppt_images = [];
        for (const level of NftLevels()) {
            for (const issue of Years({ reverse: true })) {
                ppt_images.push(ppt_image(level, issue, token));
            }
        }
        const ppt_details = await Promise.all([...ppt_images]);
        Store.dispatch(setPptsUiDetails(
            ppt_details.reduce((l, r) => $.extend(true, l, r))
        ));
    };
    if (!installed || !avalanche) {
        Store.onTokenSwitch(ppt_images);
        ppt_images(tokenOf(Store.state));
    }
});
