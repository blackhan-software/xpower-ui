import { ROParams } from '../../params';
import { Version } from '../../types';
import { Amount, Supply, Year } from './base';

export class Nft {
    static nameOf(level: NftLevel) {
        return NftLevel[level] as NftName;
    }
    static rankOf(level: NftLevel) {
        return level / 3 + 1;
    }
    static issue(id: NftFullId): NftIssue {
        const memo = this._issue[id];
        if (memo) {
            return memo;
        }
        const issue = Number(id.slice(-6, -2));
        if (isNaN(issue)) {
            throw new Error(`unknown issue for "${id}"`);
        }
        return this._issue[id] = issue;
    }
    static level(id: NftFullId): NftLevel {
        const memo = this._level[id];
        if (memo) {
            return memo;
        }
        const level = Number(id.slice(-2));
        switch (level) {
            case NftLevel.UNIT:
                return this._level[id] = NftLevel.UNIT;
            case NftLevel.KILO:
                return this._level[id] = NftLevel.KILO;
            case NftLevel.MEGA:
                return this._level[id] = NftLevel.MEGA;
            case NftLevel.GIGA:
                return this._level[id] = NftLevel.GIGA;
            case NftLevel.TERA:
                return this._level[id] = NftLevel.TERA;
            case NftLevel.PETA:
                return this._level[id] = NftLevel.PETA;
            case NftLevel.EXA:
                return this._level[id] = NftLevel.EXA;
            case NftLevel.ZETTA:
                return this._level[id] = NftLevel.ZETTA;
            case NftLevel.YOTTA:
                return this._level[id] = NftLevel.YOTTA;
        }
        throw new Error(`unknown level for "${id}"`);
    }
    static fullIds({ issues, levels }: {
        issues: NftIssue[], levels: NftLevel[]
    }): NftFullId[] {
        const full_ids = [] as NftFullId[];
        for (const issue of issues) {
            for (const level of levels) {
                full_ids.push(Nft.fullId({ issue, level }));
            }
        }
        return full_ids;
    }
    static fullId({ issue, level }: {
        issue: NftIssue, level: NftLevel
    }): NftFullId {
        if (issue < 2021) {
            throw new Error(`NFT issue=${issue} invalid`);
        }
        if (level < 10) {
            return `${NftToken.XPOW}${issue}0${level}` as NftFullId;
        }
        return `${NftToken.XPOW}${issue}${level}`;
    }
    static realIds(
        ids: NftFullId[] | NftRealId[], { version }: { version?: Version } = {
            version: undefined
        }
    ): NftRealId[] {
        return ids.map((id) => this.realId(id, { version }));
    }
    static realId(
        id: NftFullId | NftRealId, { version }: { version?: Version } = {
            version: undefined
        }
    ): NftRealId {
        if (version === undefined) {
            version = ROParams.version;
        }
        return ROParams.lt2(version, Version.v6a)
            || ROParams.gt2(version, Version.v7c)
            ? id.slice(-6) as NftCoreId : id;
    }
    static fullIdsOf(
        { real_ids }: { real_ids: NftRealId[] }
    ): NftFullId[] {
        return real_ids.map((id) => this.fullIdOf({ real_id: id }));
    }
    static fullIdOf(
        { real_id }: { real_id: NftRealId }
    ): NftFullId {
        return real_id.length > 6
            ? real_id as NftFullId
            : `${NftToken.XPOW}${real_id}` as NftFullId;
    }
    private static _issue = {} as Record<NftFullId, NftIssue>;
    private static _level = {} as Record<NftFullId, NftLevel>;
}
enum NftToken {
    XPOW = 2
}
export type NftFullId = `${NftToken}${NftIssue}${NftLevel}`;
export type NftCoreId = `${NftIssue}${NftLevel}`;
export type NftRealId = NftFullId | NftCoreId;
export type NftIssue = Year;
export enum NftLevel {
    UNIT = 0,
    KILO = 3,
    MEGA = 6,
    GIGA = 9,
    TERA = 12,
    PETA = 15,
    EXA = 18,
    ZETTA = 21,
    YOTTA = 24
}
export type NftName = keyof typeof NftLevel;
export function* NftLevels(
    { max, min } = ROParams.nftLevel
) {
    for (const l in NftLevel) {
        const n = Number(l);
        if (isNaN(n)) {
            continue;
        }
        if (n < min) {
            continue;
        }
        if (n > max) {
            continue;
        }
        yield n as NftLevel;
    }
}
export type Nfts = {
    /** nft-id => { amount, supply } */
    items: {
        [id: NftFullId]: {
            amount: Amount,
            supply: Supply
        }
    },
    /** set for more nft(s) */
    more?: NftFullId[],
    /** set for less nft(s) */
    less?: NftFullId[]
}
