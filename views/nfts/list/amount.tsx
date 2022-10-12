import { mobile, useBufferedIf } from '../../../source/functions';
import { Amount, Nft, NftLevel } from '../../../source/redux/types';

import React, { KeyboardEvent, MouseEvent, TouchEvent, useEffect, useRef } from 'react';
import { DashCircle, PlusCircle } from '../../../public/images/tsx';

type Props = {
    amount: Amount, level: NftLevel,
    max: Amount, min: Amount
    onUpdate?: OnUpdate
};
type OnUpdate = (args: Omit<Props, 'onUpdate'> & {
    callback?: () => void
}) => void;
export function UiNftAmount(
    props: Props
) {
    // set-delta: buffered invocation if argument is truthy!
    const [delta, set_delta, set_delta_now] = useBufferedIf(
        0n, (d) => Boolean(d), 600
    );
    useEffect(() => {
        const tid = setTimeout(() =>
            changeBy(props, delta) || set_delta_now(0n), 10
        );
        return () => clearTimeout(tid);
    }, [
        props, delta, set_delta_now
    ]);
    return <React.Fragment>
        {$decrease(props, set_delta)}
        {$amount(props)}
        {$increase(props, set_delta)}
    </React.Fragment>;
}
function $decrease(
    props: Props, set_delta: (value: Amount) => void
) {
    const start = (e: MouseEvent | TouchEvent) => {
        set_delta(-delta(e)); changeBy(props, -delta(e));
    };
    const stop = () => {
        set_delta(0n);
    };
    const { amount, min } = props;
    const decreasable = amount > min;
    return <div
        className='btn-group' role='group'
    >
        <button type='button' aria-label="Decrease"
            className='btn btn-outline-warning decrease'
            onMouseDown={!mobile() ? start : undefined}
            onMouseLeave={!mobile() ? stop : undefined}
            onMouseUp={!mobile() ? stop : undefined}
            onKeyDown={decreaseByKeyboard.bind(null, props)}
            onTouchStart={mobile() ? start : undefined}
            onTouchCancel={mobile() ? stop : undefined}
            onTouchEnd={mobile() ? stop : undefined}
            disabled={!decreasable}
        >
            <DashCircle fill={true} />
        </button>
    </div>;
}
function decreaseByKeyboard(
    props: Props, e: KeyboardEvent
) {
    if (e.code?.match(/space|enter/i)) {
        changeBy(props, -delta(e));
    }
}
function decreaseByWheel(
    props: Props, e: WheelEvent
) {
    e.preventDefault();
    e.stopPropagation();
    if (e.deltaY > 0) {
        changeBy(props, -delta(e));
    }
}
function $amount(
    props: Props
) {
    const $ref = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        const current = $ref.current;
        const dbyw = decreaseByWheel.bind(null, props);
        current?.addEventListener('wheel', dbyw, {
            passive: false
        });
        const ibyw = increaseByWheel.bind(null, props);
        current?.addEventListener('wheel', ibyw, {
            passive: false
        });
        return () => {
            current?.removeEventListener('wheel', dbyw);
            current?.removeEventListener('wheel', ibyw);
        };
    }, [props, $ref]);
    return <button type='button' ref={$ref}
        className='btn btn-outline-warning amount'
        data-bs-toggle='tooltip' data-bs-placement='top'
        onClick={() => extremify(props)}
        title={`${Nft.nameOf(props.level)} NFTs to mint`}
    >{props.amount.toString()}</button>;
}
function extremify(
    { amount, level, max, min, onUpdate }: Props
) {
    if (onUpdate && (amount === max)) {
        onUpdate({ amount: min, max, min, level });
    }
    if (onUpdate && (amount === min || amount < max)) {
        onUpdate({ amount: max, max, min, level });
    }
}
function $increase(
    props: Props, set_delta: (value: Amount) => void
) {
    const start = (e: MouseEvent | TouchEvent) => {
        set_delta(delta(e)); changeBy(props, delta(e));
    };
    const stop = () => {
        set_delta(0n);
    };
    const { amount, max } = props;
    const increasable = amount < max;
    return <div
        className='btn-group' role='group'
    >
        <button type='button' aria-label="Increase"
            className='btn btn-outline-warning increase'
            onMouseDown={!mobile() ? start : undefined}
            onMouseLeave={!mobile() ? stop : undefined}
            onMouseUp={!mobile() ? stop : undefined}
            onKeyDown={increaseByKeyboard.bind(null, props)}
            onTouchStart={mobile() ? start : undefined}
            onTouchCancel={mobile() ? stop : undefined}
            onTouchEnd={mobile() ? stop : undefined}
            disabled={!increasable}
        >
            <PlusCircle fill={true} />
        </button>
    </div>;
}
function increaseByKeyboard(
    props: Props, e: KeyboardEvent
) {
    if (e.code?.match(/space|enter/i)) {
        changeBy(props, delta(e));
    }
}
function increaseByWheel(
    props: Props, e: WheelEvent
) {
    e.preventDefault();
    e.stopPropagation();
    if (e.deltaY < 0) {
        changeBy(props, delta(e));
    }
}
function changeBy(
    props: Props, delta: Amount
) {
    const { amount, min, max, onUpdate } = props;
    if (delta < 0n && amount + delta >= min ||
        delta > 0n && amount + delta <= max
    ) {
        if (onUpdate) {
            onUpdate({ ...props, amount: amount + delta });
        }
        return true;
    }
    return false;
}
function delta(
    e: { ctrlKey: boolean, shiftKey: boolean }
) {
    return e.ctrlKey ? 100n : e.shiftKey ? 10n : 1n;
}
export default UiNftAmount;
