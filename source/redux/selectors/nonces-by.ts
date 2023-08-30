import { AppState } from '../store';
import { Account, Amount, BlockHash, Nonce } from '../types';

export function noncesBy(
    { nonces }: Pick<AppState, 'nonces'>, item?: {
        account?: Account,
        amount?: Amount,
        block_hash?: BlockHash,
    }
): Array<{
    nonce: Nonce, item: {
        account: Account,
        amount: Amount,
        block_hash: BlockHash
    }
}> {
    const filtered = Object.entries(nonces.items).filter(([_, i]) => {
        if (item !== undefined) {
            if (item.account !== undefined &&
                item.account !== i.account
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
        }
        return true;
    });
    const mapped = filtered.map(([n, i]) => ({
        nonce: n, item: i
    }));
    return mapped;
}
export default noncesBy;
