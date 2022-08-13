import { App } from '../../source/app';
import { Blockchain } from '../../source/blockchain';
import { delayed } from '../../source/functions';
import { Page } from '../../source/redux/types';

Blockchain.onceConnect(delayed(async function reloadLocation() {
    const p = await Blockchain.provider;
    p.on('chainChanged', () => location.reload());
    p.on('accountsChanged', () => location.reload());
}, 600));
App.onTokenSwitch(function syncLocationSearch(token) {
    const search = location.search
        .replace(/^$/, `?token=${token}`)
        .replace(/token=([A-Z]+)/, `token=${token}`);
    const [data, title, url] = [
        { page: 1 }, document.title, `${location.pathname}${search}`
    ];
    history.pushState(data, title, url);
});
App.onPageSwitch(function syncLocationTitle(page, prev) {
    const pathname = location.pathname
        .replace(new RegExp('/' + prev, 'i'), page);
    const titles: Record<Page, string> = {
        [Page.None]: 'XPower',
        [Page.Home]: 'XPower',
        [Page.Nfts]: 'XPower: NFTs',
        [Page.Staking]: 'XPower: Staking',
        [Page.About]: 'XPower: About',
    };
    const title = document.title = titles[page];
    const url = `${pathname}${location.search}`;
    history.pushState({ page: 1 }, title, url);
});
App.onPageSwitch(function syncLocationDescription(page) {
    const $meta = document.querySelector<HTMLMetaElement>(
        'meta[name="description"]'
    );
    const descriptions: Record<Page, string> = {
        [Page.None]: 'Mine & Mint Proof-of-Work Tokens on Avalanche',
        [Page.Home]: 'Mine & Mint Proof-of-Work Tokens on Avalanche',
        [Page.Nfts]: 'Mint stakeable XPower NFTs on Avalanche',
        [Page.Staking]: 'Stake minted XPower NFTs on Avalanche',
        [Page.About]: 'Mine & Mint Proof-of-Work Tokens on Avalanche',
    };
    if ($meta) {
        $meta.setAttribute('content', descriptions[page]);
    }
});
