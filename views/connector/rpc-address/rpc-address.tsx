import './rpc-address.scss';

import React, { useContext, useEffect, useState } from 'react';
import { Button, Input, Rpc, RpcContext, globalRef } from '../../../source/react';
import { RpcPolling } from './rpc-polling';

import { Bus } from '../../../source/bus';
import { QRCode } from '../../qr-code';

type Props = {
    toggled: boolean;
};
export function RpcAddress(
    { toggled }: Props
) {
    const [ctx, set_ctx] = useContext(RpcContext);
    const [rpc, set_rpc] = useState(ctx);
    const [valid1, set_valid1] = useState<boolean | null>(null);
    const [valid2, set_valid2] = useState<boolean | null>(null);
    useEffect(() => Bus.emit('refresh-tips'), [rpc]);
    useEffect(() => set_rpc(ctx), [ctx]);
    return <div
        className='input-group rpc-address'
        ref={globalRef('.rpc-address')} role='group'
        style={{ display: display(toggled) }}
    >
        {$enable(ctx, set_ctx)(rpc, valid())}
        {$qr_code(ctx)}
        {$input(rpc, set_rpc, valid1, set_valid1)}
        {$copy(rpc)}
        {$polling(rpc, set_rpc, valid2, set_valid2)}
    </div>;
    function display(toggled: boolean) {
        return toggled ? 'flex' : 'none';
    }
    function valid() {
        if (valid1 === false || valid2 === false) {
            return false;
        }
        return true;
    }
}
function $enable(
    ctx: Rpc | null, set_ctx: React.Dispatch<
        React.SetStateAction<Rpc | null>
    >
) {
    return function RpcAddressEnable(
        rpc: Rpc | null, valid: boolean | null
    ) {
        return <Button
            className='form-control input-group-text'
            id='rpc-address-enable'
            onClick={() => reload_if(rpc, valid)}
            title={title()}
        >
            <i className={icon(rpc)}></i>
        </Button>;
    }
    function reload_if(
        rpc: Rpc | null, valid: boolean | null
    ) {
        if (valid !== false) {
            set_ctx(rpc); location.reload();
        }
    }
    function title() {
        return 'Enable RPC end-point';
    }
    function icon(
        rpc: Rpc | null
    ) {
        return rpc === ctx
            ? 'bi-check-circle'
            : 'bi-circle';
    }
}
function $qr_code(
    ctx: Rpc | null
) {
    return <QRCode data={ctx?.url ?? ''} />;
}
function $input(
    rpc: Rpc | null, set_rpc: React.Dispatch<
        React.SetStateAction<Rpc | null>
    >,
    valid: boolean | null, set_valid: React.Dispatch<
        React.SetStateAction<boolean | null>
    >
) {
    const classes = [
        'form-control', validity()
    ];
    return <Input
        className={classes.join(' ')}
        id='rpc-address'
        onChange={on_change}
        onKeyDown={on_keydown}
        placeholder={placeholder()}
        title='RPC end-point'
        value={rpc?.url ?? ''}
    />;
    function placeholder() {
        const $rpc = document.querySelector<HTMLElement>(
            '#g-urls-provider-my'
        );
        return $rpc?.dataset['value'];
    }
    function on_change(
        ev: React.ChangeEvent<HTMLInputElement>
    ) {
        const value = ev.target.value;
        if (value) try {
            new URL(value);
            set_valid(true);
        } catch (ex) {
            set_valid(false);
            console.error(ex);
        } else {
            set_valid(null);
        }
        set_rpc({ ...rpc, url: value });
    }
    function on_keydown(
        ev: React.KeyboardEvent<HTMLInputElement>
    ) {
        if (ev.key === 'Enter' && valid) {
            const $button = document.querySelector<HTMLButtonElement>(
                '#rpc-address-enable'
            );
            $button?.click();
        }
    }
    function validity() {
        if (rpc && valid === true) {
            return 'is-valid';
        }
        if (rpc && valid === false) {
            return 'is-invalid';
        }
        return '';
    }
}
function $copy(
    rpc: Rpc | null
) {
    return <Button
        className='form-control input-group-text'
        id='rpc-address-copy'
        onClick={() => navigator.clipboard.writeText(rpc?.url ?? '')}
        title='Copy RPC end-point'
    >
        <i className='bi bi-copy'></i>
    </Button>;
}
function $polling(
    rpc: Rpc | null, set_rpc: React.Dispatch<
        React.SetStateAction<Rpc | null>
    >,
    valid: boolean | null, set_valid: React.Dispatch<
        React.SetStateAction<boolean | null>
    >
) {
    return <RpcPolling
        rpc={rpc} set_rpc={set_rpc}
        valid={valid} set_valid={set_valid}
    />;
}
export default RpcAddress;
