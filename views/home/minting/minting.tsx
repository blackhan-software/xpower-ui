import { global_ref, range } from '../../../source/functions';
import { Level, Token } from '../../../source/redux/types';
import { Tokenizer } from '../../../source/token';
import { nice } from '../../../filters';

import React, { useEffect, useState } from 'react';

type Props = {
    level: Level; rows: MinterRow[]; token: Token;
    onMint?: (token: Token, level: Level) => void;
    onForget?: (token: Token, level: Level) => void;
}
export type MinterRow = {
    status: MinterStatus | null;
    disabled: boolean;
    display: boolean;
    nn_counter: number;
    tx_counter: number;
};
export enum MinterStatus {
    minting = 'minting',
    minted = 'minted',
    error = 'error'
}
export class Minting {
    static get levels() {
        return Array.from(range(1, 65)) as Level[];
    }
    static rows(min_level: Level) {
        return this.levels.map((level) => this.empty({
            display: level === min_level
        }));
    }
    static empty(
        row: Partial<MinterRow> = {}
    ) {
        return {
            status: null,
            disabled: true,
            display: false,
            nn_counter: 0,
            tx_counter: 0,
            ...row
        };
    }
    static getRow(
        rows: MinterRow[], index: number
    ) {
        if (index >= rows.length) {
            throw new Error('index out-of-range');
        }
        return rows[index];
    }
    static setRow(
        rows: MinterRow[], index: number, new_row: Partial<MinterRow>
    ) {
        return rows.map((row, i) =>
            (index !== i) ? { ...row } : { ...row, ...new_row }
        );
    }
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
            const $button = document.querySelector<HTMLElement>(
                `.minter[data-level="${any_focused[0][0]}"]`
            );
            $button?.focus();
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
        return <div ref={global_ref(`.mint[level=${level}]`)}
            className='btn-group mint' key={level - 1} role='group'
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
        ? <>Minting {amount} {$token}…</>
        : <>Mint {amount} {$token}</>;
    return <button className='btn btn-outline-warning minter'
        onClick={() => { if (onMint) onMint(token, level); }}
        type='button' disabled={row.disabled || minting}
        onFocus={() => onFocus(level, true)}
        onBlur={() => onFocus(level, false)}
        data-level={level}
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
