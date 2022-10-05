import { Version } from '../../source/types';
import { Params } from '../params';
import { Token } from '../redux/types';

export function address({
    infix, token, version
}: {
    infix: string, token: Token, version?: Version
}): string {
    if (version === undefined) {
        version = Params.version;
    }
    const id = `#g-${token}_${infix}_${version}`;
    const address = $(id).data('value');
    if (!address) {
        throw new Error(`missing ${id}`);
    }
    return address;
}
export default address;
