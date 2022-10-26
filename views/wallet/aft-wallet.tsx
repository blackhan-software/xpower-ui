import { nice, nice_si, nomobi, x40 } from '../../source/functions';
import { Address, AftWallet, Page, Token } from '../../source/redux/types';

import React, { useEffect, useState } from 'react';
import { XPower } from '../../public/images/tsx';
import { Bus } from '../../source/bus';

type Props = {
    address: Address | null;
    page: Page;
    token: Token;
    toggled: boolean;
    onToggled?: (toggled: boolean) => void;
    wallet: AftWallet['items'];
}
export function UiAftWallet(
    props: Props
) {
    const [aged, set_aged] = useState(
        props.page === Page.Ppts
    );
    useEffect(() => {
        Bus.emit('refresh-tips');
    }, [aged])
    return <div id='aft-wallet'>
        <label className='form-label'>
            Wallet Address and {props.token} Balance
        </label>
        <div className='input-group wallet-address'>
            {$toggle(props)}
            {$address(props)}
            {$balance({ ...props, aged })}
            {$info({ ...props, aged, set_aged })}
        </div>
    </div>;
}
function $toggle(
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
function $address(
    { address }: Props
) {
    return <input type='text' readOnly
        className='form-control' id='aft-wallet-address'
        data-bs-toggle='tooltip' data-bs-placement='top'
        title='Wallet address'
        value={x40(address ?? 0n)}
    />;
}
function $balance(
    { aged, token, wallet }: Props & { aged: boolean }
) {
    const prefix = aged ? 'a' : '';
    const amount = wallet[token]?.amount ?? 0n;
    return <input type='text' readOnly
        className='form-control' id='aft-wallet-balance'
        data-bs-toggle='tooltip' data-bs-placement='top'
        title={`${nice(amount, { base: 1e18 })} ${prefix}${token}`}
        value={nice_si(amount, { base: 1e18 })}
    />;
}
function $info(
    { token, aged, set_aged }: Props & {
        aged: boolean, set_aged: (aged: boolean) => void
    }
) {
    const title = aged
        ? `Balance of proof-of-work a${token} tokens`
        : `Balance of proof-of-work ${token} tokens`;
    return <button role='tooltip'
        className='form-control input-group-text info'
        data-bs-toggle='tooltip' data-bs-placement='top'
        title={title} onClick={() => set_aged(!aged)}
    >
        <XPower token={token} style={aged ? {
            border: '1px solid var(--xp-powered)',
            borderRadius: '9px',
            filter: 'invert(1)',
            height: '18px',
            width: '18px',
        }:{}} />
    </button>;
}
export default UiAftWallet;
