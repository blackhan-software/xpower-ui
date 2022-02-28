/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Global } from '../../../source/types';
declare const global: Global;

import { App } from '../../../source/app';
import { Blockchain } from '../../../source/blockchain';
import { Connect } from '../../../source/blockchain';

const { Tooltip } = global.bootstrap as any;

$(window).on('load', function init() {
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
    const $acc = $('#accelerate');
    $acc.prop('disabled', App.speed > 0.999);
    const $dec = $('#decelerate');
    $dec.prop('disabled', App.speed < 0.001);
});
$(window).on('load', function tooltips() {
    if (document.body.clientWidth <= 576) {
        const $acc = $('#accelerate');
        Tooltip.getInstance($acc)?.disable();
        const $dec = $('#decelerate');
        Tooltip.getInstance($dec)?.disable();
    }
});
$('#accelerate').on('click', async function accelerate() {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    App.miner(address).accelerate();
});
$('#decelerate').on('click', async function decelerate() {
    const address = await Blockchain.selectedAddress;
    if (!address) {
        throw new Error('missing selected-address');
    }
    App.miner(address).decelerate();
});
$('#connect-metamask').on('connected', function handlers(
    ev, { address }: Connect
) {
    const miner = App.miner(address);
    const $acc = $('#accelerate');
    const $dec = $('#decelerate');
    miner.on('accelerated', () => {
        Tooltip.getInstance($acc)?.hide();
        Tooltip.getInstance($dec)?.hide();
    });
    miner.on('decelerated', () => {
        Tooltip.getInstance($acc)?.hide();
        Tooltip.getInstance($dec)?.hide();
    });
    miner.on('accelerated', (ev) => {
        const speed = ev.speed as number;
        $acc.prop('disabled', speed > 0.999);
        $dec.prop('disabled', speed < 0.001);
    });
    miner.on('decelerated', (ev) => {
        const speed = ev.speed as number;
        $acc.prop('disabled', speed > 0.999);
        $dec.prop('disabled', speed < 0.001);
    });
    miner.on('starting', () => {
        $acc.prop('disabled', true);
        $dec.prop('disabled', true);
    });
    miner.on('stopped', () => {
        $acc.prop('disabled', false);
        $dec.prop('disabled', false);
    });
    miner.on('accelerated', (ev) => {
        $('#speed').trigger('change', {
            speed: ev.speed as number
        });
    });
    miner.on('decelerated', (ev) => {
        $('#speed').trigger('change', {
            speed: ev.speed as number
        });
    });
});
