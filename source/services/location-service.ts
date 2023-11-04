import { Store } from '@reduxjs/toolkit';
import { Blockchain } from '../blockchain';
import { delayed } from '../functions';
import { MiningManager as MM } from '../managers';
import { RWParams } from '../params';
import { onNftsUiFlags, onPageSwitch, onTokenSwitch } from '../redux/observers';
import { AppState } from '../redux/store';
import { NftLevel, Page } from '../redux/types';

export const LocationService = (
    store: Store<AppState>
) => {
    Blockchain.onceConnect(delayed(async function reloadLocation() {
        const provider = await Blockchain.provider;
        provider?.on('chainChanged', () => location.reload());
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
            [Page.Swap]: 'XPower: Swap',
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
            [Page.Swap]: 'Swap XPOW & APOW Tokens on Avalanche',
            [Page.About]: 'Mine & Mint Proof-of-Work Tokens on Avalanche',
        };
        if ($meta) {
            $meta.setAttribute('content', descriptions[page]);
        }
    });
    onTokenSwitch(store, function syncLocationToken(token) {
        RWParams.token = token;
    });
    onTokenSwitch(store, async function syncLocationSpeed() {
        const account = await Blockchain.account;
        if (!account) {
            throw new Error('missing account')
        }
        const miner = MM(store).miner({
            account
        });
        RWParams.speed = miner.speed;
    });
    Blockchain.onceConnect(function syncLocationSpeed({
        account
    }) {
        const miner = MM(store).miner({
            account
        });
        miner.on('increased', (e) => {
            RWParams.speed = e.speed;
        });
        miner.on('decreased', (e) => {
            RWParams.speed = e.speed;
        });
    });
    onNftsUiFlags(store, function syncLocationNftLevels(flags) {
        RWParams.nftLevels = Object.entries(flags)
            .filter(([_, { toggled }]) => toggled)
            .map(([level]) => Number(level) as NftLevel);
    });
};
export default LocationService;
