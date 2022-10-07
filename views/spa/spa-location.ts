import { Blockchain } from '../../source/blockchain';
import { delayed } from '../../source/functions';
import { Store } from '../../source/redux/store';
import { Page } from '../../source/redux/types';
import { URLQuery } from '../../source/url-query';

Blockchain.onceConnect(delayed(async function reloadLocation() {
    const p = await Blockchain.provider;
    p.on('chainChanged', () => location.reload());
    p.on('accountsChanged', () => location.reload());
}, 600));
Store.onTokenSwitch(function syncLocationSearch(token) {
    URLQuery.token = token;
});
Store.onPageSwitch(function syncLocationTitle(page, prev) {
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
Store.onPageSwitch(function syncLocationDescription(page) {
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
