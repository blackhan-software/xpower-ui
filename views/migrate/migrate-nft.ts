/* eslint @typescript-eslint/no-explicit-any: [off] */
import './migrate-nft.scss';

import { Blockchain } from '../../source/blockchain';
import { BigNumber } from 'ethers';
import { alert, Alert, x40 } from '../../source/functions';
import { Nft, NftLevels, Token } from '../../source/redux/types';
import { XPowerNftFactory } from '../../source/xpower';
import { Years } from '../../source/years';

$(window).on('load', function enableAllowanceButton() {
    if (Blockchain.isInstalled()) {
        Blockchain.onConnect(() => {
            const $approve = $('.approve-allowance-nft');
            $approve.prop('disabled', false);
        });
    }
});
$('button.approve-allowance-nft').on('click', async function approveTokens(ev) {
    const $approve = $(ev.target);
    if ($approve.hasClass('cpu')) {
        await approve(Token.CPU, {
            $approve, $execute: $('.execute-migration-nft.cpu')
        });
    }
    if ($approve.hasClass('gpu')) {
        await approve(Token.GPU, {
            $approve, $execute: $('.execute-migration-nft.gpu')
        });
    }
    if ($approve.hasClass('asic')) {
        await approve(Token.ASIC, {
            $approve, $execute: $('.execute-migration-nft.asic')
        });
    }
});
async function approve(token: Token, { $approve, $execute }: {
    $approve: JQuery<HTMLElement>, $execute: JQuery<HTMLElement>
}) {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const v2_xpower = XPowerNftFactory({ token, version: 'v2' });
    const v3_xpower = XPowerNftFactory({ token, version: 'v3' });
    const v2_approved = await v2_xpower.isApprovedForAll(
        x40(address), v3_xpower.address
    );
    if (v2_approved) {
        const $alert = $(alert(`XPOW.${token} NFTs have already been approved for; you can migrate now.`, Alert.info));
        $alert.insertAfter($approve.parent('div'));
        $execute.prop('disabled', false);
        return;
    }
    try {
        await v2_xpower.setApprovalForAll(
            v3_xpower.address, true
        );
        const $alert = $(alert(`XPOW.${token} NFTs have successfully been approved for; you can migrate now.`, Alert.success));
        $alert.insertAfter($approve.parent('div'));
        $execute.prop('disabled', false);
        return;
    } catch (ex: any) {
        if (ex.message) {
            if (ex.data && ex.data.message) {
                const message = `${ex.message} [${ex.data.message}]`;
                const $alert = $(alert(message, Alert.warning));
                $alert.insertAfter($approve.parent('div'));
            } else {
                const $alert = $(alert(ex.message, Alert.warning));
                $alert.insertAfter($approve.parent('div'));
            }
        }
        console.error(ex);
        return;
    }
}
$('button.execute-migration-nft').on('click', async function migrateTokens(ev) {
    const $execute = $(ev.target);
    if ($execute.hasClass('cpu')) {
        await migrate(Token.CPU, { $execute });
    }
    if ($execute.hasClass('gpu')) {
        await migrate(Token.GPU, { $execute });
    }
    if ($execute.hasClass('asic')) {
        await migrate(Token.ASIC, { $execute });
    }
});
async function migrate(token: Token, { $execute }: {
    $execute: JQuery<HTMLElement>
}) {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const v2_xpower = XPowerNftFactory({ token, version: 'v2' });
    const v3_xpower = XPowerNftFactory({ token, version: 'v3' });
    const v2_approved = await v2_xpower.isApprovedForAll(
        x40(address), v3_xpower.address
    );
    if (v2_approved === false) {
        const $alert = $(alert(`Old XPOW.${token} NFTs have not been approved for! Did your approval transaction actually get confirmed? Wait a little bit and then retry.`, Alert.warning));
        $alert.insertAfter($execute.parent('div'));
        return;
    }
    const ids = Nft.coreIds({
        issues: Array.from(Years()),
        levels: Array.from(NftLevels())
    });
    const accounts = ids.map(() => {
        return x40(address);
    });
    const v2_balances: BigNumber[] = await v2_xpower.balanceOfBatch(
        accounts, ids
    );
    console.debug('[v2:balances]', v2_balances.map((b) => b.toString()));
    const v2_zero = v2_balances.reduce((acc, b) => acc && b.isZero(), true);
    if (v2_zero) {
        const $alert = $(alert(`Your old XPOW.${token} NFT balances are zero; nothing to migrate here. Do you have the correct wallet address selected?`, Alert.warning));
        $alert.insertAfter($execute.parent('div'));
        return;
    }
    try {
        $(`.alert`).remove();
        await v3_xpower.migrateBatch(ids, v2_balances);
        const $alert = $(alert(`Your old XPOW.${token} NFTs have successfully been migrated! ;)`, Alert.success, {
            id: 'success'
        }));
        $alert.insertAfter($execute.parent('div'));
        $alert.css('margin-top', '1em');
        return;
    } catch (ex: any) {
        if (ex.message) {
            if (ex.data && ex.data.message) {
                const message = `${ex.message} [${ex.data.message}]`;
                const $alert = $(alert(message, Alert.warning));
                $alert.insertAfter($execute.parent('div'));
            } else {
                const $alert = $(alert(ex.message, Alert.warning));
                $alert.insertAfter($execute.parent('div'));
            }
        }
        console.error(ex);
        return;
    }
}
