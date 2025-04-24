import { Global } from '../../../source/types';
declare const global: Global;

import { ROParams } from '../../params';
import { address } from '../address';
import { MoeTreasury } from './moe-treasury';

export function MoeTreasuryFactory(
    { version } = { version: ROParams.version }
): MoeTreasury {
    const mty_address = address({
        prefix: 'XPOW', infix: 'MTY', version
    });
    return global.MTY = new MoeTreasury(mty_address, version);
}
export default MoeTreasuryFactory;
