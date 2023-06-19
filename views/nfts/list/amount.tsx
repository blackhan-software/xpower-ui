import { mobile } from '../../../source/functions';
import { useBufferedIf } from '../../../source/react';
import { Amount, Nft, NftLevel } from '../../../source/redux/types';

import React, { KeyboardEvent, MouseEvent, TouchEvent, useEffect, useRef } from 'react';
import { DashCircle, PlusCircle } from '../../../public/images/tsx';
import useDoubleTap from '../../../source/react/hooks/use-double-tap';

type Props = {
    level: NftLevel,
    amount1: Amount, max1: Amount, min1: Amount
    onUpdate?: OnUpdate
};
type OnUpdate = (
    args: Omit<Props, 'onUpdate'>
) => void;
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
    const { amount1, min1 } = props;
    const decreasable = amount1 > min1;
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
    const $ref = useRef<HTMLInputElement>(null);
    useDoubleTap($ref, () => {
        setTimeout(() => $ref.current?.select());
        extremify(props);
    });
    useEffect(() => {
        if (readOnly(props)) {
            return;
        }
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
    return <input type='number' ref={$ref}
        className={`btn btn-outline-warning amount ${invalid(props)}`}
        data-bs-toggle='tooltip' data-bs-placement='top'
        onChange={(e) => changeTo(props, BigInt(e.target.value))}
        onKeyDown={(e) => changeByArrows(props, e)}
        readOnly={readOnly(props)}
        title={title(props)}
        value={props.amount1.toString()}
    />
}
function invalid(
    props: Props
) {
    return !inRange(props) ? 'invalid' : '';
}
function inRange(
    { amount1, min1 }: Props
) {
    return min1 <= amount1;
}
function readOnly(
    { max1, min1 }: Props
) {
    return max1 == 0n && min1 == 0n
}
function title(
    { level }: Props
) {
    return `${Nft.nameOf(level)} NFTs to mint`
}
function extremify(
    { amount1, max1, min1, level, onUpdate }: Props
) {
    if (onUpdate) {
        if (amount1 === max1 || amount1 < min1) {
            onUpdate({ amount1: min1, max1, min1, level });
        } else {
            onUpdate({ amount1: max1, max1, min1, level });
        }
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
    const { amount1, max1 } = props;
    const increasable = amount1 < max1;
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
function changeByArrows(
    props: Props, e: KeyboardEvent
) {
    if (e.code?.match(/arrowup/i)) {
        changeBy(props, delta(e));
        e.preventDefault();
        return;
    }
    if (e.code?.match(/arrowdown/i)) {
        changeBy(props, -delta(e));
        e.preventDefault();
        return;
    }
}
function changeBy(
    props: Props, delta: Amount
) {
    const { amount1, min1, max1 } = props;
    if (delta < 0n && amount1 + delta >= min1 ||
        delta > 0n && amount1 + delta <= max1
    ) {
        return changeTo(props, amount1 + delta)
    }
    return false;
}
function changeTo(
    props: Props, value: Amount
) {
    if (props.onUpdate) {
        props.onUpdate({ ...props, amount1: value });
    }
    return true;
}
function delta(
    e: { ctrlKey: boolean, shiftKey: boolean }
) {
    return e.ctrlKey ? 100n : e.shiftKey ? 10n : 1n;
}
export default UiNftAmount;
