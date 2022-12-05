import { Version } from '../../source/types';
import { ROParams } from '../params';
import { Token } from '../redux/types';
import { Tokenizer } from '../token';

export function address({
    infix, token, version
}: {
    infix: string, token: Token, version?: Version
}): string {
    if (version === undefined) {
        version = ROParams.version;
    }
    if (token.startsWith('a')) {
        token = Tokenizer.xify(token);
    }
    const id = `g-${token}_${infix}_${version}`;
    const $element = document.getElementById(id);
    const address = $element?.dataset.value;
    if (!address) {
        throw new Error(`missing ${id}`);
    }
    return address;
}
export default address;
