import ABI from './xpower-ppt.abi.json';
import { Base } from '../base';

export class XPowerPpt extends Base {
    public constructor(
        address: string, abi = ABI
    ) {
        super(address, abi);
    }
}
export default XPowerPpt;
