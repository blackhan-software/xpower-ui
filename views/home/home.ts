/* eslint @typescript-eslint/no-explicit-any: [off] */
import './home.scss';

import { onTransferBefore } from '../../source/xpower';
import { onTransferAfter } from '../../source/xpower';
import { XPower } from '../../source/xpower';

import { Blockchain } from '../../source/blockchain';
import { ChainId } from '../../source/blockchain';
import { App } from '../../source/app';

import { Alert } from '../../source/functions';
import { alert } from '../../source/functions';
import { in_range } from '../../source/functions';

$(window).on('load', function forgetNonces() {
    if (Blockchain.me.isInstalled()) {
        let iid: NodeJS.Timer | undefined;
        Blockchain.me.on('connect', () => {
            if (!iid) {
                clearInterval();
            }
            iid = App.me.miner.onInterval(() => {
                App.me.remove();
            });
        });
    }
});
$(window).on('load', async function checkBlockchain() {
    const $connect = $('#connect-metamask');
    if (Blockchain.me.isInstalled()) {
        if (Blockchain.me.isConnected()) {
            if (await Blockchain.me.isAvalanche()) {
                $connect.text('Connect to Metamask');
            } else {
                $connect.text('Switch to Avalanche');
            }
        } else {
            $connect.text('Connected to Metamask');
            const $address = $('#miner-address');
            $address.val(await Blockchain.me.connect());
            const $mine = $('#toggle-mining');
            $mine.prop('disabled', false);
            App.me.refresh();
        }
    } else {
        $connect.text('Install Metamask');
        const $info = $connect.siblings('.info');
        $info.prop('title', 'Install Metamask (and reload)');
    }
});
$('#connect-metamask').on('click', async function connectBlockchain() {
    if (Blockchain.me.isInstalled()) {
        if (await Blockchain.me.isAvalanche()) {
            const $address = $('#miner-address');
            $address.val(await Blockchain.me.connect());
            const $connect = $('#connect-metamask');
            $connect.text('Connected to Metamask');
            const $mine = $('#toggle-mining');
            $mine.prop('disabled', false);
            App.me.refresh();
        } else {
            Blockchain.me.switchTo(ChainId.AVALANCHE_MAINNET);
        }
    } else {
        open('https://metamask.io/download.html');
    }
});
$('#toggle-mining').on('click', function toggleMining() {
    const miner = App.me.miner;
    if (miner.running) {
        miner.stop();
    } else {
        const { min, max } = App.me.range;
        miner.start((nonce, amount) => {
            if (amount.gt(0) && in_range(amount, {
                min, max: max + 1
            })) {
                const xnonce = nonce.toHexString();
                const value = amount.toNumber();
                App.me.addNonce(xnonce, value);
            }
        });
    }
});
$(window).on('load', function toggleSpinner() {
    if (Blockchain.me.isInstalled()) {
        Blockchain.me.on('connect', () => {
            const $mine = $('#toggle-mining');
            const $text = $mine.find('.text');
            const $spinner = $mine.find('.spinner');
            App.me.miner.on('started', () => {
                $text.text('Stop Mining');
                $spinner.css('visibility', 'visible');
            });
            App.me.miner.on('stopped', () => {
                $text.text('Start Mining');
                $spinner.css('visibility', 'hidden');
            });
        });
    }
});
$('#decelerate').on('click', function decelerateMining() {
    if (Blockchain.me.isInstalled()) {
        if (Blockchain.me.isConnected()) {
            App.me.miner.decelerate();
        }
    }
});
$('#accelerate').on('click', function accelerateMining() {
    if (Blockchain.me.isInstalled()) {
        if (Blockchain.me.isConnected()) {
            App.me.miner.accelerate();
        }
    }
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
        $('#speed').parent('').attr(
            'title', `Mining speed: ${speed_pct}`
        );
    });
    $('#speed').trigger('change', App.me.speed);
});
$(window).on('load', function controlSpeed() {
    if (Blockchain.me.isInstalled()) {
        Blockchain.me.on('connect', () => {
            $('#decelerate').prop('disabled', false);
            $('#accelerate').prop('disabled', false);
        });
        Blockchain.me.on('connect', () => {
            App.me.miner.on('accelerated', (ev) => {
                const speed = ev.speed as number;
                if (speed >= 1) {
                    $('#accelerate').prop('disabled', true);
                }
                if (speed >= 0) {
                    $('#decelerate').prop('disabled', false);
                }
            });
            App.me.miner.on('decelerated', (ev) => {
                const speed = ev.speed as number;
                if (speed <= 1) {
                    $('#accelerate').prop('disabled', false);
                }
                if (speed <= 0) {
                    $('#decelerate').prop('disabled', true);
                }
            });
            App.me.miner.on('accelerated', (ev) => {
                const speed = ev.speed as number;
                $('#speed').trigger('change', speed);
            });
            App.me.miner.on('decelerated', (ev) => {
                const speed = ev.speed as number;
                $('#speed').trigger('change', speed);
            });
        });
    }
});
$('.mint>button.mid').on('click', async function mintTokens(
    ev
) {
    const $alerts = $('.alert');
    if ($alerts.length) {
        $alerts.remove();
    }
    const $mint = $(ev.target).parent('.mint');
    const amount = parseInt($mint.data('amount'));
    const nonce = App.me.getNonceBy(amount);
    if (!nonce) {
        throw new Error(`missing nonce for amount=${amount}`);
    }
    const address = $('#g-xpower-address').data('value');
    if (!address) {
        throw new Error(`missing xpower-address`);
    }
    const xpower = new XPower(address);
    const contract = xpower.connect();
    xpower.filterEvents();
    try {
        contract.once('Transfer', onTransferBefore);
        const mint = await contract.mint(nonce);
        contract.once('Transfer', onTransferAfter);
        console.debug('[mint]', mint);
        App.me.removeNonce(nonce);
    } catch (ex: any) {
        if (ex.message && ex.message.match(
            /internal JSON-RPC error/i
        )) {
            if (ex.data && ex.data.message && ex.data.message.match(
                /empty nonce-hash/i
            )) {
                App.me.removeNonce(nonce);
            }
        }
        if (ex.message) {
            if (ex.data && ex.data.message) {
                const message = `${ex.message} [${ex.data.message}]`;
                $(alert(message, Alert.warning, { id: nonce })).insertAfter(
                    $mint
                );
            } else {
                $(alert(ex.message, Alert.warning, { id: nonce })).insertAfter(
                    $mint
                );
            }
        }
    }
});
$('.mint>button.rhs').on('click', function forgetNonces(
    ev
) {
    const $mint = $(ev.target).parent('.mint');
    const amount = parseInt($mint.data('amount'));
    App.me.removeNonceByAmount(amount);
});
$(window).on('load', function registerObservers() {
    App.me.onNonceAdded(function updateTotalPerAmount(
        nonce, { amount }, total
    ) {
        const $mint = $(`.mint[data-amount=${amount}]`);
        $mint.find(`>button`).prop('disabled', !total);
        $mint.find(`>.lhs`).text(total);
        if (total || amount === 1) {
            $mint.show();
        } else {
            $mint.hide();
        }
    });
    App.me.onNonceRemoved(function updateTotalPerAmount(
        nonce, { amount }, total
    ) {
        const $mint = $(`.mint[data-amount=${amount}]`);
        $mint.find(`>button`).prop('disabled', !total);
        $mint.find(`>.lhs`).text(total);
        if (total || amount === 1) {
            $mint.show();
        } else {
            $mint.hide();
        }
    });
});
