/* eslint @typescript-eslint/no-unused-vars: [off] */
import { Address, Amount, Nonces } from '../types';

export function total(
    nonces: Nonces, item: { address: Address }
): Amount {
    const filtered = Object.entries(nonces.items).filter(([n, i]) => {
        const by_address = i.address === item.address;
        return by_address;
    });
    const amounts = filtered.map(([n, i]) => i.amount);
    return amounts.reduce((a1, a2) => a1 + a2, 0);
}
export default total;
