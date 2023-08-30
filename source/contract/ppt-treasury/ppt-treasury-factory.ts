import { Global } from '../../../source/types';
declare const global: Global;

import { ROParams } from '../../params';
import { address } from '../address';
import { PptTreasury } from './ppt-treasury';

export function PptTreasuryFactory(
    { version } = { version: ROParams.version }
): PptTreasury {
    const pty_address = address({
        infix: 'PTY', version
    });
    return global.PTY = new PptTreasury(pty_address, version);
}
export default PptTreasuryFactory;
