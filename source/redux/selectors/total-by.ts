/* eslint @typescript-eslint/no-unused-vars: [off] */
import { Address, Amount, Nonces } from '../types';

export function totalBy(
    nonces: Nonces,
    item: { address: Address, amount: Amount }
): Amount {
    const filtered = Object.entries(nonces.items).filter(([n, i]) => {
        const by_address = i.address === item.address;
        const by_amount = i.amount === item.amount;
        return by_address && by_amount;
    });
    const amounts = filtered.map(([n, i]) => i.amount);
    return amounts.reduce((a1, a2) => a1 + a2, 0);
}
export default totalBy;
