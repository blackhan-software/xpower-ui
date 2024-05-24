/* eslint @typescript-eslint/no-explicit-any: [off] */
import { Tokenizer } from '../../../source/token';
import { capitalize } from '../capitalize';
import { Request } from 'express';

export const env_of_token = (req: Request): Record<string, string> => {
  const params = new URLSearchParams(req.query as any);
  const token = Tokenizer.token(params.get('token'));
  const xtoken = Tokenizer.xify(token);
  const atoken = Tokenizer.aify(token);
  const token_lc = Tokenizer.lower(token);
  const xtoken_lc = Tokenizer.lower(xtoken);
  const atoken_lc = Tokenizer.lower(atoken);
  const power = token_lc.startsWith('a') ? 'APOWER' : 'XPOWER';
  const power_lc = power.toLowerCase();
  return {
    POWER: power,
    power: power_lc,
    TOKEN: token,
    token: token_lc,
    Token: capitalize(token_lc, 2),
    xTOKEN: xtoken,
    xtoken: xtoken_lc,
    xToken: capitalize(xtoken_lc, 2),
    aTOKEN: atoken,
    atoken: atoken_lc,
    aToken: 'A' + capitalize(atoken_lc.slice(1)),
  };
};
export default env_of_token;
