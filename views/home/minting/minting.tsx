import { globalRef, nice } from '../../../source/functions';
import { Level, MinterRow, MinterStatus, Token } from '../../../source/redux/types';
import { Tokenizer } from '../../../source/token';

import React, { useEffect, useState } from 'react';

type Props = {
    level: Level; rows: MinterRow[]; token: Token;
    onMint?: (token: Token, level: Level) => void;
    onForget?: (token: Token, level: Level) => void;
}
export function UiMinting(
    { token, rows, onMint, onForget }: Props
) {
    const [focus, setFocus] = useState<Record<Level, boolean>>({});
    const onFocus = (level: Level, flag: boolean) => {
        setFocus({ [level]: flag });
    };
    const status = rows.map(({ status }) => status);
    useEffect(() => {
        const any_focused = Object.entries(focus).filter(
            ([level, focused]) => focused // eslint-disable-line
        );
        if (any_focused.length) {
            const $button = globalRef<HTMLElement>(
                `.minter[level="${any_focused[0][0]}"]`
            );
            $button.current?.focus();
        }
    }, [
        focus, status
    ]);
    return <React.Fragment>
        <label className='form-label'>
            Mined Amounts (not minted yet)
        </label>
        {rows
            .map((row, i) => $mint(
                { token, level: i + 1, row, onMint, onForget }, onFocus
            ))
            .filter((row) => row)}
    </React.Fragment>;
}
function $mint(
    { token, level, row, onMint, onForget }: Omit<Props, 'rows'> & {
        row: MinterRow
    },
    onFocus: (level: Level, flag: boolean) => void
) {
    const { display, tx_counter, nn_counter } = row;
    if (display || tx_counter > 0 || nn_counter > 0) {
        return <div
            className='btn-group mint' key={level - 1}
            ref={globalRef(`.mint[level=${level}]`)}
            role='group'
            style={{ display: row.display ? 'block' : 'none' }}
        >
            {$minter({ token, level, row, onMint }, onFocus)}
            {$nn_counter({ token, level, row })}
            {$tx_counter({ token, level, row })}
            {$forget({ token, level, row, onForget })}
        </div>;
    }
    return null;
}
function $minter(
    { token, level, row, onMint }: Omit<Props, 'rows'> & {
        row: MinterRow
    },
    onFocus: (level: Level, flag: boolean) => void
) {
    const amount = nice(Tokenizer.amount(token, level));
    const minting = row.status === MinterStatus.minting;
    const $token = <span className='d-none d-sm-inline'>
        {token}
    </span>;
    const text = minting
        ? <span className="text">Minting {amount} {$token}…</span>
        : <span className="text">Mint {amount} {$token}</span>;
    return <button
        className='btn btn-outline-warning minter'
        disabled={row.disabled || minting}
        onClick={() => { if (onMint) onMint(token, level); }}
        onBlur={() => onFocus(level, false)}
        onFocus={() => onFocus(level, true)}
        ref={globalRef(`.minter[level="${level}"]`)}
        type='button'
    >
        {Spinner({ show: minting, grow: true })}{text}
    </button>;
}
function $nn_counter(
    { token, level, row }: Omit<Props, 'rows'> & {
        row: MinterRow
    }
) {
    return <span
        className='d-inline-block'
        data-bs-toggle='tooltip' data-bs-placement='left'
        title={`Number of level ${level} ${token} tokens mined`}
    >
        <button
            className='btn btn-outline-warning nn-counter'
            type='button' disabled={row.disabled}
        >{row.nn_counter}</button>
    </span>;
}
function $tx_counter(
    { token, level, row }: Omit<Props, 'rows'> & {
        row: MinterRow
    }
) {
    return <span
        className='d-inline-block'
        data-bs-toggle='tooltip' data-bs-placement='left'
        title={`Number of level ${level} ${token} tokens minted`}
    >
        <button
            className='btn btn-outline-warning tx-counter'
            type='button' disabled={row.disabled}
        >{row.tx_counter}</button>
    </span>;
}
function $forget(
    { token, level, row, onForget }: Omit<Props, 'rows'> & {
        row: MinterRow
    }
) {
    return <span
        className='d-inline-block'
        data-bs-toggle='tooltip' data-bs-placement='top'
        title='Forget the tokens mined so far (w/o minting them)'
    >
        <button
            onClick={() => {
                if (onForget) onForget(token, level);
            }}
            className='btn btn-outline-warning forget'
            type='button' disabled={row.disabled}
        >&times;</button>
    </span>;
}
function Spinner(
    { show, grow }: { show: boolean, grow?: boolean }
) {
    const classes = [
        'spinner spinner-border spinner-border-sm',
        'float-start', grow ? 'spinner-grow' : ''
    ];
    return <span
        className={classes.join(' ')} role='status'
        style={{ visibility: show ? 'visible' : 'hidden' }}
    />;
}
export default UiMinting;
