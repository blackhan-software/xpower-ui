/* eslint @typescript-eslint/no-explicit-any: [off] */
import { nice_si, range } from '../../source/functions';
import { Parser } from '../../source/parser';
import { Tokenizer } from '../../source/token';
import { Request } from 'express';
import { env_of } from './env-of';

export const env_of_home = (req: Request): Record<string, any> => ({
    ...env_of(req), ...level_amounts(req), ...mining_speed(req)
});
const level_amounts = (req: Request) => {
    const params = new URLSearchParams(req.query as any);
    const token = Tokenizer.token(params.get('token'));
    return Object.fromEntries(Array.from(range(1, 65)).map((level) => {
        return [`AMOUNT_${level}`, nice_si(Tokenizer.amount(token, level))];
    }));
};
const mining_speed = (req: Request) => {
    const { UI_MINING_SPEED } = process.env;
    const fallback = Parser.number(UI_MINING_SPEED, 50);
    const params = new URLSearchParams(req.query as any);
    const speed = Parser.number(params.get('speed'), fallback);
    return { UI_MINING_SPEED: speed };
};
export default env_of_home;
