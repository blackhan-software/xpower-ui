import { AnyAction, EnhancedStore, Middleware } from '@reduxjs/toolkit';
import { Params } from '../params';
import { AppState } from '../redux/store';

import { LocationService } from './location-service';
import { MiningService } from './mining-service';
import { MintingService } from './minting-service';
import { NftsService } from './nfts-service';
import { NftsUiService } from './nfts-ui-service';
import { PptsService } from './ppts-service';
import { PptsUiService } from './ppts-ui-service';
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
    if (Params.service('location')) {
        LocationService(store);
    }
    if (Params.service('mining')) {
        MiningService(store);
    }
    if (Params.service('minting')) {
        MintingService(store);
    }
    if (Params.service('nfts')) {
        NftsService(store);
    }
    if (Params.service('nfts-ui')) {
        NftsUiService(store);
    }
    if (Params.service('ppts')) {
        PptsService(store);
    }
    if (Params.service('ppts-ui')) {
        PptsUiService(store);
    }
    if (Params.service('theme')) {
        ThemeService(store);
    }
    if (Params.service('tooltip')) {
        TooltipService(store);
    }
    if (Params.service('wallet')) {
        WalletService(store);
    }
    return store;
};
