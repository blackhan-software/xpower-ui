import { delayed, nice, nice_si, nomobi, prompt, x40 } from '../../source/functions';
import { ROParams } from '../../source/params';
import { switchToken } from '../../source/redux/actions';
import { AppDispatch } from '../../source/redux/store';
import { Account, Address, AftWallet, AftWalletBurner, Amount, Token, TokenInfo } from '../../source/redux/types';
import { Tokenizer } from '../../source/token';

import React, { Dispatch, SetStateAction, useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Fire, ToggleAlt, XPower } from '../../public/images/tsx';
import { Button, Div, Input, Select, Span, TokenContext } from '../../source/react';

import { QRCode } from '../qr-code';
import { Sector } from './sector';


export type Props = {
    account: Account | null;
    set_account: Dispatch<SetStateAction<Account | null>>;
    accounts: Account[];
    names: Record<Address, string>;
    onBurn?: (token: Token, amount: Amount) => void;
    toggled: boolean;
    onToggled?: (toggled: boolean) => void;
    wallet: AftWallet;
}
export function UiAftWallet(
    props: Props
) {
    const [token] = useContext(TokenContext);
    const aged = Tokenizer.aified(token);
    const dispatch = useDispatch<AppDispatch>();
    const set_aged = (aged: boolean) => {
        dispatch(switchToken(aged ? Token.APOW : Token.XPOW));
    };
    return <Div id='aft-wallet'>
        <Div className='form-label'>
            Wallet Address and {token} Balance {$aftToggleMini({ aged, set_aged })}
        </Div>
        <Div className='input-group aft-wallet-address wallet-address'>
            {$otfToggle({
                ...props
            })}
            {$qr_code({
                ...props
            })}
            {$account({
                ...props
            })}
            {$copy({
                ...props
            })}
            {$aftBurner({
                ...props, token
            })}
            {$balance({
                ...props, token
            })}
            {$aftToggle({
                ...props, aged, set_aged, token
            })}
        </Div>
    </Div>;
}
function $otfToggle(
    { toggled, onToggled }: Props
) {
    const icon = toggled
        ? 'bi bi-wallet2' : 'bi bi-wallet';
    const title = toggled
        ? 'Disable minter wallet & hide balance of AVAX'
        : 'Enable minter wallet & show balance of AVAX';
    return <Button
        className='form-control input-group-text'
        id='otf-wallet-toggle'
        onClick={onToggled?.bind(null, !toggled)}
        title={nomobi(title)}
    >
        <i className={icon} />
    </Button>;
}
function $qr_code(
    { account }: Pick<Props, 'account'>
) {
    return <QRCode data={account ? x40(account) : ''} />;
}
function $copy(
    { account }: Pick<Props, 'account'>
) {
    return <Button
        className='form-control input-group-text'
        id='aft-wallet-copy'
        onClick={() => navigator.clipboard.writeText(x40(account!))}
        title='Copy address'
    >
        <i className='bi bi-copy'></i>
    </Button>;
}
function $account(
    { account, accounts, names, set_account }: Props
) {
    if (account === null) {
        account = 0n;
    }
    if (accounts.length === 0) {
        accounts = [account];
    }
    const ro_account = account && !accounts.includes(account);
    if (ro_account) {
        accounts = [...accounts, account];
    }
    const options = accounts.map((a) => (a === account && ro_account)
        ? <option key={a} value={x40(a)}>{dns(a)}&nbsp;[read-only]</option>
        : <option key={a} value={x40(a)}>{dns(a)}</option>
    );
    return <Select
        className='form-select'
        default-value={x40(0n)}
        id='aft-wallet-address'
        onChange={(e) => set_account(BigInt(e.target.value))}
        title='Wallet address'
        value={x40(account)}
    >
        {options}
    </Select>;
    function dns(
        account: Account
    ) {
        const a = x40(account);
        if (names[a]) {
            return `${names[a]} (${a.slice(0, 6)}…${a.slice(-4)})`;
        }
        return a;
    }
}
function $aftBurner(
    { token, wallet, onBurn }: Props & { token: Token }
) {
    const outer_classes = [
        'form-control input-group-text',
        disabled() ? 'disabled' : '',
        burning() ? 'burning' : ''
    ];
    const inner_classes = [
        'spinner spinner-border spinner-border-sm', 'float-start'
    ];
    return <Button
        className={outer_classes.join(' ')}
        id='aft-wallet-burner'
        onClick={on_click}
        title={title()}
    >
        <span
            className={inner_classes.join(' ')} role='status'
        />
        <Fire />
    </Button>;
    async function on_click(
        e: React.MouseEvent
    ) {
        if (disabled()) {
            e.defaultPrevented = true;
            e.stopPropagation();
            return;
        }
        if (onBurn) {
            const { decimals } = TokenInfo(token);
            const text = await prompt(
                `Really? Confirm the amount of ${token} tokens to burn: 🔥`,
                nice(amount(), { base: 10 ** decimals, maxPrecision: 18 })
            );
            if (typeof text !== 'string') {
                return;
            }
            const input = Number(text.replace(/[']/g, ''));
            if (isNaN(input) || input === 0) {
                return;
            }
            const value = BigInt(Math.ceil(input * 10 ** decimals));
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
            const xtoken = Tokenizer.xify(token);
            return `Burn your ${token} to *unwrap* ${xtoken} tokens`;
        } else {
            return `Burn your ${token}`;
        }
    }
}
function $balance(
    { token, wallet }: Props & { token: Token }
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
    return <Input
        className='form-control'
        id='aft-wallet-balance'
        onTouchEnd={on_click.cancel}
        onTouchStart={on_click}
        readOnly
        title={`${nice(amount, { base: 10 ** decimals })} ${token}`}
        value={nice_si(amount, { base: 10 ** decimals })}
    />;
}
function $aftToggle(
    { wallet, token, aged, set_aged }: Props & {
        aged: boolean, set_aged: (aged: boolean) => void, token: Token
    }
) {
    const metric = metric_pct({
        wallet, token
    });
    const title = aged
        ? `${token}s with a conversion rate of ${nice(metric, {
            maxPrecision: 2, minPrecision: 2
        })}%`
        : `Balance of ${token}s`;
    return <Button
        className='form-control input-group-text info'
        id='aft-wallet-sov-toggle'
        onClick={() => set_aged(!aged)}
        title={title}
    >
        <XPower token={Tokenizer.xify(token)} style={{
            filter: aged ? 'invert(1)' : undefined
        }} />
        {aged ? $sectors({ percent: metric / 1e2 }) : null}
    </Button>;
}
function $aftToggleMini(
    { aged, set_aged }: {
        aged: boolean, set_aged: (aged: boolean) => void
    }
) {
    const token = aged ? Token.XPOW : Token.APOW;
    const [on, set_on] = useState(false);
    return <Span
        id='aft-wallet-sov-toggle-mini'
        onClick={() => set_aged(!aged)}
        onMouseEnter={() => set_on(true)}
        onMouseLeave={() => set_on(false)}
        title={`Toggle ${token}`}
    >
        <ToggleAlt on={on} style={{
            transform: `rotate(${angle(on, aged)}deg)`
        }} />
    </Span>;
    function angle(
        lhs: boolean, rhs: boolean
    ) {
        return (lhs && rhs) || (!lhs && !rhs) ? 0 : 180;
    }
}
function $sectors(
    { percent }: { percent: number }
) {
    return <Sector
        length={360 * percent} start={180 * (1 - percent)}
        stroke={{ color: 'var(--xp-accentuated)' }}
    />;
}
function metric_pct(
    { wallet, token }: Pick<Props, 'wallet'> & { token: Token }, denominator = 1e18
) {
    return 1e2 * Number(wallet.items[token]?.metric ?? 0n) / denominator;
}
export default UiAftWallet;
