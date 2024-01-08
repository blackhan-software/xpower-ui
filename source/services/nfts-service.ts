import { Store } from '@reduxjs/toolkit';
import { Blockchain } from '../blockchain';
import { x40 } from '../functions';
import { addNft, removeNft, setNft } from '../redux/actions';
import { nftsBy } from '../redux/selectors';
import { AppState } from '../redux/store';
import { Nft, NftFullId, NftLevels } from '../redux/types';
import { NftWallet, OnTransferBatch, OnTransferSingle } from '../wallet';
import { Years } from '../years';

export const NftsService = (
    store: Store<AppState>
) => {
    Blockchain.onceConnect(async function initNfts({
        account
    }) {
        let index = 0;
        const levels = Array.from(NftLevels());
        const issues = Array.from(Years({ reverse: true }));
        const wallet = new NftWallet(account);
        const balances = await wallet.balances({
            issues, levels
        });
        const supplies = await wallet.totalSupplies({
            issues, levels
        });
        for (const issue of issues) {
            for (const level of levels) {
                const amount = balances[index];
                const supply = supplies[index];
                store.dispatch(setNft({
                    issue, level
                }, {
                    amount, supply
                }));
                index += 1;
            }
        }
    });
    Blockchain.onConnect(function syncNfts() {
        const nfts = nftsBy(store.getState());
        for (const [id, nft] of Object.entries(nfts.items)) {
            store.dispatch(setNft(id as NftFullId, nft));
        }
    });
    Blockchain.onceConnect(async function onNftSingleTransfers({
        account
    }) {
        const on_transfer: OnTransferSingle = async (
            op, from, to, id, value, ev
        ) => {
            console.debug('[on:transfer-single]',
                x40(op), x40(from), x40(to),
                id, value, ev
            );
            const nft_id = Nft.fullId({
                issue: Nft.issue(id),
                level: Nft.level(id)
            });
            if (account === from) {
                store.dispatch(removeNft(nft_id, {
                    kind: to ? 'transfer' : 'burn',
                    amount: value
                }));
            }
            if (account === to) {
                store.dispatch(addNft(nft_id, {
                    amount: value
                }));
            }
        };
        const nft_wallet = new NftWallet(account);
        nft_wallet.onTransferSingle(on_transfer);
    });
    Blockchain.onceConnect(async function onNftBatchTransfers({
        account
    }) {
        const on_transfer: OnTransferBatch = async (
            op, from, to, ids, values, ev
        ) => {
            console.debug('[on:transfer-batch]',
                x40(op), x40(from), x40(to),
                ids, values, ev
            );
            for (let i = 0; i < ids.length; i++) {
                const nft_id = Nft.fullId({
                    issue: Nft.issue(ids[i]),
                    level: Nft.level(ids[i])
                });
                if (account === from) {
                    store.dispatch(removeNft(nft_id, {
                        kind: to ? 'transfer' : 'burn',
                        amount: values[i]
                    }));
                }
                if (account === to) {
                    store.dispatch(addNft(nft_id, {
                        amount: values[i]
                    }));
                }
            }
        };
        const nft_wallet = new NftWallet(account);
        nft_wallet.onTransferBatch(on_transfer);
    });
}
export default NftsService;
