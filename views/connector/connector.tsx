/* eslint @typescript-eslint/no-explicit-any: [off] */
import './connector.scss';

import React, { createElement, useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import { createRoot } from 'react-dom/client';
import { Provider, useStore } from 'react-redux';
import { globalRef } from '../../source/react';

import { Blockchain, ChainId } from '../../source/blockchain';
import { Bus } from '../../source/bus';
import { delayed, mobile } from '../../source/functions';
import { ROParams } from '../../source/params';
import { onTokenSwitch } from '../../source/redux/observers';
import { AppState, Store } from '../../source/redux/store';

import { Info, Label, Spinner } from './components';
import { RpcAddress, RpcToggle } from './rpc-address';

export type State = {
    chain: Chain;
}
export enum Chain {
    UNAVAILABLE,
    WRONG_ID,
    UNCONNECTED,
    CONNECTING,
    CONNECTED,
}
export enum WifiLevel {
    LEVEL_0 = 0,
    LEVEL_1 = 1,
    LEVEL_2 = 2,
    LEVEL_3 = 3,
}
export function UiConnector() {
    const [chain, set_chain] = useState(Chain.CONNECTING);
    const [toggled, set_toggled] = useState(false);
    useEffect(() => {
        Bus.emit('refresh-tips');
    }, [chain, toggled]);
    const store = useStore<AppState>();
    useEffect(() => {
        return onTokenSwitch(store, () => reset());
    }, [store]);
    useEffect(() => {
        if (chain !== Chain.CONNECTED) {
            const $ref = globalRef<HTMLElement>(
                '#connect-wallet'
            );
            $ref.current?.focus();
        }
    });
    useEffect(() => {
        Blockchain.onConnect(() => {
            set_chain(Chain.CONNECTED);
        });
    });
    const reset = async (
        { silent } = { silent: true }
    ) => {
        if (!await Blockchain.isInstalled()) {
            return set_chain(Chain.UNAVAILABLE);
        }
        if (!await Blockchain.isConnected()) {
            return set_chain(Chain.UNCONNECTED);
        }
        if (!await Blockchain.isAvalanche()) {
            return set_chain(Chain.WRONG_ID);
        }
        if (!silent) {
            set_chain(Chain.CONNECTING);
        }
        try {
            await Blockchain.connect();
            set_chain(Chain.CONNECTED);
        } catch (ex: any) {
            if (ex.code !== -32002) {
                set_chain(Chain.UNCONNECTED);
            }
            console.error(ex);
        }
    };
    useEffect(() => {
        delayed(reset, ms())({ silent: false });
    }, []);
    const [level, set_level] = useState(WifiLevel.LEVEL_1);
    useEffect(() => {
        if (chain === Chain.CONNECTING) {
            const iid = setInterval(() => {
                if (chain !== Chain.CONNECTING) {
                    clearInterval(iid);
                }
                if (level === 0) set_level(1);
                if (level === 1) set_level(2);
                if (level === 2) set_level(3);
                if (level === 3) set_level(1);
            }, 300);
            return () => clearInterval(iid);
        }
    }, [chain, level]);
    return <>
        <div className='btn-group connect-wallet' role='group'>
            <RpcToggle toggled={toggled} onToggled={set_toggled} />
            <Connector chain={chain} />
            <Info chain={chain} level={level} />
        </div>
        <CSSTransition
            nodeRef={globalRef<HTMLElement>('.rpc-address')}
            in={toggled} timeout={600} classNames='fade-in-600'
        >
            <RpcAddress toggled={toggled} />
        </CSSTransition>
    </>;
}
function Connector(
    { chain }: Pick<State, 'chain'>
) {
    const on_click = async () => {
        if (chain === Chain.WRONG_ID) {
            await Blockchain.switchTo(
                ChainId.AVALANCHE_MAINNET
            );
            return location.reload();
        }
        if (chain === Chain.UNCONNECTED) {
            return reload(600);
        }
    };
    const href = chain === Chain.UNAVAILABLE
        ? 'https://metamask.io/download/' : '#';
    const rel = href.length === 1
        ? 'nofollow' : undefined;
    const target = href.length > 1
        ? '_blank' : undefined;
    const disabled = connecting(chain)
        ? 'disabled' : '';
    return <a type='button' ref={globalRef('#connect-wallet')}
        className={`btn btn-outline-warning ${disabled}`}
        id='connect-wallet' onClick={on_click}
        href={href} target={target} rel={rel}
    >
        <Spinner show={connecting(chain)} grow={true} />
        <Label chain={chain} />
    </a>;
}
function connecting(
    chain: State['chain']
) {
    return chain === Chain.CONNECTING;
}
function ms(
    fallback?: number
) {
    if (typeof fallback === 'undefined') {
        fallback = mobile() ? 600 : 200;
    }
    const ms = Number(
        ROParams.reloadMs ?? fallback
    );
    return !isNaN(ms) ? ms : fallback;
}
function reload(
    delta_ms: number
) {
    if (location.search) {
        const rx = /reload-ms=([0-9]+)/;
        const match = location.search.match(rx);
        if (match && match.length > 1) {
            location.search = location.search.replace(
                rx, `reload-ms=${delta_ms + Number(match[1])}`
            );
        } else {
            location.search += `&reload-ms=${delta_ms}`;
        }
    } else {
        location.search = `?reload-ms=${delta_ms}`;
    }
}
if (require.main === module) {
    const $connector = document.querySelector('form#connector');
    const $ui_connector = createElement(UiConnector);
    createRoot($connector!).render(
        <Provider store={Store()}>{$ui_connector}</Provider>
    );
}
export default UiConnector;
