export enum Page {
    None = 'none',
    Mine = 'mine',
    Nfts = 'nfts',
    Ppts = 'stake',
    Swap = 'swap',
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
                case 'mine':
                    return Page.Mine;
                case 'nfts':
                    return Page.Nfts;
                case 'stake':
                    return Page.Ppts;
                case 'swap':
                    return Page.Swap;
                case 'about':
                    return Page.About;
            }
        }
        return Page.None;
    }
}
export default Page;
