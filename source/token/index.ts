import { Amount, Level, Token } from '../redux/types';

enum TokenLower {
    THOR = 'thor',
    LOKI = 'loki',
    ODIN = 'odin',
    HELA = 'hela',
}
enum TokenLower {
    aTHOR = 'athor',
    aLOKI = 'aloki',
    aODIN = 'aodin',
    aHELA = 'ahela',
}
export class Tokenizer {
    public static token(value: string | null): Token {
        if (typeof value === 'string') {
            const suffix = value.match(/^xpow[._]/i)
                ? value.replace('.', '_').split('_')[1] : value;
            switch (suffix.toLowerCase()) {
                case 'thor':
                    return Token.THOR;
                case 'loki':
                    return Token.LOKI;
                case 'odin':
                    return Token.ODIN;
                case 'hela':
                    return Token.HELA;
                case 'athor':
                    return Token.aTHOR;
                case 'aloki':
                    return Token.aLOKI;
                case 'aodin':
                    return Token.aODIN;
                case 'ahela':
                    return Token.aHELA;
            }
        }
        return Token.THOR;
    }
    public static lower(token: Token): TokenLower {
        switch (token) {
            case Token.THOR:
                return TokenLower.THOR;
            case Token.LOKI:
                return TokenLower.LOKI;
            case Token.ODIN:
                return TokenLower.ODIN;
            case Token.HELA:
                return TokenLower.HELA;
            case Token.aTHOR:
                return TokenLower.aTHOR;
            case Token.aLOKI:
                return TokenLower.aLOKI;
            case Token.aODIN:
                return TokenLower.aODIN;
            case Token.aHELA:
                return TokenLower.aHELA;
        }
    }
    public static amount(token: Token, level: Level): Amount {
        switch (this.xify(token)) {
            case Token.THOR:
                return BigInt(level);
            case Token.LOKI:
                return 2n ** BigInt(level) - 1n;
            case Token.ODIN:
                return 16n ** BigInt(level) - 1n;
            case Token.HELA:
                throw new Error('not applicable');
        }
    }
    public static level(token: Token, amount: Amount): Level {
        switch (this.xify(token)) {
            case Token.THOR:
                return Number(amount);
            case Token.LOKI:
                return (amount + 1n).toString(2).length - 1;
            case Token.ODIN:
                return (amount + 1n).toString(16).length - 1;
            case Token.HELA:
                throw new Error('not applicable');
        }
    }
    public static xify(token: Token) {
        switch (token) {
            case Token.THOR:
            case Token.aTHOR:
                return Token.THOR;
            case Token.LOKI:
            case Token.aLOKI:
                return Token.LOKI;
            case Token.ODIN:
            case Token.aODIN:
                return Token.ODIN;
            case Token.HELA:
            case Token.aHELA:
                return Token.HELA;
        }
    }
    public static aify(token: Token) {
        switch (token) {
            case Token.THOR:
            case Token.aTHOR:
                return Token.aTHOR;
            case Token.LOKI:
            case Token.aLOKI:
                return Token.aLOKI;
            case Token.ODIN:
            case Token.aODIN:
                return Token.aODIN;
            case Token.HELA:
            case Token.aHELA:
                return Token.aHELA;
        }
    }
}
export default Tokenizer;
