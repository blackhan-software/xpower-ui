import { EnhancedStore, StoreEnhancer, UnknownAction } from '@reduxjs/toolkit';
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
import { TooltipService } from './tooltip-service';
import { WalletService } from './wallet-service';

import { Version } from '../types';

export default <
    S extends AppState,
    A extends UnknownAction,
    E extends StoreEnhancer<S>[]
>(
    store: EnhancedStore<S, A, E>
) => {
    if (ROParams.service('location')) {
        LocationService(store);
    }
    if (ROParams.service('mining')) {
        MiningService(store);
    }
    if (ROParams.service('minting')) {
        MintingService(store);
    }
    if (ROParams.service('nfts') && ROParams.gt(Version.v01a)) {
        NftsService(store);
    }
    if (ROParams.service('nfts-ui') && ROParams.gt(Version.v01a)) {
        NftsUiService(store);
    }
    if (ROParams.service('ppts') && ROParams.gt(Version.v03b)) {
        PptsService(store);
    }
    if (ROParams.service('ppts-ui') && ROParams.gt(Version.v03b)) {
        PptsUiService(store);
    }
    if (ROParams.service('rates') && ROParams.gt(Version.v03b)) {
        RatesService(store);
    }
    if (ROParams.service('tooltip')) {
        TooltipService(store);
    }
    if (ROParams.service('wallet')) {
        WalletService(store);
    }
    if (ROParams.service('history')) {
        HistoryService(store);
    }
    return store;
};
