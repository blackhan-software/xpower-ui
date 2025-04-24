import { Global } from '../../types';
declare const global: Global;

import { XpbPool } from './xpb-pool';
import { Address } from '../../redux/types';

export function XpbPoolFactory(
    { address }: { address: Address }
): XpbPool {
    return global.XPB = new XpbPool(address);
}
export default XpbPoolFactory;
