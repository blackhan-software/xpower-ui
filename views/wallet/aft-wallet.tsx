import { nice, nice_si, x40 } from '../../source/functions';
import { Address, AftWallet, Token } from '../../source/redux/types';

import React from 'react';
import { XPower } from '../../public/images/tsx';

type Props = {
    wallet: AftWallet['items'];
    address: Address | null;
    token: Token;
    toggled: boolean;
    onToggled?: (toggled: boolean) => void;
}
export function UiAftWallet(
    props: Props
) {
    return <div id='aft-wallet'>
        <label className='form-label'>
            Wallet Address and {props.token} Balance
        </label>
        <div className='input-group wallet-address'>
            {$toggle(props)}
            {$address(props)}
            {$balance(props)}
            {$info(props)}
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
        role='button' title={title}
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
    { token, wallet }: Props
) {
    const item = wallet[token];
    return <input type='text' readOnly
        className='form-control' id='aft-wallet-balance'
        data-bs-toggle='tooltip' data-bs-placement='top'
        title={`${nice(item?.amount ?? 0n)} ${token}`}
        value={nice_si(item?.amount ?? 0n)}
    />;
}
function $info(
    { token }: Props
) {
    return <button role='tooltip'
        className='form-control input-group-text info'
        data-bs-toggle='tooltip' data-bs-placement='top'
        title={`Balance of proof-of-work ${token} tokens`}
    >
        <XPower token={token} />
    </button>;
}
export default UiAftWallet;
