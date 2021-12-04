/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Global } from '../../source/types';
declare const global: Global;
import './nfts-details';
import './nfts.scss';

import { OnApproval, OnTransfer, OnTransferBatch } from '../../source/xpower';
import { XPower, XPowerNft, Kind, Kinds } from '../../source/xpower';

import { Blockchain } from '../../source/blockchain';
import { Connect } from '../../source/blockchain';
import { delayed } from '../../source/functions';
import { Token } from '../../source/token';
import { App } from '../../source/app';

import { BigNumber, Contract, Transaction } from 'ethers';
import { DeltaYears } from '../../source/years';
const { Tooltip } = global.bootstrap as any;

const MAX_UINT256 = BigNumber.from(2).pow(256).sub(1);
const MID_UINT256 = BigNumber.from(2).pow(255).sub(1);

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
$('.nft-minter .toggle').on('click', function toggleDetails(ev) {
    const $nft_minter = $(ev.target).parents('.nft-minter');
    const kind = $nft_minter.data('kind');
    const $nft_details = $(`.nft-details[data-kind=${kind}]`);
    const display = $nft_details.css('display');
    if (display === 'none') {
        $nft_details.show();
    } else {
        $nft_details.hide();
    }
    if (display === 'none') {
        $nft_minter.trigger('expanded', {
            kind: Kind[kind]
        });
    } else {
        $nft_minter.trigger('collapsed', {
            kind: Kind[kind]
        });
    }
    const $toggle = $nft_minter.find('.toggle');
    if (display === 'none') {
        $toggle.html('<i class="bi-chevron-up"></i>');
        $toggle.attr('title', `Hide ${kind} NFTs`);
    } else {
        $toggle.html('<i class="bi-chevron-down"></i>');
        $toggle.attr('title', `Show ${kind} NFTs`);
    }
    const state = $toggle.data('state');
    if (state === 'on') {
        $toggle.data('state', 'off');
    } else {
        $toggle.data('state', 'on');
    }
    Tooltip.getInstance($toggle).dispose();
    Tooltip.getOrCreateInstance($toggle);
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
$('#balance').on('changed', async function syncBalances() {
    const address = $('#minter-address').val();
    if (typeof address !== 'string' || !address) {
        throw new Error('missing minter\'s address');
    }
    const nft_balances = await nftBalances(
        XPoweredNft()
    );
    const nft_supplies = await nftSupplies(
        XPoweredNft()
    );
    for (const kind of Kinds()) {
        const nft_balance = nftBalance(
            kind, nft_balances
        );
        const nft_supply = nftSupply(
            kind, nft_supplies
        );
        sync(kind, nft_balance, nft_supply);
    }
    async function nftBalances(
        nft: Contract
    ): Promise<BigNumber[]> {
        const nft_ids = await nftIds(nft);
        const addresses = nft_ids.map(() => address);
        return await nft.balanceOfBatch(addresses, nft_ids);
    }
    function nftBalance(
        kind: Kind, nft_balances: BigNumber[],
        nft_balance = BigNumber.from(0)
    ) {
        const kinds = Array.from(Kinds());
        for (const dy of DeltaYears()) {
            const index = Math.floor(kind / 3) + kinds.length * dy;
            nft_balance = nft_balance.add(nft_balances[index]);
        }
        return nft_balance;
    }
    async function nftSupplies(
        nft: Contract
    ): Promise<BigNumber[]> {
        const nft_ids = await nftIds(nft);
        const nft_supplies = [];
        for (const id of nft_ids) {
            nft_supplies.push(await nft.totalSupply(id));
        }
        return nft_supplies;
    }
    function nftSupply(
        kind: Kind, nft_supplies: BigNumber[],
        nft_supply = BigNumber.from(0)
    ) {
        const kinds = Array.from(Kinds());
        for (const dy of DeltaYears()) {
            const index = Math.floor(kind / 3) + kinds.length * dy;
            nft_supply = nft_supply.add(nft_supplies[index]);
        }
        return nft_supply;
    }
    async function nftIds(
        nft: Contract, nft_ids: BigNumber[] = []
    ) {
        for (const dy of DeltaYears()) {
            const nft_year = await XPowerNft.year(nft)(dy);
            nft_ids = nft_ids.concat(await nft.idsBy(
                nft_year, Array.from(Kinds())
            ));
        }
        return nft_ids;
    }
    function sync(
        kind: Kind, nft_balance: BigNumber, nft_supply: BigNumber
    ) {
        const $nft_minter = $(`.nft-minter[data-kind=${Kind[kind]}]`);
        if (nft_balance.gt(0)) {
            $nft_minter.show();
        }
        const $balance = $nft_minter.find('.balance');
        $balance.trigger('changed', { kind, nft_balance });
        setBalance($balance, nft_balance);
        setSupply($balance, nft_supply);
    }
});
$('#balance').on('changed', async function syncAmounts(ev, {
    balance
}) {
    for (const kind of Kinds()) {
        const ten = BigNumber.from(10);
        const amount = balance
            .mod(ten.pow(kind + 3))
            .div(ten.pow(kind));
        sync(kind, amount);
    }
    function sync(
        kind: Kind, amount: BigNumber
    ) {
        const $nft_minter = $(`.nft-minter[data-kind=${Kind[kind]}]`);
        $nft_minter.find('.increase').prop('disabled', true);
        $nft_minter.find('.decrease').prop('disabled', amount.isZero());
        if (amount.gt(0)) {
            const $toggle = $nft_minter.find('.toggle');
            if ($toggle.attr('data-state') === 'off') {
                $toggle.attr('data-state', 'on');
                $toggle.trigger('click');
            }
            $nft_minter.show();
        }
        const $amount = $nft_minter.find('.amount');
        $amount.data('max', `${amount}`);
        $amount.data('min', `${0}`);
        $amount.text(`${amount}`);
    }
});
$('.increase').on('click', function increaseAmount(ev) {
    const delta = ev.ctrlKey ? 100 : ev.shiftKey ? 10 : 1
    const $nft_minter = $(ev.target).parents('.nft-minter');
    const $amount = $nft_minter.find('.amount');
    const amount = parseInt($amount.text());
    const max = parseInt($amount.data('max'))
    const min = parseInt($amount.data('min'))
    if (amount + delta <= max) {
        $amount.text(`${amount + delta}`);
        $amount.trigger('changed', {
            amount: amount + delta, max, min
        });
    }
});
$('.decrease').on('click', function decreaseAmount(ev) {
    const delta = ev.ctrlKey ? 100 : ev.shiftKey ? 10 : 1
    const $nft_minter = $(ev.target).parents('.nft-minter');
    const $amount = $nft_minter.find('.amount');
    const amount = parseInt($amount.text());
    const max = parseInt($amount.data('max'))
    const min = parseInt($amount.data('min'))
    if (amount - delta >= min) {
        $amount.text(`${amount - delta}`);
        $amount.trigger('changed', {
            amount: amount - delta, max, min
        });
    }
});
$('.amount').on('click', function toggleAmount(ev) {
    const $nft_minter = $(ev.target).parents('.nft-minter');
    const $amount = $nft_minter.find('.amount');
    const amount = parseInt($amount.text());
    const max = parseInt($amount.data('max'))
    const min = parseInt($amount.data('min'))
    if (amount === max) {
        $amount.text(`${min}`);
        $amount.trigger('changed', {
            amount: min, max, min
        });
    }
    if (amount === min || amount < max) {
        $amount.text(`${max}`);
        $amount.trigger('changed', {
            amount: max, max, min
        });
    }
});
$('.amount').on('changed', function onAmountChanged(ev, {
    amount, max, min
}) {
    const $nft_minter = $(ev.target).parents('.nft-minter');
    const $increase = $nft_minter.find('.increase');
    $increase.prop('disabled', amount >= max);
    Tooltip.getInstance($increase).hide();
    const $decrease = $nft_minter.find('.decrease');
    $decrease.prop('disabled', amount <= min);
    Tooltip.getInstance($decrease).hide();
});
$(window).on('load', function checkAllowance() {
    if (Blockchain.isInstalled()) {
        Blockchain.onceConnect(async ({ address }: Connect) => {
            const xpower = XPowered();
            const xpower_nft = XPoweredNft();
            const allowance = await xpower.allowance(
                address, xpower_nft.address
            );
            const balance = await xpower.balanceOf(
                address
            );
            const $approval = $('#burn-approval');
            const $minter = $('#batch-minter');
            const $balance = $('#balance');
            if (MID_UINT256.gt(allowance)) {
                $approval.prop('disabled', false);
                $approval.show();
            } else {
                $approval.prop('disabled', true);
                $approval.remove();
            }
            if (MID_UINT256.gt(allowance)) {
                $minter.prop('disabled', true);
                $minter.removeClass('full');
            } else {
                $balance.on('changed', async (ev, { balance }) => {
                    $minter.prop('disabled', balance.isZero());
                });
                $minter.prop('disabled', balance.isZero());
                $minter.addClass('full');
            }
        });
    }
});
$('#burn-approval').on('click', async function increaseAllowance() {
    const address = $('#minter-address').val();
    if (typeof address !== 'string' || !address) {
        throw new Error('missing minter\'s address');
    }
    const xpower = XPowered();
    const xpower_nft = XPoweredNft();
    const old_allowance = await xpower.allowance(
        address, xpower_nft.address
    );
    const $approval = $('#burn-approval');
    if (MAX_UINT256.gt(old_allowance)) {
        const on_approval: OnApproval = (
            owner, spender, value, ev
        ) => {
            if (ev.transactionHash !== tx?.hash) {
                return;
            }
            console.debug('[on:approval]',
                owner, spender, value.toBigInt(), ev
            );
            $approval.trigger('approved', {
                ok: true
            });
        };
        let tx: Transaction | undefined;
        try {
            $approval.trigger('approving');
            xpower.on('Approval', on_approval);
            tx = await xpower.increaseAllowance(
                xpower_nft.address, MAX_UINT256.sub(old_allowance)
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
            const $approval = $('#burn-approval');
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
            const $approval = $('#burn-approval');
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
$('#batch-minter').on('click', async function batchMintNfts() {
    const address = $('#minter-address').val();
    if (typeof address !== 'string' || !address) {
        throw new Error('missing minter\'s address');
    }
    const nfts = [] as Array<{ kind: Kind, amount: number }>;
    for (const kind of Kinds()) {
        const $nft_minter = $(`.nft-minter[data-kind=${Kind[kind]}]`);
        const amount = parseInt($nft_minter.find('.amount').text());
        if (amount > 0) nfts.push({ kind, amount });
    }
    const xpower_nft = XPoweredNft();
    const kinds = nfts.map((nft) => nft.kind);
    const amounts = nfts.map((nft) => nft.amount);
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
        const $balance = $('#balance');
        const balance = BigNumber.from(
            $balance.val() as string
        );
        $balance.trigger('changed', {
            balance // refresh
        });
        $minter.trigger('minted', {
            ok: true
        });
    };
    const $minter = $('#batch-minter');
    let tx: Transaction | undefined;
    try {
        $minter.trigger('minting');
        xpower_nft.on('TransferBatch', on_batch_tx);
        tx = await xpower_nft.mintBatch(kinds, amounts);
    } catch (ex) {
        $minter.trigger('minted', {
            ok: false, error: ex
        });
        console.error(ex);
    }
});
$(window).on('load', function toggleMinter() {
    const $minter = $('#batch-minter');
    $minter.on('minting', () => {
        $minter.prop('disabled', true);
    });
    $minter.on('minted', async (ev, { ok }) => {
        const address = $('#minter-address').val();
        if (typeof address !== 'string' || !address) {
            throw new Error('missing minter\'s address');
        }
        if (ok) {
            const xpower = XPowered();
            const balance = await xpower.balanceOf(address);
            $minter.prop('disabled', balance.isZero());
        } else {
            $minter.prop('disabled', false);
        }
    });
    const $approval = $('#burn-approval');
    $approval.on('approved', (ev, { ok }) => {
        if (ok) {
            $minter.prop('disabled', false);
            $minter.addClass('full');
        } else {
            $minter.prop('disabled', true);
            $minter.removeClass('full');
        }
    });
});
$(window).on('load', function toggleMinterSpinner() {
    const $minter = $('#batch-minter');
    const $text = $minter.find('.text');
    const $spinner = $minter.find('.spinner');
    $minter.on('minting', () => {
        $spinner.css('visibility', 'visible');
        $spinner.addClass('spinner-grow');
        $text.text('Batch Minting NFTs…');
    });
    $minter.on('minted', () => {
        $spinner.css('visibility', 'hidden');
        $spinner.removeClass('spinner-grow');
        $text.text('Batch Mint NFTs');
    });
});
$('#toggle-all').on('click', function toggleAll() {
    const $toggle_all = $('#toggle-all');
    const state = $toggle_all.data('state');
    if (state === 'off') {
        $toggle_all.data('state', 'on');
        $toggle_all.attr('title', `Hide higher level NFTs`);
        $toggle_all.html('<i class="bi-chevron-up"></i>');
    } else {
        $toggle_all.data('state', 'off');
        $toggle_all.attr('title', `Show all NFTs`);
        $toggle_all.html('<i class="bi-chevron-down"></i>');
    }
    if (state === 'off') {
        $('.nft-minter').show();
    } else {
        $('.nft-minter').each((i, el) => {
            const $nft_minter = $(el);
            const $balance = $nft_minter.find('.balance');
            const balance = getBalance($balance);
            const $amount = $nft_minter.find('.amount');
            const amount = parseInt($amount.text());
            if (balance.isZero() && (
                isNaN(amount) || amount === 0
            )) {
                $nft_minter.hide();
                $nft_minter.next().hide();
                $nft_minter.find('.toggle').html(
                    '<i class="bi-chevron-down"></i>'
                );
            }
        });
    }
    Tooltip.getInstance($toggle_all).dispose();
    Tooltip.getOrCreateInstance($toggle_all);
});
$(window).on('load', function hideNftMinters() {
    $('.nft-minter').hide();
});
function getBalance(
    $el: JQuery<HTMLElement>
): BigNumber {
    const balance = $el.data('balance') ?? '0';
    return BigNumber.from(
        typeof balance === 'number'
            ? balance : parseInt(balance));
}
function getSupply(
    $el: JQuery<HTMLElement>
): BigNumber {
    const supply = $el.data('supply') ?? '0';
    return BigNumber.from(
        typeof supply === 'number'
            ? supply : parseInt(supply));
}
function setBalance(
    $el: JQuery<HTMLElement>, balance: BigNumber
) {
    $el.data('balance', balance);
    const supply = getSupply($el);
    if (document.body.clientWidth > 576) {
        $el.text(`${balance.toString()} / ${supply}`);
    } else {
        $el.text(`${balance.toString()}`);
    }
}
function setSupply(
    $el: JQuery<HTMLElement>, supply: BigNumber
) {
    $el.data('supply', supply);
    const balance = getBalance($el);
    if (document.body.clientWidth > 576) {
        $el.text(`${balance.toString()} / ${supply}`);
    } else {
        $el.text(`${balance.toString()}`);
    }
}
