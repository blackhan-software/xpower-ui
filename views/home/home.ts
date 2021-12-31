/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Global } from '../../source/types';
declare const global: Global;
import './home.scss';

import { App } from '../../source/app';
import { Tokenizer } from '../../source/token';
import { TokenSuffix } from '../../source/token';

import { Blockchain } from '../../source/blockchain';
import { Connect } from '../../source/blockchain';
import { Reconnect } from '../../source/blockchain';

import { hex_64 } from '../../source/functions';
import { alert } from '../../source/functions';
import { Alert } from '../../source/functions';

import { HashManager } from '../../source/managers';
import { IntervalManager } from '../../source/managers';

import { Address } from '../../source/redux/types';
import { BlockHash } from '../../source/redux/types';

import { OnInit } from '../../source/wallet';
import { Wallet } from '../../source/wallet';

const { Tooltip } = global.bootstrap as any;

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
                console.debug('[on:init]', hex_64(block_hash), timestamp);
                const suffix = Tokenizer.suffix(App.params.get('token'));
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
    const suffix = Tokenizer.suffix(App.params.get('token'));
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
        const { min, max } = App.range;
        if (miner.running) {
            miner.stop();
        }
        miner.start(block_hash, (nonce, amount) => {
            if (amount >= min && amount <= max) {
                App.addNonce(address, block_hash, nonce, amount);
            }
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
            App.miner(address).on('started', () => {
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
$('#decelerate').on('click', async function decelerateMining() {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    App.miner(address).decelerate();
});
$('#accelerate').on('click', async function accelerateMining() {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    App.miner(address).accelerate();
});
$(window).on('load', function initSpeed() {
    $('#speed').on('change', (ev, { speed }) => {
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
                const $dec = $('#decelerate');
                if (speed >= 1) {
                    $acc.prop('disabled', true);
                }
                if (speed >= 0) {
                    $dec.prop('disabled', false);
                }
            });
            App.miner(address).on('decelerated', (ev) => {
                const speed = ev.speed as number;
                const $acc = $('#accelerate');
                const $dec = $('#decelerate');
                if (speed <= 1) {
                    $acc.prop('disabled', false);
                }
                if (speed <= 0) {
                    $dec.prop('disabled', true);
                }
            });
            $('#accelerate').prop('disabled', false);
            $('#decelerate').prop('disabled', false);
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
$('.mint>button.lhs').on('click', async function mintTokens(
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
    const index = Number($mint.data('index'));
    const token = App.params.get('token');
    const amount = Tokenizer.amount(token, index);
    const suffix = Tokenizer.suffix(token);
    const block_hash = HashManager.latestHash({
        slot: suffix
    });
    if (!block_hash) {
        throw new Error('missing block-hash');
    }
    const nonce = App.getNonceBy(address, block_hash, amount);
    if (!nonce) {
        throw new Error(`missing nonce for amount=${amount}`);
    }
    const wallet = new Wallet(address);
    try {
        const mint = await wallet.mint(nonce, block_hash);
        console.debug('[mint]', mint);
        App.removeNonce(address, block_hash, nonce);
    } catch (ex: any) {
        if (ex.message && ex.message.match(
            /internal JSON-RPC error/i
        )) {
            if (ex.data && ex.data.message && ex.data.message.match(
                /empty nonce-hash/i
            )) {
                App.removeNonce(address, block_hash, nonce);
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
$('.mint>button.rhs').on('click', async function forgetNonces(
    ev
) {
    const $forget = $(ev.target);
    const $mint = $forget.parent('.mint');
    const index = Number($mint.data('index'));
    const token = App.params.get('token');
    const amount = Tokenizer.amount(token, index);
    const suffix = Tokenizer.suffix(token);
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
    App.removeNonceByAmount(address, block_hash, amount);
    Tooltip.getInstance($forget).hide();
});
$('#connect-metamask').on('connected', function registerObservers(ev, {
    address
}: {
    address: Address
}) {
    const suffix = Tokenizer.suffix(App.params.get('token'));
    App.onNonceChanged(address, function updateTotalPerAmount(
        nonce, { amount }, total
    ) {
        const $mint = $(`.mint[data-amount-${suffix}=${amount}]`);
        $mint.find(`>button`).prop('disabled', !total);
        $mint.find(`>.mid`).text(total.toString());
        if (total
            || suffix === TokenSuffix.CPU && amount === 1n
            || suffix === TokenSuffix.GPU && amount === 1n
            || suffix === TokenSuffix.ASIC && amount === 15n
        ) {
            $mint.show();
        } else {
            $mint.hide();
        }
    });
});
