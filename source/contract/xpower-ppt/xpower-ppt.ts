import { Base } from '../base';
import ABI from './xpower-ppt.abi.json';

export class XPowerPpt extends Base {
    public constructor(
        address: string, abi = ABI
    ) {
        super(address, abi);
    }
}
export default XPowerPpt;
