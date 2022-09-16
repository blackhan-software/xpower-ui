export enum Page {
    None = 'none',
    Home = 'home',
    Nfts = 'nfts',
    Ppts = 'staking',
    About = 'about',
}
export function Pages(): Set<Page> {
    const ref = Page as typeof Page & {
        _set?: Set<Page>
    };
    if (ref._set === undefined) {
        ref._set = new Set(Object.values(Page));
    }
    return ref._set;
}
export class Pager {
    public static parse(value: string | null): Page {
        if (typeof value === 'string') {
            const path = value.split('/');
            const suffix = path.length
                ? path[path.length - 1] : '';
            switch (suffix.toLowerCase()) {
                case 'none':
                    return Page.None;
                case 'home':
                    return Page.Home;
                case 'nfts':
                    return Page.Nfts;
                case 'staking':
                    return Page.Ppts;
                case 'about':
                    return Page.About;
            }
        }
        return Page.None;
    }
}
export default Page;
