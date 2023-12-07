import './qr-code.scss';

import { x40 } from '../../source/functions';
import { Account } from '../../source/redux/types';
import React, { useEffect, useState } from 'react';

import QR from 'qrcode';

export function QRCode(
    { account }: { account: Account | null }
) {
    const [url, set_url] = useState('');
    useEffect(() => {
        if (account) {
            QR.toDataURL(x40(account), (e, u) => {
                if (!e) set_url(u);
            });
        }
    }, [
        account
    ]);
    return <button
        className='qr-code form-control input-group-text'
        data-bs-toggle='tooltip'
        data-bs-placement='top'
        data-bs-html='true'
        key={account}
        role='button'
        title={`<img class='px-1 py-2' src='${url}'>`}
    >
        <i className='bi bi-qr-code'></i>
    </button>;
}
export default QRCode;
