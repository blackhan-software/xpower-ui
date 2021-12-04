/* eslint @typescript-eslint/no-explicit-any: [off] */
import './nfts.scss';

import { OnTransferSingle } from '../../source/xpower';
import { Kind, XPowerNft } from '../../source/xpower';
import { Token } from '../../source/token';
import { App } from '../../source/app';

import { BigNumber, Transaction } from 'ethers';
import { DeltaYears } from '../../source/years';

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
$('.nft-minter>.balance').on('changed', async function setDetails(
    ev, { kind }: { kind: Kind }
) {
    const address = $('#minter-address').val();
    if (typeof address !== 'string' || !address) {
        throw new Error('missing minter\'s address');
    }
    const $nft_minter = $(ev.target).parents(
        '.nft-minter'
    );
    const $nft_details = $nft_minter.siblings(
        `.nft-details[data-kind=${Kind[kind]}]`
    );
    const nft = XPoweredNft();
    for (const dy of DeltaYears()) {
        const nft_year = await XPowerNft.year(nft)(dy);
        const nft_id = await nft.idBy(nft_year, kind);
        const $row = $nft_details.find(
            `.row[data-year=${nft_year.toNumber()}]`
        );
        const $supply = $row.find('.nft-total-supply>input');
        $supply.val(await nft.totalSupply(nft_id));
        $supply.trigger('change');
        const $balance = $row.find('.nft-balance>input');
        $balance.val(await nft.balanceOf(address, nft_id));
        $balance.trigger('change');
    }
});
$('.nft-minter').on('expanded', async function setImage(
    ev, { kind }: { kind: Kind }
) {
    const $nft_details = $(
        `.nft-details[data-kind=${Kind[kind]}]`
    );
    const nft = XPoweredNft();
    for (const dy of DeltaYears()) {
        const nft_year = await XPowerNft.year(nft)(dy);
        const nft_id = await nft.idBy(nft_year, kind);
        const $row = $nft_details.find(
            `.row[data-year=${nft_year.toNumber()}]`
        );
        const meta = await XPowerNft.meta(nft)(nft_id);
        const $image = $row.find('.nft-image');
        if ($image.attr('src') !== meta.image) {
            $image.attr('src', meta.image);
            $image.show();
        }
    }
});
$('.nft-image').on('load', function clearImageSpinner(ev) {
    const $image = $(ev.target);
    $image.siblings('.spinner').hide();
});
$('.nft-balance>input').on(
    'change', enableTransferToAndAmount
);
function enableTransferToAndAmount(
    ev: JQuery.TriggeredEvent
) {
    const $balance = $(ev.target);
    const balance = parseInt($balance.val() as string);
    if (!isNaN(balance) && balance > 0) {
        const $row = $balance.parents('.row')
        const $transfer_to = $row.find('.nft-transfer-to>input');
        $transfer_to.prop('disabled', false);
        $transfer_to.css('cursor', 'text');
        const $transfer_amount = $row.find('.nft-transfer-amount>input');
        $transfer_amount.prop('disabled', false);
        $transfer_amount.css('cursor', 'text');
    }
}
$('.nft-transfer-to>input').on(
    'change', validateTransferTo
);
$('.nft-transfer-to>input').on(
    'input', validateTransferTo
);
function validateTransferTo(ev: JQuery.TriggeredEvent) {
    // get tx-address:
    const $transfer_to = $(ev.target).parents('.nft-transfer-to');
    const $address_to = $transfer_to.find('>input');
    const address_to = $address_to.val() as string;
    // validate tx-address:
    if (!address_to) {
        $address_to.removeClass('is-valid');
        $address_to.removeClass('is-invalid');
    } else if (address_to.match(/^0x([0-9a-f]{40})/i)) {
        $address_to.addClass('is-valid');
        $address_to.removeClass('is-invalid');
    } else {
        $address_to.removeClass('is-valid');
        $address_to.addClass('is-invalid');
    }
}
$('.nft-transfer-to>input').on(
    'change', toggleSenderTxTo
);
$('.nft-transfer-to>input').on(
    'input', toggleSenderTxTo
);
function toggleSenderTxTo(ev: JQuery.TriggeredEvent) {
    // get tx-address:
    const $transfer_to = $(ev.target).parents('.nft-transfer-to');
    const $address_to = $transfer_to.find('>input');
    const address_to = $address_to.val() as string;
    // get tx-amount:
    const $transfer_amount = $transfer_to.siblings('.nft-transfer-amount');
    const $amount = $transfer_amount.find('>input');
    const amount = parseInt($amount.val() as string);
    // get nft-balance:
    const $nft_balance = $transfer_to.siblings('.nft-balance');
    const $balance = $nft_balance.find('>input');
    const balance = parseInt($balance.val() as string);
    // toggle sender:
    const $nft_sender = $transfer_to.siblings('.nft-sender');
    const $sender = $nft_sender.find('.sender');
    if (amount > 0 && amount <= balance &&
        address_to.match(/^0x([0-9a-f]{40})/i)
    ) {
        $sender.prop('disabled', false);
    } else {
        $sender.prop('disabled', true);
    }
}
$('.nft-transfer-amount>input').on(
    'change', validateTransferAmount
);
$('.nft-transfer-amount>input').on(
    'input', validateTransferAmount
);
function validateTransferAmount(ev: JQuery.TriggeredEvent) {
    // get tx-amount:
    const $transfer_amount = $(ev.target).parents('.nft-transfer-amount');
    const $amount = $transfer_amount.find('>input');
    const amount = parseInt($amount.val() as string);
    // get nft-balance:
    const $nft_balance = $transfer_amount.siblings('.nft-balance');
    const $balance = $nft_balance.find('>input');
    const balance = parseInt($balance.val() as string);
    // validate tx-amount:
    if (!$amount.val()) {
        $amount.removeClass('is-valid');
        $amount.removeClass('is-invalid');
    } else if (isNaN(amount) || amount <= 0 || amount > balance) {
        $amount.removeClass('is-valid');
        $amount.addClass('is-invalid');
    } else {
        $amount.addClass('is-valid');
        $amount.removeClass('is-invalid');
    }
}
$('.nft-transfer-amount>input').on(
    'input', toggleSenderTxAmount
);
$('.nft-transfer-amount>input').on(
    'change', toggleSenderTxAmount
);
function toggleSenderTxAmount(ev: JQuery.TriggeredEvent) {
    // get tx-amount:
    const $transfer_amount = $(ev.target).parents('.nft-transfer-amount');
    const $amount = $transfer_amount.find('>input');
    const amount = parseInt($amount.val() as string);
    // get tx-address:
    const $transfer_to = $transfer_amount.siblings('.nft-transfer-to');
    const $address_to = $transfer_to.find('>input');
    const address_to = $address_to.val() as string;
    // get nft-balance:
    const $nft_balance = $transfer_amount.siblings('.nft-balance');
    const $balance = $nft_balance.find('>input');
    const balance = parseInt($balance.val() as string);
    // toggle sender:
    const $nft_sender = $transfer_amount.siblings('.nft-sender');
    const $sender = $nft_sender.find('.sender');
    if (amount > 0 && amount <= balance &&
        address_to.match(/^0x([0-9a-f]{40})/i)
    ) {
        $sender.prop('disabled', false);
    } else {
        $sender.prop('disabled', true);
    }
}
$('.nft-sender>.sender').on('click', async function transferNft(ev) {
    const address = $('#minter-address').val();
    if (typeof address !== 'string' || !address) {
        throw new Error('missing minter\'s address');
    }
    const $nft_sender = $(ev.target).parents('.nft-sender');
    const $sender = $nft_sender.find('.sender');
    const $transfer_to = $nft_sender.siblings('.nft-transfer-to');
    const $address_to = $transfer_to.find('>input');
    const $transfer_amount = $nft_sender.siblings('.nft-transfer-amount');
    const $amount = $transfer_amount.find('>input');
    const kind = $nft_sender.data('kind');
    const address_to = $address_to.val() as string;
    const amount = parseInt($amount.val() as string);
    const nft = XPoweredNft();
    const $row = $nft_sender.parents('.row.year');
    const now_year = new Date().getUTCFullYear();
    const nft_year = await XPowerNft.year(nft)(
        now_year - parseInt($row.data('year'))
    );
    const id = await nft.idBy(nft_year, Kind[kind]);
    const on_single_tx: OnTransferSingle = async (
        op, from, to, id, value, ev
    ) => {
        if (ev.transactionHash !== tx?.hash) {
            return;
        }
        console.debug('[on:transfer-single]',
            op, from, to, id.toBigInt(),
            value.toBigInt(), ev
        );
        const $balance = $row.find('.nft-balance>input');
        $balance.val(await nft.balanceOf(address, id));
        $sender.trigger('sent', { kind, id });
    };
    let tx: Transaction | undefined;
    try {
        $sender.trigger('sending', { kind, id });
        nft.on('TransferSingle', on_single_tx);
        tx = await nft.safeTransferFrom(
            address, address_to, id, amount, []
        );
    } catch (ex) {
        $sender.trigger('error', {
            kind, id, error: ex
        });
        console.error(ex);
    }
});
$(window).on('load', function toggleSender() {
    const $sender = $('.nft-sender>.sender');
    $sender.on('sending', disableSender);
    $sender.on('error', enableSender);
    $sender.on('sent', disableSender);
    $sender.on('sent', resetAmount);
    function disableSender(
        ev: JQuery.TriggeredEvent
    ) {
        const $sender = $(ev.target);
        $sender.prop('disabled', true);
    }
    function enableSender(
        ev: JQuery.TriggeredEvent
    ) {
        const $sender = $(ev.target);
        $sender.prop('disabled', false);
    }
    function resetAmount(
        ev: JQuery.TriggeredEvent
    ) {
        const $sender = $(ev.target);
        const $nft_sender = $sender.parents('.nft-sender');
        const $transfer_amount = $nft_sender.siblings('.nft-transfer-amount');
        const $amount = $transfer_amount.find('>input');
        $amount.removeClass('is-valid');
        $amount.removeClass('is-invalid');
        $amount.val('');
    }
});
$(window).on('load', function toggleSenderSpinner() {
    const $sender = $('.nft-sender>.sender');
    $sender.on('sending', showSpinner);
    $sender.on('error', hideSpinner);
    $sender.on('sent', hideSpinner);
    function showSpinner(
        ev: JQuery.TriggeredEvent, { kind }: { kind: string }
    ) {
        const $sender = $(ev.target);
        const $spinner = $sender.find('.spinner');
        $spinner.css('visibility', 'visible');
        $spinner.addClass('spinner-grow');
        $sender.prop('disabled', true);
        const $text = $sender.find('.text');
        $text.text(`Sending ${kind} NFTs…`);
    }
    function hideSpinner(
        ev: JQuery.TriggeredEvent, { kind }: { kind: string }
    ) {
        const $sender = $(ev.target);
        const $spinner = $sender.find('.spinner');
        $spinner.css('visibility', 'hidden');
        $spinner.removeClass('spinner-grow');
        const $text = $sender.find('.text');
        $text.text(`Send ${kind} NFTs`);
    }
});
$(window).on('load', function syncBalances() {
    const $nft_sender = $('.nft-sender');
    const $sender = $nft_sender.find('.sender');
    $sender.on('sent', () => {
        const $balance = $('#balance');
        const balance = BigNumber.from(
            $balance.val() as string
        );
        $balance.trigger('changed', {
            balance // refresh
        });
    });
});
$('.sender-expander').on('click', function showSend(ev) {
    const $expander = $(ev.target).parents('.nft-sender-expander');
    $expander.hide();
    const $transfer_label = $expander.siblings('.nft-transfer-to-label');
    $transfer_label.removeClass('d-none');
    const $transfer = $expander.siblings('.nft-transfer-to');
    $transfer.removeClass('d-none');
    const $amount_label = $expander.siblings('.nft-transfer-amount-label');
    $amount_label.removeClass('d-none');
    const $amount = $expander.siblings('.nft-transfer-amount');
    $amount.removeClass('d-none');
    const $sender = $expander.siblings('.nft-sender');
    $sender.removeClass('d-none');
});
