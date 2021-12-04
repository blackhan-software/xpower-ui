import { Request } from 'express';

export function host(req: Request): string {
    const proxy = req.headers['x-forwarded-host'];
    const authority = proxy ? proxy : req.headers.host;
    return `${req.protocol}://${authority}`;
}
export default host;
