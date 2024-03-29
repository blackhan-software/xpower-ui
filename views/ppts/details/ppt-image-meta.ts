import { x40 } from '../../../source/functions';
import { ROParams } from '../../../source/params';
import { Account, NftIssue, NftLevel } from '../../../source/redux/types';
import { Meta, PptWallet, PptWalletMock } from '../../../source/wallet';

export class PptImageMeta {
    static key(address: Account | null, {
        issue: i, level: l
    }: {
        issue: NftIssue; level: NftLevel;
    }) {
        const prefix = `ppt-image-meta:${x40(address ?? 0n)}`;
        const suffix = `${i}:${l}:${ROParams.version}`;
        return `${prefix}:${suffix}#000`;
    }
    static get_cache(address: Account | null, nft: {
        issue: NftIssue; level: NftLevel;
    }) {
        const key = this.key(address, nft);
        const value = localStorage.getItem(key);
        if (value !== null) {
            return JSON.parse(value) as Meta;
        }
        return null;
    }
    static set_cache(address: Account | null, nft: {
        issue: NftIssue; level: NftLevel;
    }, meta: Meta) {
        const key = this.key(address, nft);
        const value = JSON.stringify(meta);
        localStorage.setItem(key, value);
        return meta;
    }
    static async get(address: Account | null, nft: {
        issue: NftIssue; level: NftLevel;
    }) {
        const meta = this.get_cache(address, nft);
        if (meta) {
            return meta;
        }
        return this.set_cache(address, nft, address
            ? await get_meta(new PptWallet(address))
            : await get_meta(new PptWalletMock(0n)));
        async function get_meta(wallet: PptWallet) {
            const full_id = await wallet.idBy(
                nft.issue, nft.level
            );
            return wallet.meta(full_id);
        }
    }
}
export default PptImageMeta;
