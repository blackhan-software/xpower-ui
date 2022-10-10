import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import { Params } from '../../params';
import { StateDb } from '../../state-db';
import { middleware } from '../middleware';
import * as reducers from '../reducers';
import { refreshed } from '../selectors';
import withServices from '../../services';

const db = new StateDb(localStorage);
if (Params.clear) {
    db.clear(Params.persist);
}
if (Params.clearAll) {
    db.clear();
}
export const reducer = combineReducers({
    aft_wallet: reducers.aftWalletReducer,
    mining: reducers.miningReducer,
    minting: reducers.mintingReducer,
    nfts: reducers.nftsReducer,
    nfts_ui: reducers.nftsUiReducer,
    nonces: reducers.noncesReducer,
    otf_wallet: reducers.otfWalletReducer,
    page: reducers.pageReducer,
    ppts: reducers.pptsReducer,
    ppts_ui: reducers.pptsUiReducer,
    refresh: reducers.refreshReducer,
    token: reducers.tokenReducer,
});
const store = configureStore({
    reducer, middleware: (m) => m({
        /**
         * @todo: fix bigint check & re-enable!
         */
        serializableCheck: false
    }),
    enhancers: middleware({
        logger: Params.logger
    }),
    preloadedState: db.load(Params.persist),
});
if (Params.persist > 0) {
    store.subscribe(() => {
        const state = store.getState();
        if (refreshed(state) === false) {
            db.save(Params.persist, state);
        }
    });
}
export default withServices(store);
