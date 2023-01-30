import { Version } from '../../types';
import { AppState } from '../store';
import { Token } from '../types';

export const versionBy = (
    { history }: Pick<AppState, 'history'>, token: Token
): Version[] => {
    const filtered = Object.entries(history.items).filter(([_, entry]) => {
        const item = entry[token];
        if (item?.moe?.balance) {
            return true;
        }
        if (item?.sov?.balance) {
            return true;
        }
        const nfts = Object.values(item?.nft ?? {}).filter(
            (v) => v?.balance
        );
        if (nfts.length) {
            return true;
        }
        const ppts = Object.values(item?.ppt ?? {}).filter(
            (v) => v?.balance
        );
        if (ppts.length) {
            return true;
        }
        return false;
    });
    return filtered.map(([v]) => v as Version).reverse();
};
export default versionBy;
