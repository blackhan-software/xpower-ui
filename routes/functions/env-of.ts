/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Tokenizer } from "../../source/token";
import { theme } from '../../source/theme';
import { Request } from 'express';

export const env_of = (req: Request): Record<string, string> => {
    const params = new URLSearchParams(req.query as any);
    const token = Tokenizer.token(params.get('token'));
    const symbol = Tokenizer.symbol(token);
    const suffix = Tokenizer.suffix(token);
    return {
        TOKEN_SUFFIX: suffix.toUpperCase(),
        TOKEN: symbol.toUpperCase(),
        token_suffix: suffix.toLowerCase(),
        token: symbol.toLowerCase(),
        ...theme(token)
      };
  }
export default env_of;
