/* eslint @typescript-eslint/no-explicit-any: [off] */
import './migrate.scss';

import { Blockchain } from '../../source/blockchain';
import { ChainId } from '../../source/blockchain';
import { Token, TokenSymbolAlt } from '../../source/token';
import { XPower } from '../../source/xpower';

import { Alert } from '../../source/functions';
import { alert } from '../../source/functions';

function XPowered(token: TokenSymbolAlt) {
    const contract_address = $(`#g-xpower-address-${token}`).data('value');
    if (!contract_address) {
        throw new Error(`missing g-xpower-address-${token}`);
    }
    const contract = new XPower(contract_address);
    const instance = contract.connect();
    return instance;
}
$(window).on('load', function enableAllowanceButton() {
    if (Blockchain.isInstalled()) {
        Blockchain.onConnect(() => {
            const $approve = $('#approve-allowance');
            $approve.prop('disabled', false);
        });
    }
});
$('#approve-allowance').on('click', async () => {
    const $approve = $('#approve-allowance')
    const address = $('#minter-address').val();
    if (typeof address !== 'string' || !address) {
        throw new Error('missing minter\'s address');
    }
    const v1_xpower = XPowered(TokenSymbolAlt.OLD);
    const v1_balance = await v1_xpower.balanceOf(address);
    console.debug('[v1:balance]', v1_balance.toNumber());
    if (v1_balance.isZero()) {
        const $alert = $(alert('Old XPOW balance is zero; nothing to migrate here. Is your minter\'s address correct?', Alert.warning));
        $alert.insertAfter($approve.parent('div'));
        $alert.css('margin-top', '1em');
        return;
    }
    const v2_xpower = XPowered(TokenSymbolAlt.GPU);
    const v2_spender = v2_xpower.address;
    const v1_allowance = await v1_xpower.allowance(address, v2_spender);
    console.debug('[v1:allowance]', v1_allowance.toNumber());
    if (v1_allowance.gte(v1_balance)) {
        const $alert = $(alert('XPOW allowance has already been approved; you can migrate now.', Alert.info));
        $alert.insertAfter($approve.parent('div'));
        $alert.css('margin-top', '1em');
        const $execute = $('#execute-migration');
        $execute.prop('disabled', false);
        return;
    }
    try {
        await v1_xpower.increaseAllowance(
            v2_spender, v1_balance.sub(v1_allowance)
        );
        const $alert = $(alert('XPOW allowance has successfully been approved; you can migrate now.', Alert.success));
        $alert.insertAfter($approve.parent('div'));
        $alert.css('margin-top', '1em');
        const $execute = $('#execute-migration');
        $execute.prop('disabled', false);
        return;
    } catch (ex: any) {
        if (ex.message) {
            if (ex.data && ex.data.message) {
                const message = `${ex.message} [${ex.data.message}]`;
                const $alert = $(alert(message, Alert.warning));
                $alert.insertAfter($approve.parent('div'));
                $alert.css('margin-top', '1em');
            } else {
                const $alert = $(alert(ex.message, Alert.warning));
                $alert.insertAfter($approve.parent('div'));
                $alert.css('margin-top', '1em');
            }
        }
        console.error(ex);
        return;
    }
});
$('#execute-migration').on('click', async () => {
    const $execute = $('#execute-migration')
    const address = $('#minter-address').val();
    if (typeof address !== 'string' || !address) {
        throw new Error('missing minter\'s address');
    }
    const v1_xpower = XPowered(TokenSymbolAlt.OLD);
    const v1_balance = await v1_xpower.balanceOf(address);
    console.debug('[v1:balance]', v1_balance.toNumber());
    if (v1_balance.isZero()) {
        const $alert = $(alert('Old XPOW balance is zero; nothing to migrate.', Alert.warning));
        $alert.insertAfter($execute.parent('div'));
        $alert.css('margin-top', '1em');
        return;
    }
    const v2_xpower = XPowered(TokenSymbolAlt.GPU);
    const v2_spender = v2_xpower.address;
    const v1_allowance = await v1_xpower.allowance(address, v2_spender);
    console.debug('[v1:allowance]', v1_allowance.toNumber());
    if (v1_allowance.isZero()) {
        const $alert = $(alert('Old XPOW allowance is zero; approve allowance! Did your allowance transaction actually get confirmed? Wait a little bit and then retry.', Alert.warning));
        $alert.insertAfter($execute.parent('div'));
        $alert.css('margin-top', '1em');
        return;
    }
    try {
        $(`.alert`).remove();
        await v2_xpower.migrate(v1_balance);
        const $alert1 = $(alert('Your XPOW balance has successfully been migrated as XPOW.GPU tokens! ;)', Alert.success, {
            id: 'success'
        }));
        $alert1.insertAfter($execute.parent('div'));
        $alert1.css('margin-top', '1em');
        const $alert2 = $(alert('Don\'t forget to add the new XPOW.CPU, XPOW.GPU and XPOW.ASIC tokens to your Metamask wallet.', Alert.info, {
            id: 'info'
        }));
        $alert2.insertAfter($alert1);
        $alert2.css('margin-top', '1em');
        $('.add-xpow').prop('disabled', false);
        return;
    } catch (ex: any) {
        if (ex.message) {
            if (ex.data && ex.data.message) {
                const message = `${ex.message} [${ex.data.message}]`;
                const $alert = $(alert(message, Alert.warning));
                $alert.insertAfter($execute.parent('div'));
                $alert.css('margin-top', '1em');
            } else {
                const $alert = $(alert(ex.message, Alert.warning));
                $alert.insertAfter($execute.parent('div'));
                $alert.css('margin-top', '1em');
            }
        }
        console.error(ex);
        return;
    }
});
$('#add-xpow-cpu').on('click', async () => {
    if (Blockchain.isInstalled()) {
        if (await Blockchain.isAvalanche()) {
            const token = Token.symbolAlt(TokenSymbolAlt.CPU);
            const address = $(`#g-xpower-address-${token}`).data('value');
            const symbol = $(`#g-xpower-symbol-${token}`).data('value');
            const decimals = $(`#g-xpower-decimals-${token}`).data('value');
            const image = $(`#g-xpower-image-${token}`).data('value');
            await Blockchain.addToken({
                address, symbol, decimals, image
            });
        } else {
            Blockchain.switchTo(ChainId.AVALANCHE_MAINNET);
        }
    } else {
        open('https://metamask.io/download.html');
    }
});
$('#add-xpow-gpu').on('click', async () => {
    if (Blockchain.isInstalled()) {
        if (await Blockchain.isAvalanche()) {
            const token = Token.symbolAlt(TokenSymbolAlt.GPU);
            const address = $(`#g-xpower-address-${token}`).data('value');
            const symbol = $(`#g-xpower-symbol-${token}`).data('value');
            const decimals = $(`#g-xpower-decimals-${token}`).data('value');
            const image = $(`#g-xpower-image-${token}`).data('value');
            await Blockchain.addToken({
                address, symbol, decimals, image
            });
        } else {
            Blockchain.switchTo(ChainId.AVALANCHE_MAINNET);
        }
    } else {
        open('https://metamask.io/download.html');
    }
});
$('#add-xpow-asic').on('click', async () => {
    if (Blockchain.isInstalled()) {
        if (await Blockchain.isAvalanche()) {
            const token = Token.symbolAlt(TokenSymbolAlt.ASIC);
            const address = $(`#g-xpower-address-${token}`).data('value');
            const symbol = $(`#g-xpower-symbol-${token}`).data('value');
            const decimals = $(`#g-xpower-decimals-${token}`).data('value');
            const image = $(`#g-xpower-image-${token}`).data('value');
            await Blockchain.addToken({
                address, symbol, decimals, image
            });
        } else {
            Blockchain.switchTo(ChainId.AVALANCHE_MAINNET);
        }
    } else {
        open('https://metamask.io/download.html');
    }
});
