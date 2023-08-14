import './version-select.scss';

import { Blockchain } from '../../source/blockchain';
import { nice_si, x40, zip } from '../../source/functions';
import { ROParams, RWParams } from '../../source/params';
import { Account, Balance, Nft, NftLevels, Token, TokenInfo } from '../../source/redux/types';
import { Tokenizer } from '../../source/token';
import { Version, Versions } from '../../source/types';
import { MoeWallet, NftWallet, PptWallet, SovWallet } from '../../source/wallet';
import { Years } from '../../source/years';

$(window).on('load', function setVersion() {
    const $select = $('#version-select');
    $select.val(RWParams.versionSource);
    $select.find('option[value=v00]').remove()
});
Blockchain.onConnect(async function setBalances() {
    const versions = Array.from(Versions())
        .filter((v) => ROParams.lt2(v, ROParams.versionTarget)).reverse();
    const balances = versions.map(
        (version) => get_balances(RWParams.token, version)
    );
    for (const [version, balance] of zip(versions, balances)) {
        set_balances(RWParams.token, version, await balance);
    }
    const $select = $('#version-select');
    $select.next('.info').removeClass('loading');
    $select.prop('disabled', false);
});
async function get_balances(
    token: Token, version: Version
) {
    const account = await Blockchain.account;
    if (!account) {
        throw new Error('missing account');
    }
    const ids = Nft.fullIds({
        issues: Array.from(Years()),
        levels: Array.from(NftLevels())
    });
    const accounts = ids.map(() => {
        return x40(account);
    });
    const {
        moe_contract, sov_contract,
        nft_contract, ppt_contract,
    } = await contracts({
        account, token, version
    });
    let moe = 0n;
    if (moe_contract) {
        moe = await moe_contract.balance;
    }
    let sov = 0n;
    if (sov_contract) {
        sov = await sov_contract.balance;
    }
    let nft = 0n;
    if (nft_contract) {
        const nfts: Balance[] = await nft_contract.get.then(
            (c) => c.balanceOfBatch(accounts, Nft.realIds(ids, { version }))
        );
        nft = nfts.reduce((a, n, i) => a + n * 10n ** BigInt(Nft.level(ids[i])), 0n);
    }
    let ppt = 0n;
    if (ppt_contract) {
        const ppts: Balance[] = await ppt_contract.get.then(
            (c) => c.balanceOfBatch(accounts, Nft.realIds(ids, { version }))
        );
        ppt = ppts.reduce((a, p, i) => a + p * 10n ** BigInt(Nft.level(ids[i])), 0n);
    }
    return { moe, sov, nft: nft + ppt };
}
function set_balances(
    token: Token, version: Version, balance: {
        moe: Balance, sov: Balance, nft: Balance
    }
) {
    const $option = $(
        `#version-select>option[value=${version}]`
    );
    const xtoken = Tokenizer.xify(token);
    const atoken = Tokenizer.aify(token);
    const ntoken = 'NFTs';
    const { decimals: moe_decimals } = TokenInfo(xtoken, version);
    const { decimals: sov_decimals } = TokenInfo(atoken, version);
    const moe_base = 10 ** moe_decimals;
    const sov_base = 10 ** sov_decimals;
    const moe_text
        = `${xtoken}=${nice_si(balance.moe, { base: moe_base })}`;
    const sov_text
        = `${atoken}=${nice_si(balance.sov, { base: sov_base })}`;
    const nft_text
        = `${ntoken}=${nice_si(balance.nft)}`;
    const opt_text = $option.text()
        .replace(new RegExp(xtoken + '=0'), moe_text)
        .replace(new RegExp(atoken + '=0'), sov_text)
        .replace(new RegExp('NFTs' + '=0'), nft_text);
    $option.html(opt_text);
}
$('#version-select').on('change tap', function selectVersion(e) {
    const version = $(e.currentTarget).val() as Version;
    if (RWParams.versionSource !== version) {
        RWParams.versionSource = version;
        location.reload();
    }
});
$('.selectors>a').on('click', function selectToken(e) {
    const $target = $(e.currentTarget);
    if ($target.hasClass('selector-xpow')) {
        RWParams.token = Token.XPOW;
    }
    e.stopPropagation();
    e.preventDefault();
    location.reload();
});
async function contracts({
    account, token, version
}: {
    account: Account, token: Token, version: Version
}) {
    let moe_contract: MoeWallet | undefined;
    try {
        moe_contract = new MoeWallet(account, token, version);
    } catch (ex) {
        if (`${ex}`.match(/missing\sg/) === null) {
            console.error(ex);
        }
    }
    let sov_contract: SovWallet | undefined;
    try {
        sov_contract = new SovWallet(account, token, version);
    } catch (ex) {
        if (`${ex}`.match(/missing\sg/) === null) {
            console.error(ex);
        }
    }
    let nft_contract: NftWallet | undefined;
    try {
        nft_contract = new NftWallet(account, token, version);
    } catch (ex) {
        if (`${ex}`.match(/missing\sg/) === null) {
            console.error(ex);
        }
    }
    let ppt_contract: PptWallet | undefined;
    try {
        ppt_contract = new PptWallet(account, token, version);
    } catch (ex) {
        if (`${ex}`.match(/missing\sg/) === null) {
            console.error(ex);
        }
    }
    return {
        moe_contract,
        sov_contract,
        nft_contract,
        ppt_contract
    };
}
