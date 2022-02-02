/* eslint @typescript-eslint/no-unused-vars: [off] */
import { Address, Amount, BlockHash, Nonce, Nonces } from '../types';

export function noncesBy(
    nonces: Nonces, item?: {
        address?: Address, block_hash?: BlockHash, amount?: Amount
    }
): Nonce[] {
    const filtered = Object.entries(nonces.items).filter(([n, i]) => {
        if (item !== undefined) {
            if (item.address !== undefined &&
                item.address !== i.address
            ) {
                return false;
            }
            if (item.block_hash !== undefined &&
                item.block_hash !== i.block_hash
            ) {
                return false;
            }
            if (item.amount !== undefined &&
                item.amount !== i.amount
            ) {
                return false;
            }
        }
        return true;
    });
    const keys = filtered.map(([n, i]) => Number(n));
    return keys;
}
export default noncesBy;
