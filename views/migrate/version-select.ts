import './version-select.scss';

import { BigNumber } from 'ethers';
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
    const { address, token } = await context();
    const versions = Array.from(Versions())
        .filter((v) => v !== ROParams.versionTarget)
        .reverse();
    const ids = Nft.coreIds({
        issues: Array.from(Years()),
        levels: Array.from(NftLevels())
    });
    const accounts = ids.map(() => {
        return x40(address);
    });
    for (const version of versions) {
        let moe = BigNumber.from(0);
        try {
            const moe_contract = await XPowerMoeFactory({
                token, version
            });
            moe = await moe_contract.balanceOf(x40(address));
        } catch (ex) {
            if (`${ex}`.match(/missing\sg/) === null) {
                console.error(ex);
            }
        }
        let sov = BigNumber.from(0);
        try {
            const sov_contract = await XPowerSovFactory({
                token, version
            });
            sov = await sov_contract.balanceOf(x40(address));
        } catch (ex) {
            if (`${ex}`.match(/missing\sg/) === null) {
                console.error(ex);
            }
        }
        let nft = BigNumber.from(0);
        try {
            const nft_contract = await XPowerNftFactory({
                token, version
            });
            const nfts: BigNumber[] = await nft_contract.balanceOfBatch(
                accounts, ids
            );
            nft = nfts.reduce((a, n) => a.add(n), BigNumber.from(0));
        } catch (ex) {
            if (`${ex}`.match(/missing\sg/) === null) {
                console.error(ex);
            }
        }
        let ppt = BigNumber.from(0);
        try {
            const ppt_contract = await XPowerPptFactory({
                token, version
            });
            const ppts: BigNumber[] = await ppt_contract.balanceOfBatch(
                accounts, ids
            );
            ppt = ppts.reduce((a, p) => a.add(p), BigNumber.from(0));
        } catch (ex) {
            if (`${ex}`.match(/missing\sg/) === null) {
                console.error(ex);
            }
        }
        set_balances(token, version, {
            moe, sov, nft: nft.add(ppt)
        });
        const $select = $('#version-select');
        $select.next('.info').removeClass('loading');
        $select.prop('disabled', false);
    }
    function set_balances(
        token: Token, version: Version, value: {
            moe: BigNumber, sov: BigNumber, nft: BigNumber
        }
    ) {
        const $option = $(
            `#version-select>option[value=${version}]`
        );
        const xtoken = Tokenizer.xify(token);
        const moe_text
            = `${xtoken}${value.moe.isZero() ? '=' : '>'}0`;
        const atoken = Tokenizer.aify(token);
        const sov_text
            = `${atoken}${value.sov.isZero() ? '=' : '>'}0`;
        const ntoken = 'NFTs';
        const nft_text
            = `${ntoken}${value.nft.isZero() ? '=' : '>'}0`;
        const opt_text = $option.text()
            .replace(new RegExp(xtoken + '=0'), moe_text)
            .replace(new RegExp(atoken + '=0'), sov_text)
            .replace(new RegExp('NFTs' + '=0'), nft_text);
        $option.html(opt_text);
    }
});
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
async function context() {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    return { address, token: RWParams.token };
}
