import { Version } from '../../source/types';
import { ROParams } from '../params';
import { Address, Token } from '../redux/types';
import { Tokenizer } from '../token';

export function address({
    infix, token, version
}: {
    infix: string, token: Token | 'XPOW', version?: Version
}): Address {
    if (typeof document === 'undefined') {
        return '0x0000000000000000000000000000000000000000'; // test-env
    }
    if (version === undefined) {
        version = ROParams.version;
    }
    if (token.startsWith('a') && token !== 'XPOW') {
        token = Tokenizer.xify(token);
    }
    const id = `g-${token}_${infix}_${version}`;
    const $element = document.getElementById(id);
    const address = $element?.dataset.value;
    if (!address) {
        throw new Error(`missing ${id}`);
    }
    if (!address.match(/^0x[0-9a-f]+/i)) {
        throw new Error(`invalid ${address}`);
    }
    return address as Address;
}
export default address;
