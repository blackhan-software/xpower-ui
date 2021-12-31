/* eslint @typescript-eslint/no-unused-vars: [off] */
import { Address, Amount, BlockHash, Nonces } from '../types';

export function total(
    nonces: Nonces, item: { address: Address, block_hash: BlockHash }
): Amount {
    const filtered = Object.entries(nonces.items).filter(([n, i]) => {
        const by_address = i.address === item.address;
        if (!by_address) return false;
        const by_block_hash = i.block_hash === item.block_hash;
        if (!by_block_hash) return false;
        return true;
    });
    const amounts = filtered.map(([n, i]) => i.amount);
    return amounts.reduce((a1, a2) => a1 + a2, 0n);
}
export default total;
