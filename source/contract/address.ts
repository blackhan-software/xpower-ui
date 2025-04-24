import { Version } from '../../source/types';
import { ROParams } from '../params';
import { Address } from '../redux/types';

export function address({
    prefix, infix, version
}: {
    prefix: string, infix: string, version?: Version
}): Address {
    if (typeof document === 'undefined') {
        return '0x0000000000000000000000000000000000000000'; // test-env
    }
    if (version === undefined) {
        version = ROParams.version;
    }
    const id = `g-${prefix}_${infix}_${version}`;
    const $el = document.getElementById(id);
    const address = $el?.dataset.value;
    if (!address) {
        throw new Error(`missing ${id}`);
    }
    if (!address.match(/^0x[0-9a-f]+/i)) {
        throw new Error(`invalid ${address}`);
    }
    return address as Address;
}
export default address;
