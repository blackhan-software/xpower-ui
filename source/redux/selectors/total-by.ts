/* eslint @typescript-eslint/no-unused-vars: [off] */
import { AppState } from '../store';
import { Address, Amount, BlockHash, Token } from '../types';

export function totalBy(
    { nonces }: Pick<AppState, 'nonces'>, item: Partial<{
        address: Address;
        amount: Amount;
        block_hash: BlockHash;
        token: Token;
    }>
): Amount {
    const filtered = Object.entries(nonces.items).filter(([n, i]) => {
        const by_address =
            item.address !== undefined &&
            item.address === i.address;
        if (!by_address) {
            return false;
        }
        const by_block_hash =
            item.block_hash !== undefined &&
            item.block_hash === i.block_hash;
        if (!by_block_hash) {
            return false;
        }
        const by_amount =
            item.amount !== undefined &&
            item.amount === i.amount;
        if (!by_amount) {
            return false;
        }
        const by_token =
            item.token !== undefined &&
            item.token === i.token;
        if (!by_token) {
            return false;
        }
        return true;
    });
    const amounts = filtered.map(([n, i]) => i.amount);
    return amounts.reduce((a1, a2) => a1 + a2, 0n);
}
export default totalBy;
