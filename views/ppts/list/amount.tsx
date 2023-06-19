import { mobile } from '../../../source/functions';
import { useBufferedIf } from '../../../source/react';
import { Amount, Nft, NftLevel } from '../../../source/redux/types';

import React, { KeyboardEvent, MouseEvent, TouchEvent, useEffect, useRef } from 'react';
import { DashCircle, PlusCircle } from '../../../public/images/tsx';
import useDoubleTap from '../../../source/react/hooks/use-double-tap';

type Props = {
    amount: Amount, level: NftLevel,
    max: Amount, min: Amount
    onUpdate?: OnUpdate
};
type OnUpdate = (
    args: Omit<Props, 'onUpdate'>
) => void;
export function UiPptAmount(
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
        value={props.amount.toString()}
    />;
}
function invalid(
    props: Props
) {
    return !inRange(props) ? 'invalid' : '';
}
function inRange(
    { amount, max, min }: Props
) {
    return min <= amount && amount <= max;
}
function readOnly(
    { max, min }: Props
) {
    return max == 0n && min == 0n
}
function title(
    { amount, level }: Props
) {
    if (amount > 0) {
        return `${Nft.nameOf(level)} NFTs to stake`;
    } else if (amount < 0) {
        return `${Nft.nameOf(level)} NFTs to unstake`;
    } else {
        return `${Nft.nameOf(level)} NFTs to (un)stake`;
    }
}
function extremify(
    { amount, level, max, min, onUpdate }: Props
) {
    if (onUpdate) {
        if (amount === max || amount < min) {
            onUpdate({ amount: min, max, min, level });
        } else {
            onUpdate({ amount: max, max, min, level });
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
    const { amount, min, max } = props;
    if (delta < 0n && amount + delta >= min ||
        delta > 0n && amount + delta <= max
    ) {
        return changeTo(props, amount + delta)
    }
    return false;
}
function changeTo(
    props: Props, value: Amount
) {
    if (props.onUpdate) {
        props.onUpdate({ ...props, amount: value });
    }
    return true;
}
function delta(
    e: { ctrlKey: boolean, shiftKey: boolean }
) {
    return e.ctrlKey ? 100n : e.shiftKey ? 10n : 1n;
}
export default UiPptAmount;
