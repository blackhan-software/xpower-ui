import './qr-code.scss';

import { sha256 } from 'ethers';
import QR from 'qrcode';

import React, { useEffect, useState } from 'react';
import { Bus } from '../../source/bus';
import { memoized } from '../../source/functions';
import { Button } from '../../source/react';

export function QRCode(
    { data }: { data: string }
) {
    const [url, set_url] = useState('');
    useEffect(() => Bus.emit('refresh-tips'), [url]);
    useEffect(() => {
        QR.toDataURL(data, (e, u) => {
            if (!e) set_url(u);
        });
    }, [data]);
    return <Button
        className='qr-code form-control input-group-text'
        data-bs-html='true' key={keyOf(data)}
        title={`<img class='px-1 py-2' src='${url}'>`}
    >
        <i className='bi bi-qr-code'></i>
    </Button>;
}
const keyOf = memoized((data: string) => {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(data);
    const hash = sha256(bytes);
    return BigInt(hash);
}, (data) => data);
export default QRCode;
