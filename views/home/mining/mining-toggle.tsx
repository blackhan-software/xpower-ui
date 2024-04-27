import { confirm } from '../../../source/functions';
import { ROParams } from '../../../source/params';
import { AccountContext, Button, Div, Span } from '../../../source/react';
import { Account, MinerStatus, Token } from '../../../source/redux/types';

import React, { useContext, useEffect, useState } from 'react';
import { InfoCircle } from '../../../public/images/tsx';

type Props = {
    disabled: boolean;
    status: MinerStatus | null;
    onToggle?: () => void;
}
export function UiMiningToggle(
    { disabled, status, onToggle }: Props
) {
    return <Div
        className='btn-group toggle-mining' role='group'
    >
        {$toggle({ status, disabled, onToggle })}
        {$info()}
    </Div>;
}
function $toggle(
    { status, disabled, onToggle }: Omit<Props, 'token'>
) {
    const [account] = useContext(AccountContext);
    const [focus, setFocus] = useState(false);
    useEffect(/*re-focus*/() => {
        if (focus) {
            const $toggle = document.getElementById(
                'toggle-mining'
            );
            $toggle?.focus();
        }
    }, [focus, status]);
    return <Button id='toggle-mining'
        className='btn btn-outline-warning'
        disabled={disabled || disabledFor(status)}
        onBlur={() => setFocus(false)}
        onClick={toggle.bind(null, {
            account, status, onToggle
        })}
        onFocus={() => setFocus(true)}
    >
        {Spinner(status)}
        {$text(status)}
    </Button>;
}
async function toggle(
    { account, status, onToggle }: Pick<Props, 'status' | 'onToggle'> & {
        account: Account | null
    }
) {
    if (onToggle) {
        const info = warning(account);
        if (status !== MinerStatus.started && info.warn) {
            const consent = await confirm(
                "Mining might seriously *damage* your device! Continue? 🔥"
            );
            if (consent) {
                persist(info)
            } else {
                return;
            }
        }
        onToggle();
    }
    function warning(
        account: Account | null,
        max_time = 8.64e7, // daily
        key = 'mining-toggle:not-started:warn',
    ) {
        if (account) {
            key += ':' + account;
        }
        const now_date = new Date();
        const old_date = new Date(localStorage.getItem(key) ?? 0);
        const dif_time = now_date.getTime() - old_date.getTime();
        const warn = !!ROParams.debug || dif_time > max_time;
        return { warn, key, date: now_date };
    }
    function persist(
        { warn, key, date }: { warn: boolean, key: string, date: Date }
    ) {
        if (warn) {
            localStorage.setItem(key, date.toISOString());
        }
        return { warn, key, date };
    }
}
function disabledFor(
    status: MinerStatus | null
) {
    if (status === null) {
        return false;
    }
    switch (status) {
        case MinerStatus.initialized:
        case MinerStatus.started:
        case MinerStatus.stopped:
        case MinerStatus.paused:
        case MinerStatus.resumed:
            return false;
    }
    return true;
}
function $text(
    status: MinerStatus | null
) {
    return <Span className='text'>
        {textFor(status)}
    </Span>;
}
function textFor(
    status: MinerStatus | null
) {
    switch (status) {
        case MinerStatus.initializing:
            return 'Initializing Mining…';
        case MinerStatus.initialized:
            return 'Start Mining';
        case MinerStatus.starting:
            return 'Starting Mining…';
        case MinerStatus.started:
            return 'Stop Mining';
        case MinerStatus.stopping:
        case MinerStatus.stopped:
            return 'Start Mining';
        case MinerStatus.pausing:
            return 'Pausing Mining…';
        case MinerStatus.paused:
            return 'Resume Mining';
        case MinerStatus.resuming:
            return 'Resuming Mining…';
        case MinerStatus.resumed:
            return 'Stop Mining';
    }
    return 'Start Mining';
}
function $info() {
    return <Button
        className='btn btn-outline-warning info'
        title={`Start mining for ${Token.XPOW}s`}
    >
        <InfoCircle fill={true} />
    </Button>;
}
function Spinner(
    status: MinerStatus | null
) {
    const visible = (status: MinerStatus | null) => {
        switch (status) {
            case MinerStatus.initializing:
            case MinerStatus.starting:
            case MinerStatus.stopping:
            case MinerStatus.pausing:
            case MinerStatus.resuming:
                return 'visible';
        }
        switch (status) {
            case MinerStatus.started:
                return 'visible';
        }
        return 'hidden';
    };
    const grow = (status: MinerStatus | null) => {
        switch (status) {
            case MinerStatus.initializing:
            case MinerStatus.starting:
            case MinerStatus.stopping:
            case MinerStatus.pausing:
            case MinerStatus.resuming:
                return 'spinner-grow';
        }
        return '';
    };
    const classes = [
        'spinner spinner-border spinner-border-sm',
        'float-start', grow(status)
    ];
    return <Span
        className={classes.join(' ')} role='status'
        style={{ visibility: visible(status) }}
    />;
}
export default UiMiningToggle;
