import { CheckCircle } from '../../../public/images/tsx';
import { nice_si, nomobi } from '../../../source/functions';
import { Button, Div, Span, globalRef } from '../../../source/react';
import { Level, MinterStatus, Minting, MintingRow, Token } from '../../../source/redux/types';
import { Tokenizer } from '../../../source/token';

import React, { useEffect, useState } from 'react';

type Props = {
    level: Level;
    rows: Minting['rows'];
    onForget?: (
        level: Level) => void;
    onIgnore?: (
        level: Level, flag: boolean) => void;
    onMint?: (
        level: Level) => void;
}
export function UiMinting(
    { rows, onForget, onIgnore, onMint }: Props
) {
    const [focus, setFocus] = useState<Record<Level, boolean>>({});
    const status = Object.values(rows).map(({ status }) => status);
    useEffect(/*re-focus*/() => {
        const any_focused = Object.entries(focus).filter(
            ([_level, focused]) => focused
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
        <Div className='form-label'>
            Mined Amounts Mintable
        </Div>
        {Object.values(rows).map((row, i) => $mint(
            { level: i + 1, row, onForget, onIgnore, onMint },
            (level, flag) => setFocus({ [level]: flag })
        )).filter((row) => row)}
    </React.Fragment>;
}
function $mint(
    { level, row, onForget, onIgnore, onMint }: Omit<Props, 'rows'> & {
        row: MintingRow
    },
    onFocus: (level: Level, flag: boolean) => void
) {
    const { display, tx_counter, nn_counter } = row;
    if (display || tx_counter > 0 || nn_counter > 0) {
        return <Div
            className='btn-group mint' key={level - 1}
            ref={globalRef(`.mint[level="${level}"]`)} role='group'
            style={{ display: row.display ? 'block' : 'none' }}
        >
            {$ignore({ level, row, onIgnore })}
            {$minter({ level, row, onMint }, onFocus)}
            {$nn_counter({ level, row })}
            {$tx_counter({ level, row })}
            {$forget({ level, row, onForget })}
        </Div>;
    }
    return null;
}
function $ignore(
    { level, row, onIgnore }: Omit<Props, 'rows'> & {
        row: MintingRow
    }
) {
    const title = !row.ignored
        ? `These mined tokens will be queued for minting`
        : `These mined tokens won't be queued for minting`;
    return <Span
        className='d-inline-block'
    >
        <Button
            className='btn btn-outline-warning ignore'
            onClick={() => onIgnore?.(level, !row.ignored)}
            title={nomobi(title)}
        >
            <CheckCircle fill={!row.ignored} />
        </Button>
    </Span>;
}
function $minter(
    { level, row, onMint }: Omit<Props, 'rows'> & {
        row: MintingRow
    },
    onFocus: (level: Level, flag: boolean) => void
) {
    const amount = nice_si(Tokenizer.amount(level));
    const minting = row.status === MinterStatus.minting;
    const $amount = minting
        ? <Span className='d-none d-sm-inline'>&nbsp;{amount}</Span>
        : <Span>&nbsp;{amount}</Span>;
    const $token = <Span className='d-none d-sm-inline'>
        &nbsp;{Token.XPOW}
    </Span>;
    const text = minting
        ? <Span className="text">Minting{$amount}{$token}…</Span>
        : <Span className="text">Mint{$amount}{$token}</Span>;
    return <Button
        className='btn btn-outline-warning minter'
        disabled={row.disabled || row.ignored || minting}
        onClick={() => { if (onMint) onMint(level); }}
        onBlur={() => onFocus(level, false)}
        onFocus={() => onFocus(level, true)}
        ref={globalRef(`.minter[level="${level}"]`)}
    >
        {Spinner({ show: minting, grow: true })}{text}
    </Button>;
}
function $nn_counter(
    { level, row }: Omit<Props, 'rows'> & {
        row: MintingRow
    }
) {
    return <Span
        className='d-inline-block' title={
            `Number of ${Tokenizer.amount(level)} ${Token.XPOW} tokens mined`
        }
    >
        <Button
            className='btn btn-outline-warning nn-counter'
            disabled={row.disabled}
        >{row.nn_counter}</Button>
    </Span>;
}
function $tx_counter(
    { level, row }: Omit<Props, 'rows'> & {
        row: MintingRow
    }
) {
    return <Span
        className='d-inline-block' title={
            `Number of ${Tokenizer.amount(level)} ${Token.XPOW} tokens minted`
        }
    >
        <Button
            className='btn btn-outline-warning tx-counter'
            disabled={row.disabled}
        >{row.tx_counter}</Button>
    </Span>;
}
function $forget(
    { level, row, onForget }: Omit<Props, 'rows'> & {
        row: MintingRow
    }
) {
    const title = `Forget these mined ${Token.XPOW} tokens without minting`;
    return <Span
        className='d-inline-block' title={nomobi(title)}
    >
        <Button
            onClick={() => {
                if (onForget) onForget(level);
            }}
            className='btn btn-outline-warning forget'
            disabled={row.disabled}
        >&times;</Button>
    </Span>;
}
function Spinner(
    { show, grow }: { show: boolean, grow?: boolean }
) {
    const classes = [
        'spinner spinner-border spinner-border-sm',
        'float-start', grow ? 'spinner-grow' : ''
    ];
    return <Span
        className={classes.join(' ')} role='status'
        style={{ display: show ? 'inline-block' : 'none' }}
    />;
}
export default UiMinting;
