import { App } from '../app';
import { Contract } from 'ethers';
import { Tokenizer } from '../token';
import { TokenSymbolAlt } from '../token';
import { XPower } from '.';

export function XPowerFactory({ token }: {
    token?: TokenSymbolAlt;
} = {}): Contract {
    if (token === undefined) {
        token = Tokenizer.symbolAlt(App.params.get('token'));
    }
    const element_id = `#g-xpower-address-${token}`;
    const address = $(element_id).data('value');
    if (!address) {
        throw new Error(`missing ${element_id}`);
    }
    const contract = new XPower(address);
    return contract.connect(); // instance
}
export default XPowerFactory;
