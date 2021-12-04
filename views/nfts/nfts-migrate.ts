import './nfts-migrate.scss';

import { OnApprovalForAll, OnTransfer, OnTransferBatch } from '../../source/xpower';
import { XPower, XPowerNft, Kinds } from '../../source/xpower';

import { Blockchain } from '../../source/blockchain';
import { Connect } from '../../source/blockchain';
import { delayed } from '../../source/functions';
import { Token } from '../../source/token';
import { App } from '../../source/app';

import { BigNumber, Transaction } from 'ethers';

function XPowered() {
    const token = Token.symbolAlt(App.me.params.get('token'));
    const element_id = `#g-xpower-address-${token}`;
    const contract_address = $(element_id).data('value');
    if (!contract_address) {
        throw new Error(`missing ${element_id}`);
    }
    const contract = new XPower(contract_address);
    return contract.connect(); // instance
}
function XPoweredNft(version?: 'v1' | 'v2') {
    if (typeof version === 'undefined') {
        version = App.me.params.get('nft') === 'v1' ? 'v1' : 'v2';
    }
    const token = Token.symbolAlt(App.me.params.get('token'));
    const element_id = `#g-xpower-nft-address-${version}-${token}`;
    const contract_address = $(element_id).data('value');
    if (!contract_address) {
        throw new Error(`missing ${element_id}`);
    }
    const contract = new XPowerNft(contract_address);
    return contract.connect(); // instance
}
$(window).on('load', async function activateSelector() {
    const suffix = Token.suffix(App.me.params.get('token'));
    $(`.selector-${suffix}`).addClass('active');
});
$(window).on('load', function syncBalance() {
    if (Blockchain.isInstalled()) {
        Blockchain.onceConnect(async ({ address }: Connect) => {
            const on_transfer: OnTransfer = async (from, to, amount) => {
                console.debug('[on:transfer]', from, to, amount.toBigInt());
                if (address.match(new RegExp(from, 'i')) ||
                    address.match(new RegExp(to, 'i'))
                ) {
                    const balance = await xpower.balanceOf(address);
                    $balance.trigger('changed', { balance });
                    $balance.val(balance);
                }
            };
            const xpower = XPowered();
            xpower.on('Transfer', delayed(on_transfer, 600));
            const $balance = $('#balance');
            const balance = await xpower.balanceOf(address);
            $balance.trigger('changed', { balance });
            $balance.val(balance);
        });
    }
});
$(window).on('load', function checkApproval() {
    if (Blockchain.isInstalled()) {
        Blockchain.onceConnect(async ({ address }: Connect) => {
            const nft_v1 = XPoweredNft('v1');
            const nft_v2 = XPoweredNft('v2');
            const is_approved = await nft_v1.isApprovedForAll(
                address, nft_v2.address
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
    }
});
 $('#migrate-approval').on('click', async function setApproval() {
    const address = $('#minter-address').val();
    if (typeof address !== 'string' || !address) {
        throw new Error('missing minter\'s address');
    }
    const nft_v1 = XPoweredNft('v1');
    const nft_v2 = XPoweredNft('v2');
    const is_approved = await nft_v1.isApprovedForAll(
        address, nft_v2.address
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
            $approval.trigger('approved', {
                ok: approved
            });
        };
        let tx: Transaction | undefined;
        try {
            $approval.trigger('approving');
            nft_v1.on('ApprovalForAll', on_approval);
            tx = await nft_v1.setApprovalForAll(
                nft_v2.address, true
            );
        } catch (ex) {
            $approval.trigger('approved', {
                ok: false, error: ex
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
    if (Blockchain.isInstalled()) {
        Blockchain.onConnect(() => {
            const $approval = $('#migrate-approval');
            $approval.on('approving', () => {
                $approval.prop('disabled', true);
            });
            $approval.on('approved', (ev, { ok }) => {
                $approval.prop('disabled', false);
                if (ok) $approval.remove();
            });
        });
    }
});
$(window).on('load', function toggleApprovalSpinner() {
    if (Blockchain.isInstalled()) {
        Blockchain.onConnect(() => {
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
        });
    }
});
$('#migrate').on('click', async function migrateNfts() {
    const address = $('#minter-address').val();
    if (typeof address !== 'string' || !address) {
        throw new Error('missing minter\'s address');
    }
    const nft_v1 = XPoweredNft('v1');
    const kinds = Array.from(Kinds());
    const year = parseInt(App.me.params.get('year') ?? '2021');
    const ids = await nft_v1.idsBy(year || 2021, kinds);
    const addresses = Array.from(Kinds()).map(() => address);
    const balances: BigNumber[] = await nft_v1.balanceOfBatch(
        addresses, ids
    );
    const nfts = [] as Array<{
        id: BigNumber, amount: BigNumber
    }>;
    for (let i=0; i<balances.length; i++) {
        if (!balances[i].isZero()) {
            nfts.push({id: ids[i], amount: balances[i]});
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
            op, from, to, ids.map((id) => id.toBigInt()),
            values.map((value) => value.toBigInt()), ev
        );
        $migrate.trigger('migrated', { ok: true });
    };
    const $migrate = $('#migrate');
    let tx: Transaction | undefined;
    if (nfts.length > 0) {
        try {
            $migrate.trigger('migrating');
            const nft_v2 = XPoweredNft('v2');
            nft_v2.on('TransferBatch', on_batch_tx);
            tx = await nft_v2.migrateBatch(nft_ids, nft_amounts);
        } catch (ex) {
            $migrate.trigger('migrated', { ok: false, error: ex });
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
    $approval.on('approved', (ev, { ok }) => {
        if (ok) {
            $migrate.prop('disabled', false);
            $migrate.addClass('full');
        } else {
            $migrate.prop('disabled', true);
            $migrate.removeClass('full');
        }
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
    $migrate.on('migrated', (ev, { ok }) => {
        $spinner.css('visibility', 'hidden');
        $spinner.removeClass('spinner-grow');
        if (ok) {
            $text.html('Migrated NFTs <i class="bi bi-check-circle-fill float-end"></i>');
        } else {
            $text.text('Migrate NFTs');
        }
    });
});
