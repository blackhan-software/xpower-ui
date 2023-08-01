import { delayed, nice, nice_si, nomobi, x40 } from '../../source/functions';
import { ROParams } from '../../source/params';
import { switchToken } from '../../source/redux/actions';
import { AppDispatch } from '../../source/redux/store';
import { Account, AftWallet, AftWalletBurner, Amount, Token, TokenInfo } from '../../source/redux/types';
import { Tokenizer } from '../../source/token';

import React from 'react';
import { useDispatch } from 'react-redux';
import { Fire, XPower } from '../../public/images/tsx';
import { Sector } from './sector';

type Props = {
    account: Account | null;
    onBurn?: (token: Token, amount: Amount) => void;
    token: Token;
    toggled: boolean;
    onToggled?: (toggled: boolean) => void;
    wallet: AftWallet;
}
export function UiAftWallet(
    props: Props
) {
    const dispatch = useDispatch<AppDispatch>();
    const aged = Tokenizer.aified(props.token);
    const set_aged = (aged: boolean) => {
        if (aged) {
            dispatch(switchToken(Tokenizer.aify(props.token)));
        } else {
            dispatch(switchToken(Tokenizer.xify(props.token)));
        }
    };
    return <div id='aft-wallet'>
        <label className='form-label'>
            Wallet Address and {props.token} Balance
        </label>
        <div className='input-group wallet-address'>
            {$otfToggle(props)}
            {$account(props)}
            {$aftBurner(props)}
            {$balance(props)}
            {$aftToggle({
                ...props, aged, set_aged
            })}
        </div>
    </div>;
}
function $otfToggle(
    { toggled, onToggled }: Props
) {
    const icon = toggled
        ? 'bi-wallet2' : 'bi-wallet';
    const title = toggled
        ? 'Disable minter wallet & hide balance of AVAX'
        : 'Enable minter wallet & show balance of AVAX';
    return <button id='otf-wallet-toggle'
        className='form-control input-group-text'
        data-bs-toggle='tooltip' data-bs-placement='top'
        onClick={onToggled?.bind(null, !toggled)}
        role='button' title={nomobi(title)}
    >
        <i className={icon} />
    </button>;
}
function $account(
    { account }: Props
) {
    return <input type='text' readOnly
        className='form-control' id='aft-wallet-address'
        data-bs-toggle='tooltip' data-bs-placement='top'
        title='Wallet address'
        value={x40(account ?? 0n)}
    />;
}
function $aftBurner(
    { token, wallet, onBurn }: Props
) {
    const outer_classes = [
        'form-control input-group-text',
        disabled() ? 'disabled' : '',
        burning() ? 'burning' : ''
    ];
    const inner_classes = [
        'spinner spinner-border spinner-border-sm', 'float-start'
    ];
    return <button aria-label={title()}
        className={outer_classes.join(' ')}
        data-bs-toggle='tooltip' data-bs-placement='top'
        data-bs-original-title={title()} title={title()}
        id='aft-wallet-burner' onClick={on_click} role='tooltip'
    >
        <span
            className={inner_classes.join(' ')} role='status'
        />
        <Fire />
    </button>;
    function on_click(e: React.MouseEvent) {
        if (disabled()) {
            e.defaultPrevented = true;
            e.stopPropagation();
            return;
        }
        if (onBurn) {
            const { decimals } = TokenInfo(token);
            const text = prompt(
                `Really? Confirm the amount of ${token} tokens to burn:`,
                nice(amount(), { base: 10 ** decimals, maxPrecision: 18 })
            );
            if (typeof text !== 'string') {
                return;
            }
            const input = Number(text.replace(/[']/g, ''));
            if (isNaN(input) || input === 0) {
                return;
            }
            const value = BigInt(input * 10 ** decimals);
            if (value < amount()) {
                onBurn(token, value);
            } else {
                onBurn(token, amount());
            }
        }
    }
    function amount() {
        return wallet.items[token]?.amount ?? 0n;
    }
    function disabled() {
        return amount() === 0n || Tokenizer.xified(token) && !ROParams.debug;
    }
    function burning() {
        return wallet.burner === AftWalletBurner.burning;
    }
    function title() {
        if (Tokenizer.aified(token)) {
            const atoken = Tokenizer.aify(token);
            const xtoken = Tokenizer.xify(token);
            return `Burn your ${atoken} to *unwrap* ${xtoken} tokens`;
        }
    }
}
function $balance(
    { token, wallet }: Props
) {
    const on_click = delayed(() => {
        const $burner = document.getElementById(
            'aft-wallet-burner'
        );
        if ($burner) {
            $burner.click();
        }
    }, 600);
    const amount = wallet.items[token]?.amount ?? 0n;
    const { decimals } = TokenInfo(token);
    return <input type='text' readOnly
        className='form-control' id='aft-wallet-balance'
        data-bs-toggle='tooltip' data-bs-placement='top'
        title={`${nice(amount, { base: 10 ** decimals })} ${token}`}
        value={nice_si(amount, { base: 10 ** decimals })}
        onTouchEnd={on_click.cancel}
        onTouchStart={on_click}
    />;
}
function $aftToggle(
    { wallet, token, aged, set_aged }: Props & {
        aged: boolean, set_aged: (aged: boolean) => void
    }
) {
    const collat = collat_pct({
        wallet, token
    });
    const title = aged
        ? `Balance of ${token} tokens collateralized at ${collat.toFixed(2)}%`
        : `Balance of proof-of-work ${token} tokens`;
    return <button
        className='form-control input-group-text info'
        data-bs-toggle='tooltip' data-bs-placement='top'
        id='aft-wallet-sov-toggle' role='tooltip'
        title={title} onClick={() => set_aged(!aged)}
    >
        <XPower token={Tokenizer.xify(token)} style={{
            filter: aged ? 'invert(1)' : undefined
        }} />
        {aged ? $sectors({ percent: collat / 100 }) : null}
    </button>;
}
function $sectors(
    { percent }: { percent: number }
) {
    return <Sector
        length={360 * percent} start={180 * (1 - percent)}
    />;
}
function collat_pct(
    { wallet, token }: Pick<Props, 'wallet' | 'token'>, denominator = 1e6
) {
    return 100 * Number(wallet.items[token]?.collat ?? 0n) / denominator;
}
export default UiAftWallet;
