import { App } from '../app';
import { Contract } from 'ethers';
import { Tokenizer } from '../token';
import { Token } from '../redux/types';
import { XPower } from '.';

export function XPowerFactory({ token }: {
    token?: Token
} = {}): Contract {
    const symbol = Tokenizer.symbolAlt(token ?? App.token);
    const element_id = `#g-xpower-address-${symbol}`;
    const address = $(element_id).data('value');
    if (!address) {
        throw new Error(`missing ${element_id}`);
    }
    const contract = new XPower(address);
    return contract.connect(); // instance
}
export default XPowerFactory;
