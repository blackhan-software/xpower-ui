import mitt from 'mitt';

import { Parser } from '../parser';
import { NftIssue, NftLevel, Page, Pager, Token } from '../redux/types';
import { Tokenizer } from '../token';
import { Version } from '../types';

export class App {
    public static get clear(): boolean {
        return Parser.boolean(this.params.get('clear'), false);
    }
    public static get clearAll(): boolean {
        return Parser.boolean(this.params.get('clear-all'), false);
    }
    public static get debug(): boolean {
        return Parser.boolean(this.params.get('debug'), false);
    }
    public static get level(): { min: number, max: number } {
        const min = Parser.number(
            this.params.get('min-level'), 5
        );
        const max = Parser.number(
            this.params.get('max-level'), 64
        );
        return { min, max };
    }
    public static get nftLevel(): { min: number, max: number } {
        const min = Parser.number(
            this.params.get('min-nft-level'), NftLevel.UNIT
        );
        const max = Parser.number(
            this.params.get('max-nft-level'), NftLevel.PETA
        );
        return { min, max };
    }
    public static get logger(): boolean {
        return Parser.boolean(this.params.get('logger'), false);
    }
    public static get autoMint(): number {
        return Parser.number(this.params.get('auto-mint'), 3000);
    }
    public static get persist(): number {
        const element = typeof document !== 'undefined'
            ? document.getElementById('g-persistence') : undefined;
        const fallback = Parser.number(element?.dataset.value, 0);
        return Parser.number(this.params.get('persist'), fallback);
    }
    public static get speed(): number {
        const element = typeof document !== 'undefined'
            ? document.getElementById('g-mining-speed') : undefined;
        const fallback = Parser.number(element?.dataset.value, 50);
        const value = Parser.number(this.params.get('speed'), fallback);
        return Math.min(100, Math.max(0, value)) / 100;
    }
    public static get token(): Token {
        return Tokenizer.token(this.params.get('token'));
    }
    public static get page(): Page {
        if (typeof location !== 'undefined') {
            return Pager.parse(location.pathname);
        }
        return Page.None;
    }
    public static get version(): Version {
        switch (this.params.get('version')) {
            case 'v2a':
                return 'v2a';
            case 'v3a':
                return 'v3a';
            case 'v3b':
                return 'v3b';
            case 'v4a':
                return 'v4a';
            default:
                return 'v4a';
        }
    }
    public static get params(): URLSearchParams {
        if (typeof location !== 'undefined') {
            return new URLSearchParams(location.search.substring(1));
        }
        return new URLSearchParams();
    }
    public static get event() {
        return this._event;
    }
    private static _event = mitt<{
        'refresh-tips': undefined | {
            keep?: boolean;
        };
        'toggle-level': {
            level?: NftLevel; flag: boolean;
        };
        'toggle-issue': {
            level?: NftLevel; issue?: NftIssue; flag: boolean;
        };
    }>();
}
export default App;
