import { AnyAction, EnhancedStore, Middleware } from '@reduxjs/toolkit';
import { ROParams } from '../params';
import { AppState } from '../redux/store';

import { HistoryService } from './history-service';
import { LocationService } from './location-service';
import { MiningService } from './mining-service';
import { MintingService } from './minting-service';
import { NftsService } from './nfts-service';
import { NftsUiService } from './nfts-ui-service';
import { PptsService } from './ppts-service';
import { PptsUiService } from './ppts-ui-service';
import { RatesService } from './rates-service';
import { ThemeService } from './theme-service';
import { TooltipService } from './tooltip-service';
import { WalletService } from './wallet-service';

export default <
    S extends AppState,
    A extends AnyAction,
    M extends Middleware<S>[]
>(
    store: EnhancedStore<S, A, M>
) => {
    if (ROParams.service('location')) {
        LocationService(store);
    }
    if (ROParams.service('history')) {
        HistoryService(store);
    }
    if (ROParams.service('mining')) {
        MiningService(store);
    }
    if (ROParams.service('minting')) {
        MintingService(store);
    }
    if (ROParams.service('nfts')) {
        NftsService(store);
    }
    if (ROParams.service('nfts-ui')) {
        NftsUiService(store);
    }
    if (ROParams.service('ppts')) {
        PptsService(store);
    }
    if (ROParams.service('ppts-ui')) {
        PptsUiService(store);
    }
    if (ROParams.service('rates')) {
        RatesService(store);
    }
    if (ROParams.service('theme')) {
        ThemeService(store);
    }
    if (ROParams.service('tooltip')) {
        TooltipService(store);
    }
    if (ROParams.service('wallet')) {
        WalletService(store);
    }
    return store;
};
