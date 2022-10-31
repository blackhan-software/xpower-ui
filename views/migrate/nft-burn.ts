/* eslint @typescript-eslint/no-explicit-any: [off] */
import './nft-burn.scss';

import { BigNumber } from 'ethers';
import { Blockchain } from '../../source/blockchain';
import { XPowerNftFactory } from '../../source/contract';
import { Alert, alert, Alerts, x40 } from '../../source/functions';
import { Nft, NftLevels, Token } from '../../source/redux/types';
import { Years } from '../../source/years';

$('button.burn-empty-nft').on('click', async function burnEmpty(e) {
    const $burn = $(e.target);
    if ($burn.hasClass('thor')) {
        await burn(Token.THOR, { $burn });
    }
    if ($burn.hasClass('loki')) {
        await burn(Token.LOKI, { $burn });
    }
    if ($burn.hasClass('odin')) {
        await burn(Token.ODIN, { $burn });
    }
});
async function burn(token: Token, { $burn }: {
    $burn: JQuery<HTMLElement>
}) {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const src_version = $burn.data('source');
    if (!src_version) {
        throw new Error('missing data-source');
    }
    const src_xpower = await XPowerNftFactory({
        token, version: src_version
    });
    console.debug(
        `[${src_version}:contract]`, src_xpower.address
    );
    const ids = Nft.coreIds({
        issues: Array.from(Years()),
        levels: Array.from(NftLevels())
    });
    const accounts = ids.map(() => {
        return x40(address);
    });
    const v3a_balances: BigNumber[] = await src_xpower.balanceOfBatch(
        accounts, ids
    );
    console.debug(
        `[${src_version}:balances]`, v3a_balances.map((b) => b.toString())
    );
    const zz = filter(ids, v3a_balances, {
        zero: true
    });
    Alerts.hide();
    try {
        await src_xpower.burnBatch(
            x40(address), zz.ids, zz.balances
        );
        alert(
            `Your old empty NFTs have successfully been burned! ;)`,
            Alert.success, { id: 'success', after: $burn.parent('div')[0] }
        );
        return;
    } catch (ex: any) {
        if (ex.message) {
            if (ex.data && ex.data.message) {
                ex.message = `${ex.message} [${ex.data.message}]`;
            }
            alert(ex.message, Alert.warning, {
                after: $burn.parent('div')[0]
            });
        }
        console.error(ex);
    }
}
function filter<I, B extends BigNumber>(
    ids: Array<I>, balances: Array<B>, { zero }: { zero: boolean }
) {
    const ids_nz = [];
    const balances_nz = [];
    for (let i = 0; i < balances.length; i++) {
        if (balances[i].isZero() === zero) {
            balances_nz.push(balances[i]);
            ids_nz.push(ids[i]);
        }
    }
    return { ids: ids_nz, balances: balances_nz };
}
