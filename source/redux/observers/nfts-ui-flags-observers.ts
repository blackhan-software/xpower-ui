import { AnyAction } from '@reduxjs/toolkit';
import { Store, Unsubscribe } from 'redux';
import { observe } from './observe';

import { AppState } from '../store';
import { NftFlags } from '../types';

export type OnNftsUiFlags = (
    next: NftFlags, prev: NftFlags
) => void;

export function onNftsUiFlags(
    store: Store<AppState, AnyAction>,
    handler: OnNftsUiFlags
): Unsubscribe {
    const selector = (state: AppState) => state.nfts_ui.flags;
    const observer = observe<NftFlags>(store)(
        selector, {} as NftFlags
    );
    return observer(handler);
}
