import { delayed, nice, nice_si, nomobi, prompt, x40 } from '../../source/functions';
import { ROParams } from '../../source/params';
import { switchToken } from '../../source/redux/actions';
import { AppDispatch } from '../../source/redux/store';
import { Account, Address, AftWallet, AftWalletBurner, Amount, Token, TokenInfo } from '../../source/redux/types';
import { Tokenizer } from '../../source/token';

import React, { Dispatch, SetStateAction, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { Fire, XPower } from '../../public/images/tsx';
import { TokenContext } from '../../source/react';

import { QRCode } from './qr-code';
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
    return <div id='aft-wallet'>
        <div className='form-label'>
            Wallet Address and {token} Balance
        </div>
        <div className='input-group aft-wallet-address wallet-address'>
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
        </div>
    </div>;
}
function $otfToggle(
    { toggled, onToggled }: Props
) {
    const icon = toggled
        ? 'bi bi-wallet2' : 'bi bi-wallet';
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
function $qr_code(
    { account }: Pick<Props, 'account'>
) {
    return <QRCode account={account} />;
}
function $copy(
    { account }: Pick<Props, 'account'>
) {
    return <button id='aft-wallet-copy'
        className='form-control input-group-text'
        data-bs-toggle='tooltip' data-bs-placement='top'
        onClick={() => navigator.clipboard.writeText(x40(account!))}
        role='button' title='Copy address'
    >
        <i className='bi bi-copy'></i>
    </button>;
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
    return <select
        default-value={x40(0n)} value={x40(account)}
        className='form-select' id='aft-wallet-address'
        data-bs-toggle='tooltip' data-bs-placement='top'
        title='Wallet address' onChange={(e) => {
            set_account(BigInt(e.target.value))
        }}
    >
        {options}
    </select>;
    function dns(account: Account) {
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
    async function on_click(e: React.MouseEvent) {
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
            const atoken = Tokenizer.aify(token);
            const xtoken = Tokenizer.xify(token);
            return `Burn your ${atoken} to *unwrap* ${xtoken} tokens`;
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
    return <button
        className='form-control input-group-text info'
        data-bs-toggle='tooltip' data-bs-placement='top'
        id='aft-wallet-sov-toggle' role='tooltip'
        title={title} onClick={() => set_aged(!aged)}
    >
        <XPower token={Tokenizer.xify(token)} style={{
            filter: aged ? 'invert(1)' : undefined
        }} />
        {aged ? $sectors({ percent: metric / 1e2 }) : null}
    </button>;
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
