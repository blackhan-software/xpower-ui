import lodash from 'lodash';
import { Global } from '../source/types';
declare const global: Global;
/**
 * fake jQuery.extend(true, ...) with lodash.merge:
 */
global.$ = {
    extend: function (
        flag: true, ...objects: Record<string, unknown>[]
    ) {
        if (flag !== true) {
            throw new Error('flag !== true');
        }
        return lodash.merge({}, ...objects);
    }
};
