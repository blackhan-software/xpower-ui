import { Blockchain } from '../../source/blockchain';
import { x40 } from '../../source/functions';
import { addNft, removeNft, setNft } from '../../source/redux/actions';
import { nftsBy, tokenOf } from '../../source/redux/selectors';
import { Store } from '../../source/redux/store';
import { Nft, NftFullId, NftLevels } from '../../source/redux/types';
import { NftWallet, OnTransferBatch, OnTransferSingle } from '../../source/wallet';
import { Years } from '../../source/years';
/**
 * nfts:
 */
Blockchain.onceConnect(async function initNfts({
    address, token
}) {
    let index = 0;
    const levels = Array.from(NftLevels());
    const issues = Array.from(Years({ reverse: true }));
    const wallet = new NftWallet(address, token);
    const balances = await wallet.balances({ issues, levels });
    const supplies = wallet.totalSupplies({ issues, levels });
    const nft_token = Nft.token(
        token
    );
    for (const issue of issues) {
        for (const level of levels) {
            const amount = balances[index];
            const supply = await supplies[index];
            Store.dispatch(setNft({
                issue, level, token: nft_token
            }, {
                amount, supply
            }));
            index += 1;
        }
    }
}, {
    per: () => tokenOf(Store.state)
});
Blockchain.onConnect(function syncNfts({
    token
}) {
    const nfts = nftsBy(Store.state, {
        token: Nft.token(token)
    });
    for (const [id, nft] of Object.entries(nfts.items)) {
        Store.dispatch(setNft(id as NftFullId, nft));
    }
});
Blockchain.onceConnect(async function onNftSingleTransfers({
    address, token
}) {
    const on_transfer: OnTransferSingle = async (
        op, from, to, id, value, ev
    ) => {
        if (tokenOf(Store.state) !== token) {
            return;
        }
        console.debug('[on:transfer-single]',
            x40(op), x40(from), x40(to),
            id, value, ev
        );
        const nft_token = Nft.token(
            token
        );
        const nft_id = Nft.fullId({
            issue: Nft.issue(id),
            level: Nft.level(id),
            token: nft_token
        });
        if (address === from) {
            Store.dispatch(removeNft(nft_id, {
                kind: to ? 'transfer' : 'burn',
                amount: value
            }));
        }
        if (address === to) {
            Store.dispatch(addNft(nft_id, {
                amount: value
            }));
        }
    };
    const nft_wallet = new NftWallet(address, token);
    nft_wallet.onTransferSingle(on_transfer)
}, {
    per: () => tokenOf(Store.state)
});
Blockchain.onceConnect(async function onNftBatchTransfers({
    address, token
}) {
    const on_transfer: OnTransferBatch = async (
        op, from, to, ids, values, ev
    ) => {
        if (tokenOf(Store.state) !== token) {
            return;
        }
        console.debug('[on:transfer-batch]',
            x40(op), x40(from), x40(to),
            ids, values, ev
        );
        const nft_token = Nft.token(
            token
        );
        for (let i = 0; i < ids.length; i++) {
            const nft_id = Nft.fullId({
                issue: Nft.issue(ids[i]),
                level: Nft.level(ids[i]),
                token: nft_token
            });
            if (address === from) {
                Store.dispatch(removeNft(nft_id, {
                    kind: to ? 'transfer' : 'burn',
                    amount: values[i]
                }));
            }
            if (address === to) {
                Store.dispatch(addNft(nft_id, {
                    amount: values[i]
                }));
            }
        }
    };
    const nft_wallet = new NftWallet(address, token);
    nft_wallet.onTransferBatch(on_transfer);
}, {
    per: () => tokenOf(Store.state)
});
