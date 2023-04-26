import { InterfaceAbi } from 'ethers';
import { Address } from '../../redux/types';
import { Base } from '../base';

import ABI from './xpower-sov.abi.json';

export class XPowerSov extends Base {
    public constructor(
        address: Address, abi: InterfaceAbi = ABI
    ) {
        super(address, abi);
    }
}
export default XPowerSov;
