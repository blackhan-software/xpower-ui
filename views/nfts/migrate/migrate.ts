import './migrate.scss';

import { App } from '../../../source/app';
import { Blockchain } from '../../../source/blockchain';
import { hex_40 } from '../../../source/functions';
import { BigNumber, Transaction } from 'ethers';
import { Address } from '../../../source/redux/types';
import { Amount } from '../../../source/redux/types';
import { NftLevels } from '../../../source/redux/types';
import { XPowerNftFactory } from '../../../source/xpower';
import { OnApprovalForAll } from '../../../source/xpower';
import { OnTransferBatch } from '../../../source/xpower';

$('#connect-metamask').on('connected', async function checkApproval(ev, {
    address
}: {
    address: Address
}) {
    const nft_v1 = XPowerNftFactory({ version: 'v1' });
    const nft_v2 = XPowerNftFactory({ version: 'v2' });
    const is_approved = await nft_v1.isApprovedForAll(
        hex_40(address), nft_v2.address
    );
    const $approval = $('#migrate-approval');
    if (is_approved === true) {
        $approval.prop('disabled', true);
        $approval.remove();
    } else {
        $approval.prop('disabled', false);
        $approval.show();
    }
    const $migrate = $('#migrate');
    if (is_approved === true) {
        $migrate.prop('disabled', false);
        $migrate.addClass('full');
    } else {
        $migrate.prop('disabled', true);
        $migrate.removeClass('full');
    }
});
$('#migrate-approval').on('click', async function setApproval() {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const nft_v1 = XPowerNftFactory({ version: 'v1' });
    const nft_v2 = XPowerNftFactory({ version: 'v2' });
    const is_approved = await nft_v1.isApprovedForAll(
        hex_40(address), nft_v2.address
    );
    const $approval = $('#migrate-approval');
    if (is_approved === false) {
        const on_approval: OnApprovalForAll = (
            account, operator, approved, ev
        ) => {
            if (ev.transactionHash !== tx?.hash) {
                return;
            }
            console.debug('[on:approval-for-all]',
                account, operator, approved, ev
            );
            if (approved) {
                $approval.trigger('approved');
            } else {
                $approval.trigger('error');
            }
        };
        let tx: Transaction | undefined;
        try {
            $approval.trigger('approving');
            nft_v1.on('ApprovalForAll', on_approval);
            tx = await nft_v1.setApprovalForAll(
                nft_v2.address, true
            );
        } catch (ex) {
            $approval.trigger('error', {
                error: ex
            });
            console.error(ex);
        }
    } else {
        $approval.trigger('approved', {
            ok: true
        });
    }
});
$(window).on('load', function toggleApproval() {
    const $approval = $('#migrate-approval');
    $approval.on('approving', () => {
        $approval.prop('disabled', true);
    });
    $approval.on('approved', () => {
        $approval.prop('disabled', false);
        $approval.remove();
    });
    $approval.on('error', () => {
        $approval.prop('disabled', false);
    });
});
$(window).on('load', function toggleApprovalSpinner() {
    const $approval = $('#migrate-approval');
    const $text = $approval.find('.text');
    const $spinner = $approval.find('.spinner');
    $approval.on('approving', () => {
        $spinner.css('visibility', 'visible');
        $spinner.addClass('spinner-grow');
        $text.text('Approving…');
    });
    $approval.on('approved', () => {
        $spinner.css('visibility', 'hidden');
        $spinner.removeClass('spinner-grow');
        $text.text('Approve');
    });
    $approval.on('error', () => {
        $spinner.css('visibility', 'hidden');
        $spinner.removeClass('spinner-grow');
        $text.text('Approve');
    });
});
$('#migrate').on('click', async function migrateNfts() {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const nft_v1 = XPowerNftFactory({ version: 'v1' });
    const levels = Array.from(NftLevels());
    const year = Number(App.params.get('year') ?? '2021');
    const ids = await nft_v1.idsBy(year || 2021, levels);
    const addresses = Array.from(NftLevels()).map(() => hex_40(address));
    const balances: BigNumber[] = await nft_v1.balanceOfBatch(
        addresses, ids
    );
    const nfts = [] as Array<{
        id: number, amount: Amount
    }>;
    for (let i = 0; i < balances.length; i++) {
        if (!balances[i].isZero()) {
            nfts.push({
                id: ids[i].toNumber(),
                amount: balances[i].toBigInt()
            });
        }
    }
    const nft_ids = nfts.map((nft) => nft.id);
    const nft_amounts = nfts.map((nft) => nft.amount);
    const on_batch_tx: OnTransferBatch = async (
        op, from, to, ids, values, ev
    ) => {
        if (ev.transactionHash !== tx?.hash) {
            return;
        }
        console.debug('[on:transfer-batch]',
            op, from, to, ids.map((id) => id.toString()),
            values.map((v) => v.toBigInt()), ev
        );
        $migrate.trigger('migrated');
    };
    const $migrate = $('#migrate');
    let tx: Transaction | undefined;
    if (nfts.length > 0) {
        try {
            $migrate.trigger('migrating');
            const nft_v2 = XPowerNftFactory({ version: 'v2' });
            nft_v2.on('TransferBatch', on_batch_tx);
            tx = await nft_v2.migrateBatch(nft_ids, nft_amounts);
        } catch (ex) {
            $migrate.trigger('error', { error: ex });
            console.error(ex);
        }
    } else {
        $migrate.trigger('migrated', { ok: true });
    }
});
$(window).on('load', function toggleMigrate() {
    const $migrate = $('#migrate');
    $migrate.on('migrating', () => {
        $migrate.prop('disabled', true);
    });
    $migrate.on('migrated', async () => {
        $migrate.prop('disabled', false);
    });
    const $approval = $('#migrate-approval');
    $approval.on('approved', () => {
        $migrate.prop('disabled', false);
        $migrate.addClass('full');
    });
    $approval.on('rejected', () => {
        $migrate.prop('disabled', true);
        $migrate.removeClass('full');
    });
});
$(window).on('load', function toggleMigrateSpinner() {
    const $migrate = $('#migrate');
    const $text = $migrate.find('.text');
    const $spinner = $migrate.find('.spinner');
    $migrate.on('migrating', () => {
        $spinner.css('visibility', 'visible');
        $spinner.addClass('spinner-grow');
        $text.text('Migrating NFTs…');
    });
    $migrate.on('migrated', () => {
        $spinner.css('visibility', 'hidden');
        $spinner.removeClass('spinner-grow');
        $text.html('Migrated NFTs <i class="bi bi-check-circle-fill float-end"></i>');
    });
    $migrate.on('error', () => {
        $spinner.css('visibility', 'hidden');
        $spinner.removeClass('spinner-grow');
        $text.text('Migrate NFTs');
    });
});
