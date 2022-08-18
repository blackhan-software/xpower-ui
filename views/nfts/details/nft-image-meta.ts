import { Meta } from '../../../source/contract';
import { x40 } from '../../../source/functions';
import { Address, Token } from '../../../source/redux/types';
import { NftIssue, NftLevel } from '../../../source/redux/types';
import { NftWallet, NftWalletMock } from '../../../source/wallet';

export class NftImageMeta {
    static key(address: Address | undefined, {
        issue: i, level: l, token: t
    }: {
        issue: NftIssue; level: NftLevel; token: Token;
    }) {
        return `nft-image-meta:${x40(address ?? 0n)}:${t}:${l}:${i}#000`;
    }
    static get_cache(address: Address | undefined, nft: {
        issue: NftIssue; level: NftLevel; token: Token;
    }) {
        const key = this.key(address, nft);
        const value = localStorage.getItem(key);
        if (value !== null) {
            return JSON.parse(value) as Meta;
        }
        return null;
    }
    static set_cache(address: Address | undefined, nft: {
        issue: NftIssue; level: NftLevel; token: Token;
    }, meta: Meta) {
        const key = this.key(address, nft);
        const value = JSON.stringify(meta);
        localStorage.setItem(key, value);
        return meta;
    }
    static async get(address: Address | undefined, nft: {
        issue: NftIssue; level: NftLevel; token: Token;
    }) {
        const meta = this.get_cache(address, nft);
        if (meta) {
            return meta;
        }
        return this.set_cache(address, nft, address
            ? await get_meta(new NftWallet(address, nft.token))
            : await get_meta(new NftWalletMock(0n, nft.token)));
        async function get_meta(wallet: NftWallet) {
            const core_id = await wallet.idBy(
                nft.issue, nft.level
            );
            return wallet.meta(core_id);
        }
    }
}
export default NftImageMeta;
