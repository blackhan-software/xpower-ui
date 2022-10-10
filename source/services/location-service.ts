import { Store } from '@reduxjs/toolkit';
import { Blockchain } from '../blockchain';
import { delayed } from '../functions';
import { MiningManager } from '../managers';
import { onPageSwitch, onTokenSwitch } from '../redux/observers';
import { tokenOf } from '../redux/selectors';
import { AppState } from '../redux/store';
import { Page } from '../redux/types';
import { URLQuery } from '../params';

export const LocationService = (
    store: Store<AppState>
) => {
    Blockchain.onceConnect(delayed(async function reloadLocation() {
        const p = await Blockchain.provider;
        p.on('chainChanged', () => location.reload());
        p.on('accountsChanged', () => location.reload());
    }, 600));
    onTokenSwitch(store, function syncLocationToken(token) {
        URLQuery.token = token;
    });
    onPageSwitch(store, function syncLocationTitle(page, prev) {
        const pathname = location.pathname
            .replace(new RegExp('/' + prev, 'i'), page);
        const titles: Record<Page, string> = {
            [Page.None]: 'XPower',
            [Page.Home]: 'XPower',
            [Page.Nfts]: 'XPower: NFTs',
            [Page.Ppts]: 'XPower: Staking',
            [Page.About]: 'XPower: About',
        };
        const title = document.title = titles[page];
        const url = `${pathname}${location.search}`;
        history.pushState({ page: 1 }, title, url);
    });
    onPageSwitch(store, function syncLocationDescription(page) {
        const $meta = document.querySelector<HTMLMetaElement>(
            'meta[name="description"]'
        );
        const descriptions: Record<Page, string> = {
            [Page.None]: 'Mine & Mint Proof-of-Work Tokens on Avalanche',
            [Page.Home]: 'Mine & Mint Proof-of-Work Tokens on Avalanche',
            [Page.Nfts]: 'Mint stakeable XPower NFTs on Avalanche',
            [Page.Ppts]: 'Stake minted XPower NFTs on Avalanche',
            [Page.About]: 'Mine & Mint Proof-of-Work Tokens on Avalanche',
        };
        if ($meta) {
            $meta.setAttribute('content', descriptions[page]);
        }
    });
    Blockchain.onceConnect(function syncLocationSpeed({
        address, token
    }) {
        const miner = MiningManager.miner(address, {
            token
        });
        miner.on('increased', (e) => {
            URLQuery.speed = e.speed;
        });
        miner.on('decreased', (e) => {
            URLQuery.speed = e.speed;
        });
    }, {
        per: () => tokenOf(store.getState())
    });
    onTokenSwitch(store, async function syncLocationToken(token) {
        const address = await Blockchain.selectedAddress;
        if (!address) {
            throw new Error('missing selected-address')
        }
        const miner = MiningManager.miner(address, {
            token
        });
        URLQuery.speed = miner.speed;
    });
};
export default LocationService;
