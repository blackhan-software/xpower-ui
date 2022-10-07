import { AppState } from '../store';
import { OtfWallet } from '../types';

export function otfWalletOf(
    { otf_wallet }: Pick<AppState, 'otf_wallet'>
): OtfWallet {
    return otf_wallet;
}
export default otfWalletOf;
