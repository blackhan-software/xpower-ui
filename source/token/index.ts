export enum TokenSymbolAlt {
    ASIC = 'XPOW_ASIC',
    GPU = 'XPOW_GPU',
    CPU = 'XPOW_CPU',
    OLD = 'XPOW_OLD'
}
export enum TokenSymbol {
    ASIC = 'XPOW.ASIC',
    GPU = 'XPOW.GPU',
    CPU = 'XPOW.CPU',
    OLD = 'XPOW.OLD'
}
export enum TokenSuffix {
    ASIC = 'asic',
    GPU = 'gpu',
    CPU = 'cpu',
    OLD = 'old'
}
export class Token {
    public static symbolAlt(token: string | null): TokenSymbolAlt {
        if (typeof token === 'string') {
            const suffix = token.match(/^xpow[._]/i)
                ? token.replace('.', '_').split('_')[1] : token;
            switch (suffix.toLowerCase()) {
                case 'asic':
                    return TokenSymbolAlt.ASIC;
                case 'gpu':
                    return TokenSymbolAlt.GPU;
                case 'cpu':
                    return TokenSymbolAlt.CPU;
                default:
                    return TokenSymbolAlt.CPU;
            }
        }
        return TokenSymbolAlt.CPU;
    }
    public static symbol(token: string | null): TokenSymbol {
        if (typeof token === 'string') {
            const suffix = token.match(/^xpow[._]/i)
                ? token.replace('.', '_').split('_')[1] : token;
            switch (suffix.toLowerCase()) {
                case 'asic':
                    return TokenSymbol.ASIC;
                case 'gpu':
                    return TokenSymbol.GPU;
                case 'cpu':
                    return TokenSymbol.CPU;
                default:
                    return TokenSymbol.CPU;
            }
        }
        return TokenSymbol.CPU;
    }
    public static suffix(token: string | null): TokenSuffix {
        if (typeof token === 'string') {
            const suffix = token.match(/^xpow[._]/i)
                ? token.replace('.', '_').split('_')[1] : token;
            switch (suffix.toLowerCase()) {
                case 'asic':
                    return TokenSuffix.ASIC;
                case 'gpu':
                    return TokenSuffix.GPU;
                case 'cpu':
                    return TokenSuffix.CPU;
                default:
                    return TokenSuffix.CPU;
            }
        }
        return TokenSuffix.CPU;
    }
    public static amount(token: string | null, index: number): number {
        switch (this.symbolAlt(token)) {
            case TokenSymbolAlt.ASIC:
                return 16 ** index - 1;
            case TokenSymbolAlt.GPU:
                return 2 ** index - 1;
            case TokenSymbolAlt.CPU:
                return index;
            case TokenSymbolAlt.OLD:
                return 2 ** index - 1;
        }
    }
}
export default Token;
