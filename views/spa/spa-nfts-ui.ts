import { App } from '../../source/app';
import { Blockchain } from '../../source/blockchain';
import { buffered } from '../../source/functions';
import { setNftsUiAmounts, setNftsUiDetails, setNftsUiFlags, setNftsUiMinter } from '../../source/redux/actions';
import { nftAmounts } from '../../source/redux/reducers';
import { Store } from '../../source/redux/store';
import { Address, Amount, Balance, MID_UINT256, Nft, NftAmounts, NftDetails, NftIssue, NftLevel, NftLevels, NftMinterApproval, NftTokens, Token } from '../../source/redux/types';
import { MoeWallet, NftWallet } from '../../source/wallet';
import { Years } from '../../source/years';
import { nft_href, nft_meta } from '../nfts/nfts';
/**
 * nfts-ui:
 */
Store.onAftWalletChanged(buffered((
    token: Token, { amount }: { amount: Amount }
) => {
    Store.dispatch(setNftsUiAmounts({
        ...nft_amounts(token, amount)
    }));
}));
Store.onTokenSwitch((token) => {
    const { items } = Store.getAftWallet(token);
    const amount = items[token]?.amount;
    if (amount !== undefined) {
        Store.dispatch(setNftsUiAmounts({
            ...nft_amounts(token, amount)
        }));
    }
});
const nft_amounts = (
    token: Token, balance: Balance
) => {
    const nft_token = Nft.token(token);
    const entries = Array.from(NftLevels()).map((nft_level): [
        NftLevel, NftAmounts[NftLevel]
    ] => {
        const remainder = balance % 10n ** (BigInt(nft_level) + 3n);
        const amount = remainder / 10n ** BigInt(nft_level);
        return [nft_level, {
            amount, max: amount, min: 0n
        }];
    });
    return {
        amounts: Object.assign(nftAmounts(), {
            [nft_token]: Object.fromEntries(entries)
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
    Store.dispatch(setNftsUiFlags({ flags }));
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
    Store.dispatch(setNftsUiDetails({ details }));
});
/**
 * ui-{image,minter}:
 */
Blockchain.onceConnect(async ({
    address, token
}) => {
    const nft_images = [];
    for (const level of NftLevels()) {
        for (const issue of Years({ reverse: true })) {
            nft_images.push(nft_image(level, issue, token));
        }
    }
    const [approval, ...images] = await Promise.all([
        nft_approval(address, token), ...nft_images
    ]);
    Store.dispatch(setNftsUiMinter(
        approval
    ));
    Store.dispatch(setNftsUiDetails(
        images.reduce((l, r) => $.extend(true, l, r))
    ));
}, {
    per: () => App.token
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
    const approval = allowance > MID_UINT256
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
/**
 * ui-fallback: on no or wrong chain
 */
Promise.all([
    Blockchain.isInstalled(),
    Blockchain.isAvalanche()
]).then(([
    installed, avalanche
]) => {
    const nft_images = async (token: Token) => {
        const nft_images = [];
        for (const level of NftLevels()) {
            for (const issue of Years({ reverse: true })) {
                nft_images.push(nft_image(level, issue, token));
            }
        }
        const nft_details = await Promise.all([...nft_images]);
        Store.dispatch(setNftsUiDetails(
            nft_details.reduce((l, r) => $.extend(true, l, r))
        ));
    };
    if (!installed || !avalanche) {
        Store.onTokenSwitch(nft_images);
        nft_images(App.token);
    }
});
