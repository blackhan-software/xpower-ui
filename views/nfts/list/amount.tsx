import { mobile } from '../../../source/functions';
import { ROParams } from '../../../source/params';
import { Amount, Nft, NftLevel, Token, TokenInfo, Ui, Wallet } from '../../../source/redux/types';

import React, { KeyboardEvent, MouseEvent, TouchEvent, useContext, useEffect, useRef } from 'react';
import { DashCircle, PlusCircle } from '../../../public/images/tsx';
import { Button, Div, Input, UiContext, WalletContext, useBufferedIf, useDoubleTap } from '../../../source/react';

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
    return <>
        {$decrease(props, set_delta)}
        {$amount(props)}
        {$increase(props, set_delta)}
    </>;
}
function extremifyDec(
    { amount1, max1, min1, level, onUpdate }: Props
) {
    if (onUpdate) {
        if (amount1 === max1 || amount1 < min1) {
            onUpdate({ amount1: max1, max1, min1, level });
        } else {
            onUpdate({ amount1: min1, max1, min1, level });
        }
    }
}
function $decrease(
    props: Props, set_delta: (value: Amount) => void
) {
    const $ref = useRef<HTMLButtonElement>(null);
    useDoubleTap($ref, () => {
        extremifyDec(props);
    });
    const start = (e: MouseEvent | TouchEvent) => {
        set_delta(-delta(e)); changeBy(props, -delta(e));
    };
    const stop = () => {
        set_delta(0n);
    };
    const { amount1, min1 } = props;
    const decreasable = amount1 > min1;
    return <Div
        className='btn-group' role='group'
    >
        <Button aria-label="Decrease"
            className='btn btn-outline-warning decrease'
            onMouseDown={!mobile() ? start : undefined}
            onMouseLeave={!mobile() ? stop : undefined}
            onMouseUp={!mobile() ? stop : undefined}
            onKeyDown={decreaseByKeyboard.bind(null, props)}
            onTouchStart={mobile() ? start : undefined}
            onTouchCancel={mobile() ? stop : undefined}
            onTouchEnd={mobile() ? stop : undefined}
            disabled={!decreasable} ref={$ref}
        >
            <DashCircle fill={true} />
        </Button>
    </Div>;
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
    const [ui] = useContext(UiContext);
    const [wallet] = useContext(WalletContext);
    const $ref = useRef<HTMLInputElement>(null);
    useDoubleTap($ref, () => {
        setTimeout(() => $ref.current?.select());
        extremifyInc(props);
    });
    useEffect(() => {
        if (readOnly(props, ui)) {
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
    }, [props, wallet, ui, $ref]);
    return <Input type='number' ref={$ref}
        className={`btn btn-outline-warning amount ${invalid(props, wallet, ui)}`.trim()}
        name={`nft-amount-${props.level}`}
        onChange={(e) => changeTo(props, parse(e.target.value))}
        onKeyDown={(e) => changeByArrows(props, e)}
        readOnly={readOnly(props, ui)}
        title={title(props)}
        value={props.amount1.toString()}
    />;
}
function parse(value: string) {
    value = value.replace(/[^-0-9]+/g, '');
    value = value.replace(/^-$/, '0');
    value = value.replace(/-$/, '');
    return BigInt(value);
}
function invalid(
    props: Props, wallet: Wallet | null, ui: Ui | null
) {
    if (!inRange(props)) {
        return 'invalid';
    }
    if (exRange(props, wallet, ui)) {
        return 'invalid';
    }
    return '';
}
function inRange(
    { amount1, min1 }: Props
) {
    return min1 <= amount1;
}
function exRange(
    { amount1 }: Props, wallet: Wallet | null, ui: Ui | null
) {
    if (amount1 && wallet && ui) {
        const { decimals } = TokenInfo(
            Token.XPOW, ROParams.version
        );
        const base = 10n ** BigInt(decimals);
        const aft_wallet = wallet.aft_wallet.items[Token.XPOW];
        if (aft_wallet && aft_wallet.amount > base) {
            const total = Object
                .entries(ui.nfts_ui.amounts)
                .map(([l, { amount1: a }]) => 10n ** BigInt(l) * a)
                .reduce((acc, a) => acc + a * base, 0n);
            if (total > aft_wallet.amount) {
                return true;
            }
        }
    }
    return false;
}
function readOnly(
    { level, max1, min1 }: Props, ui: Ui | null
) {
    if (ui) {
        for (const [l, { max1 }] of Object.entries(
            ui.nfts_ui.amounts
        )) {
            if (BigInt(l) > level && max1) {
                return false; // read-write
            }
        }
    }
    return max1 == 0n && min1 == 0n;
}
function title(
    { amount1, level }: Props
) {
    if (amount1 >= 0) {
        return `${Nft.nameOf(level)} NFTs to mint`
    } else {
        return `${Nft.nameOf(level)} NFTs to burn`;
    }
}
function extremifyInc(
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
    const $ref = useRef<HTMLButtonElement>(null);
    useDoubleTap($ref, () => {
        extremifyInc(props);
    });
    const start = (e: MouseEvent | TouchEvent) => {
        set_delta(delta(e)); changeBy(props, delta(e));
    };
    const stop = () => {
        set_delta(0n);
    };
    const { amount1, max1 } = props;
    const increasable = amount1 < max1;
    return <Div
        className='btn-group' role='group'
    >
        <Button aria-label="Increase"
            className='btn btn-outline-warning increase'
            onMouseDown={!mobile() ? start : undefined}
            onMouseLeave={!mobile() ? stop : undefined}
            onMouseUp={!mobile() ? stop : undefined}
            onKeyDown={increaseByKeyboard.bind(null, props)}
            onTouchStart={mobile() ? start : undefined}
            onTouchCancel={mobile() ? stop : undefined}
            onTouchEnd={mobile() ? stop : undefined}
            disabled={!increasable} ref={$ref}
        >
            <PlusCircle fill={true} />
        </Button>
    </Div>;
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
