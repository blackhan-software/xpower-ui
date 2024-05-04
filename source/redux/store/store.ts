import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import { ROParams } from '../../params';
import withServices from '../../services';
import { StateDb } from '../../state-db';
import { middleware } from '../middleware';
import * as reducers from '../reducers';
import { refreshed } from '../selectors';

const db = new StateDb(localStorage);
if (ROParams.clear) {
    db.clear(ROParams.persist);
}
if (ROParams.clearAll) {
    db.clear();
}
export const reducer = combineReducers({
    aft_wallet: reducers.aftWalletReducer,
    history: reducers.historyReducer,
    mining: reducers.miningReducer,
    minting: reducers.mintingReducer,
    nfts: reducers.nftsReducer,
    nfts_ui: reducers.nftsUiReducer,
    nonces: reducers.noncesReducer,
    otf_wallet: reducers.otfWalletReducer,
    page: reducers.pageReducer,
    ppts: reducers.pptsReducer,
    ppts_ui: reducers.pptsUiReducer,
    rates: reducers.ratesReducer,
    rates_ui: reducers.ratesUiReducer,
    refresh: reducers.refreshReducer,
    token: reducers.tokenReducer,
});
const store = configureStore({
    reducer, middleware: (m) => m({
        /**
         * @todo: reduce initial lag & re-enable!
         */
        immutableCheck: false,
        /**
         * @todo: fix bigint check & re-enable!
         */
        serializableCheck: false,
    }),
    enhancers: (e) => e().concat(
        middleware({ logger: ROParams.logger })
    ),
    preloadedState: db.load(ROParams.persist),
});
if (ROParams.persist > 0) {
    store.subscribe(() => {
        const state = store.getState();
        if (refreshed(state) === false) {
            db.save(ROParams.persist, state);
        }
    });
}
export default withServices(store);
