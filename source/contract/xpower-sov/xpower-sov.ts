/* eslint @typescript-eslint/no-require-imports: [off] */
import { InterfaceAbi } from 'ethers';
import { MYProvider } from '../../blockchain';
import { ROParams } from '../../params';
import { Address, Metric } from '../../redux/types';
import { Version, VersionAt } from '../../types';
import { Base } from '../base';

import ABI from './xpower-sov.abi.json';

export class XPowerSov extends Base {
    public constructor(
        address: Address, abi: InterfaceAbi = ABI
    ) {
        if (ROParams.lt(VersionAt(-1))) {
            abi = require(`./xpower-sov.abi.${ROParams.version}.json`);
        }
        super(address, abi);
    }
    public async metric(): Promise<Metric> {
        const contract = await this.get;
        if (ROParams.lt(Version.v07b)) {
            return 10n ** 18n; // 100%
        }
        if (ROParams.lt(Version.v08b)) {
            return contract.collateralization().then(
                (c) => c * 10n ** 12n
            );
        }
        return contract.metric();
    }
    private get get() {
        return MYProvider().then((p) => this.connect(p));
    }
}
export default XPowerSov;
