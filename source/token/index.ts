import { Amount, Level, Token } from '../redux/types';

enum TokenLower {
    XPOW = 'xpow',
}
enum TokenLower {
    APOW = 'apow',
}
export class Tokenizer {
    public static token(value: string | bigint | number | null): Token {
        if (typeof value === 'string') {
            const suffix = value.match(/^xpow[._]/i)
                ? value.replace('.', '_').split('_')[1] : value;
            switch (suffix.toLowerCase()) {
                case 'xpow':
                    return Token.XPOW;
                case 'apow':
                    return Token.APOW;
            }
        }
        if (typeof value === 'number' || typeof value === 'bigint') {
            switch (Number(value)) {
                case 2: return Token.XPOW;
            }
        }
        return Token.XPOW;
    }
    public static lower(token: Token): TokenLower {
        switch (token) {
            case Token.XPOW:
                return TokenLower.XPOW;
            case Token.APOW:
                return TokenLower.APOW;
        }
    }
    public static amount(token: Token, level: Level): Amount {
        switch (this.xify(token)) {
            case Token.XPOW:
                return 2n ** BigInt(level) - 1n;
            default:
                throw new Error('not applicable');
        }
    }
    public static level(token: Token, amount: Amount): Level {
        switch (this.xify(token)) {
            case Token.XPOW:
                return (amount + 1n).toString(2).length - 1;
            default:
                throw new Error('not applicable');
        }
    }
    public static xify(token: Token) {
        switch (token) {
            case Token.XPOW:
            case Token.APOW:
                return Token.XPOW;
        }
    }
    public static xified(token: Token) {
        switch (token) {
            case Token.XPOW:
                return true;
        }
        return false;
    }
    public static aify(token: Token) {
        switch (token) {
            case Token.XPOW:
            case Token.APOW:
                return Token.APOW;
        }
    }
    public static aified(token: Token) {
        switch (token) {
            case Token.APOW:
                return true;
        }
        return false;
    }
    public static slug(token: Token) {
        switch (token) {
            case Token.XPOW:
                return 'MOE';
            case Token.APOW:
                return 'SOV';
        }
    }
    public static similar(lhs: Token, rhs: Token) {
        return this.xify(lhs) === this.xify(rhs);
    }
}
export default Tokenizer;
