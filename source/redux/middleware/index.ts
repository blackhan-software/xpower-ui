import { applyMiddleware } from '@reduxjs/toolkit';
import { Logger } from './logger';

export function middleware(configuration: {
    /** flag for console logging */
    logger: boolean
}) {
    const enhancers = [];
    if (configuration.logger) {
        enhancers.push(applyMiddleware(Logger));
    }
    return enhancers;
}
export default middleware;
