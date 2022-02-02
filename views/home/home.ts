/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Global } from '../../source/types';
declare const global: Global;
import './home.scss';

import { App } from '../../source/app';
import { Tokenizer } from '../../source/token';

import { Blockchain } from '../../source/blockchain';
import { Connect } from '../../source/blockchain';
import { Reconnect } from '../../source/blockchain';

import { Alert } from '../../source/functions';
import { alert } from '../../source/functions';
import { x64 } from '../../source/functions';

import { HashManager } from '../../source/managers';
import { IntervalManager } from '../../source/managers';

import { Address } from '../../source/redux/types';
import { Amount } from '../../source/redux/types';
import { BlockHash } from '../../source/redux/types';
import { Nonce } from '../../source/redux/types';
import { Token } from '../../source/redux/types';

import { OnInit } from '../../source/wallet';
import { Wallet } from '../../source/wallet';

const { Tooltip } = global.bootstrap as any;

$(window).on('load', function initLevels() {
    const { min, max } = App.level;
    $(`.mint[data-level=${min}]`).show();
    $(`.mint`).filter((i, el) => $(el).data('level') < min).remove();
    $(`.mint`).filter((i, el) => $(el).data('level') > max).remove();
});
$(window).on('load', function forgetNonces() {
    if (Blockchain.isInstalled()) {
        const im = new IntervalManager({ start: true });
        Blockchain.onceConnect(() => {
            im.on('tick', () => App.removeNonces());
        });
    }
});
$(window).on('load', function restartMining() {
    if (Blockchain.isInstalled()) {
        const im = new IntervalManager({ start: true });
        Blockchain.onceConnect(({ address }: Connect) => {
            im.on('tick', () => {
                const miner = App.miner(address);
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
        Blockchain.onceConnect(({ address }) => {
            const on_init: OnInit = (block_hash, timestamp) => {
                console.debug('[on:init]', x64(block_hash), timestamp);
                const suffix = Tokenizer.suffix(App.token);
                HashManager.set(block_hash, timestamp, {
                    slot: suffix
                });
            };
            const wallet = new Wallet(address);
            wallet.onInit(on_init);
        });
    }
});
$('#toggle-mining').on('click', async function toggleMining() {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const miner = App.miner(address);
    if (miner.running) {
        return miner.stop();
    }
    miner.emit('initializing', {
        block_hash: null
    });
    //
    // if: recent(block-hash?) => mine
    //
    const suffix = Tokenizer.suffix(App.token);
    const block_hash = HashManager.latestHash({
        slot: suffix
    });
    if (block_hash !== null) {
        const timestamp = HashManager.get(block_hash, {
            slot: suffix
        });
        if (timestamp !== null) {
            const interval = IntervalManager.intervalFrom(
                new Date(Number(timestamp) * 1000)
            );
            if (interval === IntervalManager.interval) {
                return mine(address, block_hash);
            }
        }
    }
    //
    // else: !recent(block-hash?) => init & mine
    //
    HashManager.me.once('block-hash', ({
        block_hash
    }: {
        block_hash: BlockHash
    }) => {
        mine(address, block_hash);
    });
    const wallet = new Wallet(address);
    try {
        const init = await wallet.init();
        console.debug('[init]', init);
    } catch (ex) {
        HashManager.me.removeAllListeners('block-hash');
        miner.emit('initialized', { block_hash: null });
        console.error(ex);
    }
    function mine(address: Address, block_hash: BlockHash) {
        miner.emit('initialized', { block_hash });
        const { min, max } = App.amount;
        if (miner.running) {
            miner.stop();
        }
        miner.start(block_hash, ({ nonce, amount, worker }) => {
            if (amount >= min && amount <= max) App.addNonce(nonce, {
                address, block_hash, amount, worker
            });
        });
    }
});
$(window).on('load', function resetMiningToggle() {
    if (Blockchain.isInstalled()) {
        Blockchain.onConnect(reset);
        Blockchain.onReconnect(({ address }: Reconnect) => {
            if (!App.miner(address).running) {
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
            App.miner(address).on('initializing', () => {
                $spinner.css('visibility', 'visible');
                $spinner.addClass('spinner-grow');
                $mine.prop('disabled', true);
                $text.text('Initializing Mining…');
            });
            App.miner(address).on('initialized', () => {
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
            App.miner(address).on('starting', () => {
                $spinner.css('visibility', 'visible');
                $spinner.addClass('spinner-grow');
                $mine.prop('disabled', true);
                $text.text('Starting Mining…');
            });
            App.miner(address).on('started', () => {
                $spinner.removeClass('spinner-grow');
                $mine.prop('disabled', false);
                $text.text('Stop Mining');
                $spinner.css('visibility', 'visible');
            });
            App.miner(address).on('stopped', () => {
                $text.text('Start Mining');
                $spinner.css('visibility', 'hidden');
            });
        });
    }
});
$('#accelerate').on('click', async function accelerateMining() {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    App.miner(address).accelerate();
});
$('#decelerate').on('click', async function decelerateMining() {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    App.miner(address).decelerate();
});
$(window).on('load', function initSpeed() {
    $('#speed').on('change', (ev, { speed }) => {
        const speed_pct = `${(speed * 100).toFixed(3)}%`;
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
    $('#speed').trigger('change', {
        speed: App.speed
    });
});
$(window).on('load', function controlSpeed() {
    if (Blockchain.isInstalled()) {
        Blockchain.onConnect(({ address }: Connect) => {
            if (document.body.clientWidth <= 576) {
                const $acc = $('#accelerate');
                Tooltip.getInstance($acc)?.disable();
                const $dec = $('#decelerate');
                Tooltip.getInstance($dec)?.disable();
            }
            App.miner(address).on('accelerated', () => {
                const $acc = $('#accelerate');
                Tooltip.getInstance($acc)?.hide();
                const $dec = $('#decelerate');
                Tooltip.getInstance($dec)?.hide();
            });
            App.miner(address).on('decelerated', () => {
                const $acc = $('#accelerate');
                Tooltip.getInstance($acc)?.hide();
                const $dec = $('#decelerate');
                Tooltip.getInstance($dec)?.hide();
            });
        });
        Blockchain.onConnect(({ address }: Connect) => {
            App.miner(address).on('accelerated', (ev) => {
                const speed = ev.speed as number;
                const $acc = $('#accelerate');
                $acc.prop('disabled', speed > 0.999);
                const $dec = $('#decelerate');
                $dec.prop('disabled', speed < 0.001);
            });
            App.miner(address).on('decelerated', (ev) => {
                const speed = ev.speed as number;
                const $acc = $('#accelerate');
                $acc.prop('disabled', speed > 0.999);
                const $dec = $('#decelerate');
                $dec.prop('disabled', speed < 0.001);
            });
            App.miner(address).on('starting', () => {
                const $acc = $('#accelerate');
                $acc.prop('disabled', true);
                const $dec = $('#decelerate');
                $dec.prop('disabled', true);
            });
            App.miner(address).on('stopped', (ev) => {
                const speed = ev.speed as number;
                const $acc = $('#accelerate');
                $acc.prop('disabled', speed >= 1);
                const $dec = $('#decelerate');
                $dec.prop('disabled', speed <= 0);
            });
            $('#accelerate').prop('disabled', App.speed > 0.999);
            $('#decelerate').prop('disabled', App.speed < 0.001);
        });
        Blockchain.onConnect(({ address }: Connect) => {
            App.miner(address).on('accelerated', (ev) => {
                $('#speed').trigger('change', {
                    speed: ev.speed as number
                });
            });
            App.miner(address).on('decelerated', (ev) => {
                $('#speed').trigger('change', {
                    speed: ev.speed as number
                });
            });
        });
    }
});
$('.mint>button.minter').on('click', async function mintTokens(
    ev
) {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const $alerts = $('.alert');
    if ($alerts.length) {
        $alerts.remove();
    }
    const $mint = $(ev.target).parent('.mint');
    const level = Number($mint.data('level'));
    const amount = Tokenizer.amount(App.token, level);
    const suffix = Tokenizer.suffix(App.token);
    const block_hash = HashManager.latestHash({
        slot: suffix
    });
    if (!block_hash) {
        throw new Error('missing block-hash');
    }
    const nonce = App.getNonceBy({ address, block_hash, amount });
    if (!nonce) {
        throw new Error(`missing nonce for amount=${amount}`);
    }
    const wallet = new Wallet(address);
    try {
        const mint = await wallet.mint(nonce, block_hash);
        console.debug('[mint]', mint);
        App.removeNonce(nonce, { address, block_hash });
    } catch (ex: any) {
        if (ex.message && ex.message.match(
            /internal JSON-RPC error/i
        )) {
            if (ex.data && ex.data.message && ex.data.message.match(
                /empty nonce-hash/i
            )) {
                App.removeNonce(nonce, { address, block_hash });
            }
        }
        if (ex.message) {
            if (ex.data && ex.data.message) {
                const message = `${ex.message} [${ex.data.message}]`;
                $(alert(message, Alert.warning, {
                    id: `${nonce}`
                })).insertAfter(
                    $mint
                );
            } else {
                $(alert(ex.message, Alert.warning, {
                    id: `${nonce}`
                })).insertAfter(
                    $mint
                );
            }
        }
    }
});
$('.mint>button.forget').on('click', async function forgetNonces(
    ev
) {
    const $forget = $(ev.target);
    const $mint = $forget.parent('.mint');
    const level = Number($mint.data('level'));
    const amount = Tokenizer.amount(App.token, level);
    const suffix = Tokenizer.suffix(App.token);
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    const block_hash = HashManager.latestHash({
        slot: suffix
    });
    if (!block_hash) {
        throw new Error('missing block-hash');
    }
    App.removeNonceByAmount({
        address, block_hash, amount
    });
    Tooltip.getInstance($forget).hide();
});
$('#connect-metamask').on('connected', function registerObservers(ev, {
    address
}: {
    address: Address
}) {
    const update_total = (token: Token) => {
        const amount_min = Tokenizer.amount(token, App.level.min);
        const suffix = Tokenizer.suffix(token);
        return (
            nonce: Nonce, { amount }: { amount: Amount }, total: Amount
        ) => {
            const $mint = $(`.mint[data-amount-${suffix}=${amount}]`);
            $mint.find(`>.total>.value`).text(total.toString());
            $mint.find(`>button`).prop('disabled', !total);
            if (total || amount === amount_min) {
                $mint.show();
            } else {
                $mint.hide();
            }
        }
    };
    App.onNonceChanged(address, update_total(App.token));
});
$('#connect-metamask').on('connected', async function benchmarkMining(ev, {
    address
}: {
    address: Address
}) {
    const miner = App.miner(address);
    global.ON_STARTED = global.ON_STARTED ?? function (
        { now: beg_ms }: { now: number }
    ) {
        global.OFF_STARTED = global.OFF_STARTED ?? function (
            { now: end_ms }: { now: number }
        ) {
            const ms = (end_ms - beg_ms).toFixed(3);
            console.debug('[mining.duration]', ms, '[ms]');
        };
        miner.off('stopped', global.OFF_STARTED);
        miner.once('stopped', global.OFF_STARTED);
    };
    miner.off('started', global.ON_STARTED);
    miner.on('started', global.ON_STARTED);
});
