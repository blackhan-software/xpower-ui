import './version-select.scss';

import { BigNumber, Contract } from 'ethers';
import { Blockchain } from '../../source/blockchain';
import { XPowerMoeFactory, XPowerNftFactory, XPowerPptFactory, XPowerSovFactory } from '../../source/contract';
import { x40 } from '../../source/functions';
import { ROParams, RWParams } from '../../source/params';
import { Nft, NftLevels, Token } from '../../source/redux/types';
import { Tokenizer } from '../../source/token';
import { Version, Versions } from '../../source/types';
import { Years } from '../../source/years';

$(window).on('load', function setVersion() {
    const $select = $('#version-select');
    $select.val(RWParams.versionSource);
    $select.find('option[value=v00]').remove()
});
Blockchain.onConnect(async function setBalances() {
    const versions = Array.from(Versions())
        .filter((v) => v < ROParams.versionTarget).reverse();
    const balances = versions.map((version) => ({
        version, balance: get_balances(RWParams.token, version)
    }));
    for (const { version, balance } of balances) {
        set_balances(RWParams.token, version, await balance);
    }
    const $select = $('#version-select');
    $select.next('.info').removeClass('loading');
    $select.prop('disabled', false);
});
async function get_balances(
    token: Token, version: Version
) {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const ids = Nft.fullIds({
        issues: Array.from(Years()),
        levels: Array.from(NftLevels()),
        token: Nft.token(token)
    });
    const accounts = ids.map(() => {
        return x40(address);
    });
    const {
        moe_contract, sov_contract,
        nft_contract, ppt_contract,
    } = await contracts({
        token, version
    });
    let moe = BigNumber.from(0);
    if (moe_contract) {
        moe = await moe_contract.balanceOf(x40(address));
    }
    let sov = BigNumber.from(0);
    if (sov_contract) {
        sov = await sov_contract.balanceOf(x40(address));
    }
    let nft = BigNumber.from(0);
    if (nft_contract) {
        const nfts: BigNumber[] = await nft_contract.balanceOfBatch(
            accounts, Nft.realIds(ids, { version })
        );
        nft = nfts.reduce((a, n) => a.add(n), BigNumber.from(0));
    }
    let ppt = BigNumber.from(0);
    if (ppt_contract) {
        const ppts: BigNumber[] = await ppt_contract.balanceOfBatch(
            accounts, Nft.realIds(ids, { version })
        );
        ppt = ppts.reduce((a, p) => a.add(p), BigNumber.from(0));
    }
    return { moe, sov, nft: nft.add(ppt) };
}
function set_balances(
    token: Token, version: Version, balance: {
        moe: BigNumber, sov: BigNumber, nft: BigNumber
    }
) {
    const $option = $(
        `#version-select>option[value=${version}]`
    );
    const xtoken = Tokenizer.xify(token);
    const moe_text
        = `${xtoken}${balance.moe.isZero() ? '=' : '>'}0`;
    const atoken = Tokenizer.aify(token);
    const sov_text
        = `${atoken}${balance.sov.isZero() ? '=' : '>'}0`;
    const ntoken = 'NFTs';
    const nft_text
        = `${ntoken}${balance.nft.isZero() ? '=' : '>'}0`;
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
    if ($target.hasClass('selector-thor')) {
        RWParams.token = Token.THOR;
    }
    if ($target.hasClass('selector-loki')) {
        RWParams.token = Token.LOKI;
    }
    if ($target.hasClass('selector-odin')) {
        RWParams.token = Token.ODIN;
    }
    if ($target.hasClass('selector-hela')) {
        RWParams.token = Token.HELA;
    }
    e.stopPropagation();
    e.preventDefault();
    location.reload();
});
async function contracts({
    token, version
}: {
    token: Token, version: Version
}) {
    let moe_contract: Contract | undefined;
    try {
        moe_contract = await XPowerMoeFactory({
            token, version
        }).connect();
    } catch (ex) {
        if (`${ex}`.match(/missing\sg/) === null) {
            console.error(ex);
        }
    }
    let sov_contract: Contract | undefined;
    try {
        sov_contract = await XPowerSovFactory({
            token, version
        }).connect();
    } catch (ex) {
        if (`${ex}`.match(/missing\sg/) === null) {
            console.error(ex);
        }
    }
    let nft_contract: Contract | undefined;
    try {
        nft_contract = await XPowerNftFactory({
            token, version
        });
    } catch (ex) {
        if (`${ex}`.match(/missing\sg/) === null) {
            console.error(ex);
        }
    }
    let ppt_contract: Contract | undefined;
    try {
        ppt_contract = await XPowerPptFactory({
            token, version
        });
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
