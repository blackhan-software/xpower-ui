/* eslint @typescript-eslint/no-explicit-any: [off] */
import { color, colorAlt } from '../../../source/params/parsers';
import { theme } from '../../../source/theme';
import { Request } from 'express';

export const env_of_theme = (req: Request): Record<string, string> => {
  const params = new URLSearchParams(req.query as any);
  return {
    ...theme(color(params), colorAlt(params)),
  };
};
export default env_of_theme;
