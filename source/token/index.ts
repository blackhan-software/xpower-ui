import { Token } from "../redux/types";

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
export class Tokenizer {
    public static symbolAlt(value: string | null): TokenSymbolAlt {
        if (typeof value === 'string') {
            const suffix = value.match(/^xpow[._]/i)
                ? value.replace('.', '_').split('_')[1] : value;
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
    public static symbol(value: string | null): TokenSymbol {
        if (typeof value === 'string') {
            const suffix = value.match(/^xpow[._]/i)
                ? value.replace('.', '_').split('_')[1] : value;
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
    public static suffix(value: string | null): TokenSuffix {
        if (typeof value === 'string') {
            const suffix = value.match(/^xpow[._]/i)
                ? value.replace('.', '_').split('_')[1] : value;
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
    public static token(value: string | null): Token {
        if (typeof value === 'string') {
            const suffix = value.match(/^xpow[._]/i)
                ? value.replace('.', '_').split('_')[1] : value;
            switch (suffix.toLowerCase()) {
                case 'asic':
                    return Token.ASIC;
                case 'gpu':
                    return Token.GPU;
                case 'cpu':
                    return Token.CPU;
                default:
                    return Token.CPU;
            }
        }
        return Token.CPU;
    }
    public static amount(token: string | null, index: number) {
        switch (this.symbolAlt(token)) {
            case TokenSymbolAlt.ASIC:
                return 16n ** BigInt(index) - 1n;
            case TokenSymbolAlt.GPU:
                return 2n ** BigInt(index) - 1n;
            case TokenSymbolAlt.CPU:
                return BigInt(index);
            case TokenSymbolAlt.OLD:
                return 2n ** BigInt(index) - 1n;
        }
    }
}
export default Tokenizer;
