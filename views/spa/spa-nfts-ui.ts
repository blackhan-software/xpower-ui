import { Blockchain } from '../../source/blockchain';
import { Bus } from '../../source/bus';
import { buffered } from '../../source/functions';
import { setNftsUiAmounts, setNftsUiDetails, setNftsUiMinter } from '../../source/redux/actions';
import { onAftWalletChanged, onTokenSwitch } from '../../source/redux/observers';
import { nftAmounts } from '../../source/redux/reducers';
import { aftWalletBy, tokenOf } from '../../source/redux/selectors';
import { Store } from '../../source/redux/store';
import { Address, Amount, Balance, MID_UINT256, Nft, NftAmounts, NftDetails, NftIssue, NftLevel, NftLevels, NftMinterApproval, NftTokens, Token } from '../../source/redux/types';
import { MoeWallet, NftWallet, NftWalletMock } from '../../source/wallet';
import { Years } from '../../source/years';
import { NftImageMeta } from '../nfts/details/nft-image-meta';
/**
 * nfts-ui:
 */
onAftWalletChanged(Store.store, buffered((
    token: Token, { amount }: { amount: Amount }
) => {
    Store.dispatch(setNftsUiAmounts({
        ...nft_amounts(token, amount)
    }));
}));
onTokenSwitch(Store.store, (token) => {
    const { items } = aftWalletBy(Store.state, token);
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
    per: () => tokenOf(Store.state)
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
        const market = 'https://nftrade.com/assets/avalanche';
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
        onTokenSwitch(Store.store, nft_images);
        nft_images(tokenOf(Store.state));
    }
});
