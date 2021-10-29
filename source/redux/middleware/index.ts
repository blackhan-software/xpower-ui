import { applyMiddleware, StoreEnhancer } from 'redux';
import { logger } from './logger';

export function middleware(configuration: {
    /** flag for console logging */
    logger: boolean
}): StoreEnhancer {
    return configuration.logger
        ? applyMiddleware(logger)
        : applyMiddleware();
}
export default middleware;
