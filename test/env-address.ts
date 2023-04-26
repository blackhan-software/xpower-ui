import { capitalize } from "../routes/functions";
import { ROParams } from "../source/params";
import { Address, Token } from "../source/redux/types";
import { Tokenizer } from "../source/token";
import { Version } from "../source/types";

export function address({
    infix, token, version
}: {
    infix: string, token: Token | 'XPOW', version?: Version
}) {
    if (version === undefined) {
        version = ROParams.version;
    }
    if (token.startsWith('a') && token !== 'XPOW') {
        token = Tokenizer.xify(token);
    }
    const id = `${token}_${infix}_${capitalize(version)}`;
    const address = process.env[id];
    if (!address) {
        throw new Error(`missing ${id}`);
    }
    if (!address.match(/^0x[0-9a-f]+/i)) {
        throw new Error(`invalid ${address}`);
    }
    return address as Address;
}
export default address;
