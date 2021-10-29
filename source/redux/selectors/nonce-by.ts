/* eslint @typescript-eslint/no-unused-vars: [off] */
import { Address, Amount, Nonce, Nonces } from '../types';

export function nonceBy(
    nonces: Nonces, item: { address: Address, amount: Amount }, index = 0
): Nonce | undefined {
    const filtered = Object.entries(nonces.items).filter(([n, i]) => {
        const by_address = i.address === item.address;
        const by_amount = i.amount === item.amount;
        return by_address && by_amount;
    });
    const keys = filtered.map(([n, i]) => n);
    return keys[index];
}
export default nonceBy;
