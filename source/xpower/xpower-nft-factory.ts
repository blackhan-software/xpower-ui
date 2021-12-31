/* eslint @typescript-eslint/no-explicit-any: [off] */
import { App } from '../app';
import { BigNumber, Contract } from 'ethers';
import { Tokenizer } from '../token';
import { TokenSuffix } from '../token';
import { TokenSymbolAlt } from '../token';
import { NftLevel } from '../../source/redux/types';
import { MAX_YEAR } from '../../source/years';
import { XPowerNft } from '.';

export function XPowerNftFactory({ version, token }: {
    version?: 'v1' | 'v2'; token?: TokenSymbolAlt;
} = {}): Contract {
    if (version === undefined) {
        version = App.params.get('nft') === 'v1' ? 'v1' : 'v2';
    }
    if (token === undefined) {
        token = Tokenizer.symbolAlt(App.params.get('token'));
    }
    const element_id = `#g-xpower-nft-address-${version}-${token}`;
    const address = $(element_id).data('value');
    if (!address) {
        throw new Error(`missing ${element_id}`);
    }
    const contract = new XPowerNft(address);
    return contract.connect(); // instance
}
export function XPowerNftMockFactory({ suffix }: {
    suffix?: TokenSuffix
} = {}): Contract {
    if (suffix === undefined) {
        suffix = Tokenizer.suffix(App.params.get('token'));
    }
    const mock = {
        year: () => {
            return BigNumber.from(MAX_YEAR());
        },
        idBy: (year: BigNumber, level: NftLevel) => {
            if (!BigNumber.isBigNumber(year)) {
                year = BigNumber.from(year);
            }
            return year.mul(100).add(level);
        },
        uri: (id: BigNumber) => {
            if (!BigNumber.isBigNumber(id)) {
                id = BigNumber.from(id);
            }
            return `/nfts/${suffix}/${id.toNumber()}.json`;
        }

    };
    return mock as any;
}
export default XPowerNftFactory;
