import { Amount, Token } from '../redux/types';

enum TokenSuffix {
    ASIC = 'asic',
    GPU = 'gpu',
    CPU = 'cpu',
}
enum TokenSymbol {
    ASIC = 'XPOW.ASIC',
    GPU = 'XPOW.GPU',
    CPU = 'XPOW.CPU',
}
enum TokenSymbolAlt {
    ASIC = 'XPOW_ASIC',
    GPU = 'XPOW_GPU',
    CPU = 'XPOW_CPU',
}
export class Tokenizer {
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
    public static suffix(token: Token): TokenSuffix {
        switch (token) {
            case Token.ASIC:
                return TokenSuffix.ASIC;
            case Token.GPU:
                return TokenSuffix.GPU;
            case Token.CPU:
                return TokenSuffix.CPU;
        }
    }
    public static symbol(token: Token): TokenSymbol {
        switch (token) {
            case Token.ASIC:
                return TokenSymbol.ASIC;
            case Token.GPU:
                return TokenSymbol.GPU;
            case Token.CPU:
                return TokenSymbol.CPU;
        }
    }
    public static symbolAlt(token: Token): TokenSymbolAlt {
        switch (token) {
            case Token.ASIC:
                return TokenSymbolAlt.ASIC;
            case Token.GPU:
                return TokenSymbolAlt.GPU;
            case Token.CPU:
                return TokenSymbolAlt.CPU;
        }
    }
    public static amount(token: Token, zeros: number): Amount {
        switch (token) {
            case Token.ASIC:
                return 16n ** BigInt(zeros) - 1n;
            case Token.GPU:
                return 2n ** BigInt(zeros) - 1n;
            case Token.CPU:
                return BigInt(zeros);
        }
    }
}
export default Tokenizer;
