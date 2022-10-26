import { Store } from '@reduxjs/toolkit';
import { Blockchain } from '../blockchain';
import { delayed } from '../functions';
import { MiningManager as MM } from '../managers';
import { RWParams } from '../params';
import { onPageSwitch, onTokenSwitch } from '../redux/observers';
import { xtokenOf } from '../redux/selectors';
import { AppState } from '../redux/store';
import { Page } from '../redux/types';

export const LocationService = (
    store: Store<AppState>
) => {
    Blockchain.onceConnect(delayed(async function reloadLocation() {
        const p = await Blockchain.provider;
        p.on('chainChanged', () => location.reload());
        p.on('accountsChanged', () => location.reload());
    }, 600));
    onPageSwitch(store, function syncLocationPath(page) {
        RWParams.page = page;
    });
    onPageSwitch(store, function syncLocationTitle(page) {
        const titles: Record<Page, string> = {
            [Page.None]: 'XPower',
            [Page.Home]: 'XPower',
            [Page.Nfts]: 'XPower: NFTs',
            [Page.Ppts]: 'XPower: Staking',
            [Page.About]: 'XPower: About',
        };
        const title = document.title = titles[page];
        history.pushState({ page: 1 }, title);
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
    onTokenSwitch(store, function syncLocationToken(token) {
        RWParams.token = token;
    });
    onTokenSwitch(store, async function syncLocationSpeed(token) {
        const address = await Blockchain.selectedAddress;
        if (!address) {
            throw new Error('missing selected-address')
        }
        const miner = MM(store).miner({
            address, token
        });
        RWParams.speed = miner.speed;
    });
    Blockchain.onceConnect(function syncLocationSpeed({
        address, token
    }) {
        const miner = MM(store).miner({
            address, token
        });
        miner.on('increased', (e) => {
            RWParams.speed = e.speed;
        });
        miner.on('decreased', (e) => {
            RWParams.speed = e.speed;
        });
    }, {
        per: () => xtokenOf(store.getState())
    });
};
export default LocationService;
