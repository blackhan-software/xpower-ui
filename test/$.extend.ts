import { Global } from '../source/types';
declare const global: Global;
import lodash from 'lodash';
/**
 * fake jQuery.extend(true, ...) with lodash.merge:
 */
if (global.$ === undefined) {
    global.$ = {
        extend: function(
            flag: true, ...objects: Record<string, unknown>[]
        ) {
            if (flag !== true) {
                throw new Error('flag !== true');
            }
            return lodash.merge({}, ...objects);
        }
    };
}
