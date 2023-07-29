import { ROParams } from '../../params';
import { Address } from '../../redux/types';
import { VersionAt } from '../../types';
import { Base } from '../base';

import ABI from './xpower-ppt.abi.json';

export class XPowerPpt extends Base {
    public constructor(
        address: Address, abi = ABI
    ) {
        if (ROParams.version < VersionAt(-1) && !ROParams.versionFaked) {
            abi = require(`./xpower-ppt.abi.${ROParams.version}.json`);
        }
        super(address, abi);
    }
}
export default XPowerPpt;
