/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Global } from '../../source/types';
declare const global: Global;
import './home.scss';

import { XPower } from '../../source/xpower';
import { OnInit, OnTransfer } from '../../source/xpower';

import { IntervalManager } from '../../source/managers';
import { HashManager } from '../../source/managers';
import { Blockchain } from '../../source/blockchain';
import { Connect, Reconnect } from '../../source/blockchain';
import { Token, TokenSuffix } from '../../source/token';
import { App } from '../../source/app';

import { Alert } from '../../source/functions';
import { alert } from '../../source/functions';
import { delayed } from '../../source/functions';
import { in_range } from '../../source/functions';
import { Address } from '../../source/redux/types';

const { Tooltip } = global.bootstrap as any;

function XPowered() {
    const token = Token.symbolAlt(App.me.params.get('token'));
    const contract_address = $(`#g-xpower-address-${token}`).data('value');
    if (!contract_address) {
        throw new Error(`missing g-xpower-address-${token}`);
    }
    const contract = new XPower(contract_address);
    const instance = contract.connect();
    return instance;
}
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
            $balance.val(await xpower.balanceOf(address));
        });
    }
});
$(window).on('load', function forgetNonces() {
    if (Blockchain.isInstalled()) {
        const im = new IntervalManager({ start: true });
        Blockchain.onceConnect(() => {
            im.on('tick', () => App.me.remove());
        });
    }
});
$(window).on('load', function restartMining() {
    if (Blockchain.isInstalled()) {
        const im = new IntervalManager({ start: true });
        Blockchain.onceConnect(({ address }: Connect) => {
            im.on('tick', () => {
                const miner = App.me.miner(address);
                const running = miner.running;
                if (running) {
                    miner.stop();
                }
                if (running) {
                    $('#toggle-mining').trigger('click');
                }
            });
        });
    }
});
$(window).on('load', async function refreshBlockHash() {
    if (Blockchain.isInstalled()) {
        Blockchain.onceConnect(() => {
            const on_init: OnInit = (block_hash, timestamp) => {
                console.debug('[on:init]', block_hash, timestamp.toHexString());
                const suffix = Token.suffix(App.me.params.get('token'));
                HashManager.set(block_hash, timestamp.toNumber(), {
                    slot: suffix
                });
            };
            const xpower = XPowered();
            xpower.on('Init', on_init);
        });
    }
});
$('#toggle-mining').on('click', async function toggleMining() {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const miner = App.me.miner(address);
    if (miner.running) {
        return miner.stop();
    }
    miner.emit('initializing', {
        block_hash: null
    });
    //
    // if: recent(block-hash?) => mine
    //
    const suffix = Token.suffix(App.me.params.get('token'));
    const block_hash = HashManager.latestHash({
        slot: suffix
    });
    if (typeof block_hash === 'string') {
        const timestamp = HashManager.get(block_hash, {
            slot: suffix
        });
        if (typeof timestamp === 'number') {
            const interval = IntervalManager.intervalFrom(
                new Date(timestamp * 1000)
            );
            if (interval === IntervalManager.interval) {
                return mine(address, block_hash);
            }
        }
    }
    //
    // else: !recent(block-hash?) => init & mine
    //
    HashManager.me.once('block-hash', ({ block_hash }) => {
        mine(address, block_hash);
    });
    const xpower = XPowered();
    try {
        const init = await xpower.init();
        console.debug('[init]', init);
    } catch (ex) {
        HashManager.me.removeAllListeners('block-hash');
        miner.emit('initialized', { block_hash: null });
        console.error(ex);
    }
    function mine(address: Address, block_hash: string) {
        miner.emit('initialized', { block_hash });
        const { min, max } = App.me.range;
        console.debug('[mine]', min, max);
        if (miner.running) {
            miner.stop();
        }
        miner.start(block_hash, (nonce, amount) => {
            if (amount.gt(0) && in_range(amount, {
                min, max: max + 1
            })) {
                const xnonce = nonce.toHexString();
                const value = amount.toNumber();
                /**
                 * @todo: avoid nonce & block-hash concatenation!?
                 */
                App.me.addNonce(address, `${xnonce}-${block_hash}`, value);
            }
        });
    }
});
$(window).on('load', function resetMiningToggle() {
    if (Blockchain.isInstalled()) {
        Blockchain.onConnect(reset);
        Blockchain.onReconnect(({ address }: Reconnect) => {
            if (!App.me.miner(address).running) {
                reset();
            }
        });
    }
    function reset() {
        const $mine = $('#toggle-mining');
        $mine.prop('disabled', false);
        const $spinner = $mine.find('.spinner');
        $spinner.css('visibility', 'hidden');
        $spinner.removeClass('spinner-grow');
        const $text = $mine.find('.text');
        $text.text('Start Mining');
    }
})
$(window).on('load', function toggleInitSpinner() {
    if (Blockchain.isInstalled()) {
        Blockchain.onConnect(({ address }: Connect) => {
            const $mine = $('#toggle-mining');
            const $text = $mine.find('.text');
            const $spinner = $mine.find('.spinner');
            App.me.miner(address).on('initializing', () => {
                $spinner.css('visibility', 'visible');
                $spinner.addClass('spinner-grow');
                $mine.prop('disabled', true);
                $text.text('Initializing Mining…');
            });
            App.me.miner(address).on('initialized', () => {
                $spinner.css('visibility', 'hidden');
                $spinner.removeClass('spinner-grow');
                $mine.prop('disabled', false);
                $text.text('Start Mining');
            });
        });
    }
});
$(window).on('load', function toggleMiningSpinner() {
    if (Blockchain.isInstalled()) {
        Blockchain.onConnect(({ address }: Connect) => {
            const $mine = $('#toggle-mining');
            const $text = $mine.find('.text');
            const $spinner = $mine.find('.spinner');
            App.me.miner(address).on('started', () => {
                $text.text('Stop Mining');
                $spinner.css('visibility', 'visible');
            });
            App.me.miner(address).on('stopped', () => {
                $text.text('Start Mining');
                $spinner.css('visibility', 'hidden');
            });
        });
    }
});
$('#decelerate').on('click', async function decelerateMining() {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    App.me.miner(address).decelerate();
});
$('#accelerate').on('click', async function accelerateMining() {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    App.me.miner(address).accelerate();
});
$(window).on('load', function initSpeed() {
    $('#speed').on('change', (ev, speed) => {
        const speed_pct = `${Math.round(speed * 100)}%`;
        $('#speed').css({ 'width': speed_pct });
        if (speed >= 1) {
            $('#speed').removeClass('with-indicator');
        } else {
            $('#speed').addClass('with-indicator');
        }
        const $progressor = $('#speed').parents('.progressor');
        $progressor.attr('title', `Mining speed: ${speed_pct}`);
        Tooltip.getInstance($progressor).dispose();
        Tooltip.getOrCreateInstance($progressor);
    });
    $('#speed').trigger('change', App.me.speed);
});
$(window).on('load', function controlSpeed() {
    if (Blockchain.isInstalled()) {
        Blockchain.onConnect(() => {
            $('#decelerate').prop('disabled', false);
            $('#accelerate').prop('disabled', false);
        });
        Blockchain.onConnect(({ address }: Connect) => {
            App.me.miner(address).on('accelerated', (ev) => {
                const speed = ev.speed as number;
                const $acc = $('#accelerate');
                Tooltip.getInstance($acc)?.hide();
                const $dec = $('#decelerate');
                Tooltip.getInstance($dec)?.hide();
                if (speed >= 1) {
                    $acc.prop('disabled', true);
                }
                if (speed >= 0) {
                    $dec.prop('disabled', false);
                }
            });
            App.me.miner(address).on('decelerated', (ev) => {
                const speed = ev.speed as number;
                const $acc = $('#accelerate');
                Tooltip.getInstance($acc)?.hide();
                const $dec = $('#decelerate');
                Tooltip.getInstance($dec)?.hide();
                if (speed <= 1) {
                    $acc.prop('disabled', false);
                }
                if (speed <= 0) {
                    $dec.prop('disabled', true);
                }
            });
            App.me.miner(address).on('accelerated', (ev) => {
                const speed = ev.speed as number;
                $('#speed').trigger('change', speed);
            });
            App.me.miner(address).on('decelerated', (ev) => {
                const speed = ev.speed as number;
                $('#speed').trigger('change', speed);
            });
        });
    }
});
$('.mint>button.lhs').on('click', async function mintTokens(
    ev
) {
    const $alerts = $('.alert');
    if ($alerts.length) {
        $alerts.remove();
    }
    const $mint = $(ev.target).parent('.mint');
    const index = parseInt($mint.data('index'));
    const token = App.me.params.get('token');
    const amount = Token.amount(token, index);
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const nonce_and_block_hash = App.me.getNonceBy(address, amount);
    if (!nonce_and_block_hash) {
        throw new Error(`missing nonce & block-hash for amount=${amount}`);
    }
    const [nonce, block_hash] = nonce_and_block_hash.split('-');
    if (!nonce) {
        throw new Error(`missing nonce for amount=${amount}`);
    }
    if (!block_hash) {
        throw new Error(`missing block-hash for amount=${amount}`);
    }
    const xpower = XPowered();
    try {
        const mint = await xpower.mint(nonce, block_hash);
        console.debug('[mint]', mint);
        App.me.removeNonce(address, nonce_and_block_hash);
    } catch (ex: any) {
        if (ex.message && ex.message.match(
            /internal JSON-RPC error/i
        )) {
            if (ex.data && ex.data.message && ex.data.message.match(
                /empty nonce-hash/i
            )) {
                App.me.removeNonce(address, nonce_and_block_hash);
            }
        }
        if (ex.message) {
            const id = nonce_and_block_hash;
            if (ex.data && ex.data.message) {
                const message = `${ex.message} [${ex.data.message}]`;
                $(alert(message, Alert.warning, { id })).insertAfter(
                    $mint
                );
            } else {
                $(alert(ex.message, Alert.warning, { id })).insertAfter(
                    $mint
                );
            }
        }
    }
});
$('.mint>button.rhs').on('click', async function forgetNonces(
    ev
) {
    const $forget = $(ev.target);
    const $mint = $forget.parent('.mint');
    const index = parseInt($mint.data('index'));
    const token = App.me.params.get('token');
    const amount = Token.amount(token, index);
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    App.me.removeNonceByAmount(address, amount);
    Tooltip.getInstance($forget).hide();
});
$(window).on('load', function registerObservers() {
    if (Blockchain.isInstalled()) {
        Blockchain.onceConnect(({ address }: Connect) => {
            const suffix = Token.suffix(App.me.params.get('token'));
            App.me.onNonceAdded(address, function updateTotalPerAmount(
                nonce, { amount }, total
            ) {
                const $mint = $(`.mint[data-amount-${suffix}=${amount}]`);
                $mint.find(`>button`).prop('disabled', !total);
                $mint.find(`>.mid`).text(total);
                if (total
                    || suffix === TokenSuffix.CPU && amount === 1
                    || suffix === TokenSuffix.GPU && amount === 1
                    || suffix === TokenSuffix.ASIC && amount === 15
                ) {
                    $mint.show();
                } else {
                    $mint.hide();
                }
            });
            App.me.onNonceRemoved(address, function updateTotalPerAmount(
                nonce, { amount }, total
            ) {
                const $mint = $(`.mint[data-amount-${suffix}=${amount}]`);
                $mint.find(`>button`).prop('disabled', !total);
                $mint.find(`>.mid`).text(total);
                if (total
                    || suffix === TokenSuffix.CPU && amount === 1
                    || suffix === TokenSuffix.GPU && amount === 1
                    || suffix === TokenSuffix.ASIC && amount === 15
                ) {
                    $mint.show();
                } else {
                    $mint.hide();
                }
            });
        });
    }
});
