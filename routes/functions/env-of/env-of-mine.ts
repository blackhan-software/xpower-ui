/* eslint @typescript-eslint/no-explicit-any: [off] */
import { nice_si, range } from '../../../source/functions';
import { Parser } from '../../../source/parser';
import { Tokenizer } from '../../../source/token';
import { Request } from 'express';

export const env_of_home = (req: Request): Record<string, any> => {
    const params = new URLSearchParams(req.query as any);
    return {
        ...level_amounts(params),
        ...level_range(params),
        ...mining_speed(params),
    }
};
const level_amounts = (
    _params: URLSearchParams
) => {
    return Object.fromEntries(Array.from(range(1, 65)).map((level) => [
        `AMOUNT_${level}`, nice_si(Tokenizer.amount(level))
    ]));
};
const level_range = (
    params: URLSearchParams
) => {
    const lhs = Parser.number(params.get('min-level'), 6);
    const rhs = Parser.number(params.get('mint-level'), lhs);
    return {
        LHS_LEVEL: (0 + lhs).toString(),
        LHX_LEVEL: (1 + lhs).toString(),
        RHS_LEVEL: (0 + rhs).toString(),
        RHX_LEVEL: (1 + rhs).toString(),
    };
};
const mining_speed = (
    params: URLSearchParams
) => {
    const { UI_MINING_SPEED } = process.env;
    const fallback = Parser.number(UI_MINING_SPEED, 50);
    const speed = Parser.number(params.get('speed'), fallback);
    return { UI_MINING_SPEED: speed };
};
export default env_of_home;
