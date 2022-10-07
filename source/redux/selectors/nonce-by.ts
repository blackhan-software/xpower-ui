/* eslint @typescript-eslint/no-unused-vars: [off] */
import { AppState } from '../store';
import { Address, Amount, BlockHash, Nonce, Token } from '../types';

export function nonceBy(
    { nonces }: Pick<AppState, 'nonces'>, item?: {
        address?: Address,
        amount?: Amount,
        block_hash?: BlockHash
        token?: Token,
    }, index = 0
): Partial<{
    nonce: Nonce, item: {
        address: Address,
        amount: Amount,
        block_hash: BlockHash
        token: Token,
    }
}> {
    const filtered = Object.entries(nonces.items).filter(([n, i]) => {
        if (item !== undefined) {
            if (item.address !== undefined &&
                item.address !== i.address
            ) {
                return false;
            }
            if (item.amount !== undefined &&
                item.amount !== i.amount
            ) {
                return false;
            }
            if (item.block_hash !== undefined &&
                item.block_hash !== i.block_hash
            ) {
                return false;
            }
            if (item.token !== undefined &&
                item.token !== i.token
            ) {
                return false;
            }
        }
        return true;
    });
    const mapped = filtered.map(([n, i]) => ({
        nonce: Number(n), item: i
    }));
    return mapped[index] ?? {};
}
export default nonceBy;
