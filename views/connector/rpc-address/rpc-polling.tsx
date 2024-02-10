import React, { useEffect, useRef, useState } from 'react';
import { Rpc, useDoubleTap } from '../../../source/react';
import { useInterval } from 'usehooks-ts';

import { mobile } from '../../../source/functions';

const MIN_POLLING_MS = 2_000;
const MAX_POLLING_MS = 20_000;

type Props = {
    rpc: Rpc | null; set_rpc: React.Dispatch<
        React.SetStateAction<Rpc | null>
    >;
    valid: boolean | null; set_valid: React.Dispatch<
        React.SetStateAction<boolean | null>
    >;
}
type KeyEvent = {
    ctrlKey: boolean; shiftKey: boolean;
}
export function RpcPolling(
    props: Props
) {
    return <>
        {$decrease(props)}
        {$polling_ms(props)}
        {$increase(props)}
    </>;
}
function $decrease(
    props: Props
) {
    const $ref = useRef<HTMLButtonElement>(null);
    useDoubleTap($ref, () => props.set_rpc({
        ...props.rpc, ms: MIN_POLLING_MS
    }));
    const [tid, set_tid] = useState<NodeJS.Timeout | null>(null);
    const [ims, set_ims] = useState<number | null>(null);
    const [shift, set_shift] = useState(false);
    const [ctrl, set_ctrl] = useState(false);
    useInterval(() => decrease(props, {
        ctrlKey: ctrl, shiftKey: shift
    }), ims);
    const start = (
        e: React.MouseEvent | React.TouchEvent
    ) => {
        set_tid(setTimeout(() => set_ims(10), 600));
        set_shift(e.shiftKey);
        set_ctrl(e.ctrlKey);
        decrease(props, e);
    };
    const stop = () => {
        if (tid) {
            clearTimeout(tid);
            set_tid(null);
        }
        set_ims(null);
    };
    return <button
        id='rpc-polling-dec' ref={$ref} role='button'
        className='form-control input-group-text'
        data-bs-toggle='tooltip' data-bs-placement='top'
        disabled={decrease_disabled(props)}
        onMouseDown={!mobile() ? start : undefined}
        onMouseLeave={!mobile() ? stop : undefined}
        onMouseUp={!mobile() ? stop : undefined}
        onKeyDown={by_keyboard.bind(null, props)}
        onTouchStart={mobile() ? start : undefined}
        onTouchCancel={mobile() ? stop : undefined}
        onTouchEnd={mobile() ? stop : undefined}
        title={!mobile() ? 'Decrease RPC polling' : undefined}
    >
        <i className='bi-dash-circle'></i>
    </button>;
}
function $polling_ms(
    props: Props
) {
    const $ref = useRef<HTMLInputElement>(null);
    useEffect(() => {
        const current = $ref.current;
        current?.addEventListener('wheel', by_wheel, {
            passive: false
        });
        return () => {
            current?.removeEventListener('wheel', by_wheel);
        };
        function by_wheel(
            e: WheelEvent
        ) {
            e.preventDefault();
            e.stopPropagation();
            if (e.deltaY > 0) {
                decrease(props, e);
            }
            if (e.deltaY < 0) {
                increase(props, e);
            }
        }
    }, [$ref, props]);
    const classes = [
        'form-control', validity(props)
    ];
    return <input ref={$ref}
        id='rpc-polling' className={classes.join(' ')}
        data-bs-toggle='tooltip' data-bs-placement='top'
        onChange={(e) => on_change(props, e)}
        onKeyDown={(e) => by_arrows(props, e)}
        placeholder={MIN_POLLING_MS.toString()}
        value={props.rpc?.ms ?? ''}
        title='RPC polling [ms]'
        type='number'
    />;
}
function $increase(
    props: Props
) {
    const $ref = useRef<HTMLButtonElement>(null);
    useDoubleTap($ref, () => props.set_rpc({
        ...props.rpc, ms: MAX_POLLING_MS
    }));
    const [tid, set_tid] = useState<NodeJS.Timeout | null>(null);
    const [ims, set_ims] = useState<number | null>(null);
    const [shift, set_shift] = useState(false);
    const [ctrl, set_ctrl] = useState(false);
    useInterval(() => increase(props, {
        ctrlKey: ctrl, shiftKey: shift
    }), ims);
    const start = (
        e: React.MouseEvent | React.TouchEvent
    ) => {
        set_tid(setTimeout(() => set_ims(10), 600));
        set_shift(e.shiftKey);
        set_ctrl(e.ctrlKey);
        increase(props, e);
    };
    const stop = () => {
        if (tid) {
            clearTimeout(tid);
            set_tid(null);
        }
        set_ims(null);
    };
    return <button
        id='rpc-polling-inc' ref={$ref} role='button'
        className='form-control input-group-text'
        data-bs-toggle='tooltip' data-bs-placement='top'
        disabled={increase_disabled(props)}
        onMouseDown={!mobile() ? start : undefined}
        onMouseLeave={!mobile() ? stop : undefined}
        onMouseUp={!mobile() ? stop : undefined}
        onKeyDown={by_keyboard.bind(null, props)}
        onTouchStart={mobile() ? start : undefined}
        onTouchCancel={mobile() ? stop : undefined}
        onTouchEnd={mobile() ? stop : undefined}
        title={!mobile() ? 'Increase RPC polling' : undefined}
    >
        <i className='bi-plus-circle'></i>
    </button>;
}
function validity(
    { rpc, valid }: Props,
) {
    if (rpc && valid === true) {
        return 'is-valid';
    }
    if (rpc && valid === false) {
        return 'is-invalid';
    }
    return '';
}
function on_change(
    { rpc, set_rpc, valid, set_valid }: Props,
    e: React.ChangeEvent<HTMLInputElement>
) {
    const ms = parseInt(e.target.value);
    if (isNaN(ms)) {
        if (valid !== null) set_valid(null);
        set_rpc({ ...rpc, ms: undefined });
    } else {
        set_valid(
            MIN_POLLING_MS <= ms &&
            MAX_POLLING_MS >= ms
        );
        set_rpc({ ...rpc, ms });
    }
}
function by_keyboard(
    props: Props, e: React.KeyboardEvent<HTMLButtonElement>
) {
    if (e.code?.match(/space|enter/i)) {
        if (delta_of(e) < 0) {
            decrease(props, e);
        }
        if (delta_of(e) > 0) {
            increase(props, e);
        }
    }
}
function by_arrows(
    props: Props, e: React.KeyboardEvent<HTMLInputElement>
) {
    if (e.code?.match(/arrowdown/i)) {
        decrease(props, e);
        e.preventDefault();
        return;
    }
    if (e.code?.match(/arrowup/i)) {
        increase(props, e);
        e.preventDefault();
        return;
    }
}
function decrease(
    { rpc, set_rpc }: Props, e: KeyEvent
) {
    if (typeof rpc?.ms === 'number') {
        if (rpc.ms - delta_of(e) >= MIN_POLLING_MS) {
            set_rpc({ ...rpc, ms: rpc.ms - delta_of(e) });
        }
    }
}
function increase(
    { rpc, set_rpc }: Props, e: KeyEvent
) {
    if (typeof rpc?.ms === 'number') {
        if (rpc.ms + delta_of(e) <= MAX_POLLING_MS) {
            set_rpc({ ...rpc, ms: rpc.ms + delta_of(e) });
        }
    }
}
function decrease_disabled(
    { rpc }: Props
) {
    if (typeof rpc?.ms === 'number') {
        if (rpc.ms <= MIN_POLLING_MS) {
            return true
        }
    }
    return false;
}
function increase_disabled(
    { rpc }: Props
) {
    if (typeof rpc?.ms === 'number') {
        if (rpc.ms >= MAX_POLLING_MS) {
            return true
        }
    }
    return false;
}
function delta_of(
    e: KeyEvent
) {
    return e.ctrlKey ? 100 : e.shiftKey ? 10 : 1;
}
export default RpcPolling;
