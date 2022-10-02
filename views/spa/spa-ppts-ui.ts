import { App } from '../../source/app';
import { Blockchain } from '../../source/blockchain';
import { PptTreasuryFactory } from '../../source/contract';
import { buffered } from '../../source/functions';
import { pptAmounts } from '../../source/redux/reducers';
import { Address, Nft, NftIssue, NftLevel, NftLevels, NftToken, NftTokens, PptAmounts, PptDetails, PptMinterApproval, Token } from '../../source/redux/types';
import { NftWallet } from '../../source/wallet';
import { Years } from '../../source/years';
import { ppt_href, ppt_meta } from '../ppts/ppts';
/**
 * ppts-ui:
 */
App.onNftChanged(buffered(() => {
    const nft_token = Nft.token(App.token);
    App.setPptsUiAmounts({ ...ppt_amounts(nft_token) });
}));
App.onPptChanged(buffered(() => {
    const nft_token = Nft.token(App.token);
    App.setPptsUiAmounts({ ...ppt_amounts(nft_token) });
}));
const ppt_amounts = (
    ppt_token: NftToken
) => {
    const entries = Array.from(NftLevels()).map((nft_level): [
        NftLevel, PptAmounts[NftLevel]
    ] => {
        const { amount: max } = App.getNftTotalBy({
            level: nft_level, token: ppt_token
        });
        const { amount: min } = App.getPptTotalBy({
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
 * ui-list:
 */
App.event.on('toggle-level', ({
    level, flag
}) => {
    const levels = level !== undefined
        ? [level] : Array.from(NftLevels());
    const flags = Object.fromEntries(
        levels.map((l) => [l, { toggled: flag }])
    );
    App.setPptsUiFlags({ flags });
});
/**
 * ui-details:
 */
App.event.on('toggle-issue', ({
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
    App.setPptsUiDetails({ details });
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
    App.setPptsUiMinter(
        approval
    );
    App.setPptsUiDetails(
        images.reduce((l, r) => $.extend(true, l, r))
    );
}, {
    per: () => App.token
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
        App.setPptsUiDetails(
            ppt_details.reduce((l, r) => $.extend(true, l, r))
        );
    };
    if (!installed || !avalanche) {
        App.onTokenSwitch(ppt_images);
        ppt_images(App.token);
    }
});
