import { buffered, range } from '../../../source/functions';
import { Level, Token } from '../../../source/redux/types';
import { Tokenizer } from '../../../source/token';
import { Tooltip } from '../../tooltips';
import { nice } from '../../../filters';

import React from 'react';

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
export class Minting extends React.Component<
    Props
> {
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
    render() {
        const { rows, token } = this.props;
        return <React.Fragment>
            <label className='form-label'>
                Mined Amounts (not minted yet)
            </label>
            {rows
                .map((row, i) => this.$mint(token, i + 1, row))
                .filter((row) => row)}
        </React.Fragment>;
    }
    $mint(
        token: Token, level: Level, row: MinterRow
    ) {
        const { display, tx_counter, nn_counter } = row;
        if (display || tx_counter > 0 || nn_counter > 0) {
            return <div
                className='btn-group mint' key={level - 1} role='group'
                style={{ display: row.display ? 'block' : 'none' }}
            >
                {this.$minter(token, level, row)}
                {this.$nn_counter(token, level, row)}
                {this.$tx_counter(token, level, row)}
                {this.$forget(token, level, row)}
            </div>;
        }
        return null;
    }
    $minter(
        token: Token, level: Level, { disabled, status }: MinterRow
    ) {
        const amount = nice(Tokenizer.amount(token, level));
        const minting = status === MinterStatus.minting;
        const text = minting
            ? <>Minting {amount} <span className='d-none d-sm-inline'>{token}</span>…</>
            : <>Mint {amount} <span className='d-none d-sm-inline'>{token}</span></>;
        return <button className='btn btn-outline-warning minter'
            onClick={this.mint.bind(this, token, level)}
            type='button' disabled={disabled || minting}
        >
            {Spinner({ show: minting, grow: true })}{text}
        </button>;
    }
    mint(
        token: Token, level: Level
    ) {
        if (this.props.onMint) {
            this.props.onMint(token, level);
        }
    }
    $nn_counter(
        token: Token, level: Level, { disabled, nn_counter }: MinterRow
    ) {
        return <span
            className='d-inline-block'
            data-bs-toggle='tooltip' data-bs-placement='left'
            title={`Number of level ${level} ${token} tokens mined`}
        >
            <button
                className='btn btn-outline-warning nn-counter'
                type='button' disabled={disabled}
            >{nn_counter}</button>
        </span>;
    }
    $tx_counter(
        token: Token, level: Level, { disabled, tx_counter }: MinterRow
    ) {
        return <span
            className='d-inline-block'
            data-bs-toggle='tooltip' data-bs-placement='left'
            title={`Number of level ${level} ${token} tokens minted`}
        >
            <button
                className='btn btn-outline-warning tx-counter'
                type='button' disabled={disabled}
            >{tx_counter}</button>
        </span>;
    }
    $forget(
        token: Token, level: Level, { disabled }: MinterRow
    ) {
        return <span
            className='d-inline-block'
            data-bs-toggle='tooltip' data-bs-placement='top'
            title='Forget the tokens mined so far (w/o minting them)'
        >
            <button
                onClick={this.forget.bind(this, token, level)}
                className='btn btn-outline-warning forget'
                type='button' disabled={disabled}
            >&times;</button>
        </span>;
    }
    forget(
        token: Token, level: Level
    ) {
        if (this.props.onForget) {
            this.props.onForget(token, level);
        }
    }
    componentDidUpdate = buffered(() => {
        const $forget = document.querySelectorAll<HTMLElement>(
            '.mint button.forget'
        );
        $forget.forEach(($el) => {
            const $tip = $el.parentElement;
            if ($tip) Tooltip.getInstance($tip)?.hide();
        });
    })
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
export default Minting;
