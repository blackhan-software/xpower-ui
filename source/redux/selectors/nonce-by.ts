/* eslint @typescript-eslint/no-unused-vars: [off] */
import { Address, Amount, BlockHash, Nonce, Nonces } from '../types';

export function nonceBy(
    nonces: Nonces, item: {
        address: Address, block_hash: BlockHash, amount: Amount
    }, index = 0
): Nonce | undefined {
    const filtered = Object.entries(nonces.items).filter(([n, i]) => {
        const by_address = i.address === item.address;
        if (!by_address) return false;
        const by_block_hash = i.block_hash === item.block_hash;
        if (!by_block_hash) return false;
        const by_amount = i.amount === item.amount;
        if (!by_amount) return false;
        return true;
    });
    const keys = filtered.map(([n, i]) => Number(n));
    return keys[index];
}
export default nonceBy;
