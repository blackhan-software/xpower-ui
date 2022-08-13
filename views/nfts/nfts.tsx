import './nfts.scss';

import { App } from '../../source/app';
import { Blockchain } from '../../source/blockchain';
import { update, x40 } from '../../source/functions';
import { Amount, Balance, Token } from '../../source/redux/types';
import { Nft, Nfts, NftFullId } from '../../source/redux/types';
import { NftLevel, NftLevels } from '../../source/redux/types';
import { NftToken, NftTokens } from '../../source/redux/types';
import { NftWallet } from '../../source/wallet';
import { OnTransferBatch } from '../../source/wallet';
import { OnTransferSingle } from '../../source/wallet';
import { Years } from '../../source/years';

import React, { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { NftList } from './list/list';
import { NftMinter } from './minter/minter';

type Props = {
    token: Token;
}
type State = {
    nfts: Nfts;
    list: List;
    matrix: Matrix;
}
type Matrix = Record<NftToken, Record<NftLevel, {
    amount: Amount;
    max: Amount;
    min: Amount;
}>>
type List = Record<NftLevel, {
    display: boolean;
    toggled: boolean;
}>
function matrix(
    amount = 0n, max = 0n, min = 0n
) {
    const entries = Object.fromEntries(
        Array.from(NftTokens()).map(
            (nft_token) => [nft_token, Object.fromEntries(
                Array.from(NftLevels()).map(
                    (nft_level) => [nft_level, {
                        amount, max, min
                    }]
                )
            )]
        )
    );
    return entries as Matrix;
}
function list(
    display = false, toggled = false
) {
    const entries = Object.fromEntries(
        Array.from(NftLevels()).map(
            (nft_level) => [nft_level, {
                display, toggled
            }]
        )
    );
    return entries as List;
}
function join(
    lhs: List, rhs: Matrix[NftToken]
) {
    const result = {} as Record<
        NftLevel, Matrix[NftToken][NftLevel] & List[NftLevel]
    >;
    for (const [key, value] of Object.entries(rhs)) {
        const nft_level = key as unknown as NftLevel;
        result[nft_level] = { ...value, ...lhs[nft_level] };
    }
    return result;
}
function split(
    union: Partial<Record<
        NftLevel, Matrix[NftToken][NftLevel] & List[NftLevel]
    >>
) {
    const lhs = {} as Record<
        NftLevel, List[NftLevel]
    >;
    const rhs = {} as Record<
        NftLevel, Matrix[NftToken][NftLevel]
    >;
    for (const [key, value] of Object.entries(union)) {
        const nft_level = key as unknown as NftLevel;
        const { display, toggled } = value;
        lhs[nft_level] = { display, toggled };
        const { amount, max, min } = value;
        rhs[nft_level] = { amount, max, min };
    }
    return { lhs, rhs };
}
export class UiNfts extends React.Component<
    Props, State
> {
    constructor(
        props: Props
    ) {
        super(props);
        this.state = {
            nfts: App.getNfts({
                token: Nft.token(this.props.token)
            }),
            list: list(),
            matrix: matrix(),
        };
        this.events();
    }
    events() {
        App.onNftChanged(/*sync-nfts*/() => {
            const nft_token = Nft.token(
                this.props.token
            );
            this.setState({
                nfts: App.getNfts({ token: nft_token })
            });
        });
        App.onTokenChanged(/*sync-balance*/(
            token: Token, { amount: balance }
        ) => {
            reset(Nft.token(token), balance);
        });
        const reset = (
            nft_token: NftToken, balance: Balance
        ) => {
            const entries = Array.from(NftLevels()).map((nft_level): [
                NftLevel, Matrix[NftToken][NftLevel]
            ] => {
                const remainder = balance % 10n ** (BigInt(nft_level) + 3n);
                const amount = remainder / 10n ** BigInt(nft_level);
                return [nft_level, {
                    amount, max: amount, min: 0n
                }];
            });
            update<State>.bind(this)({
                matrix: Object.assign(matrix(), {
                    [nft_token]: Object.fromEntries(entries)
                })
            });
        };
    }
    render() {
        const { token } = this.props;
        const nft_token = Nft.token(token);
        const { list, matrix } = this.state;
        return <React.Fragment>
            <div id='nft-single-minting'>
                <NftList
                    onList={(list) => {
                        const { lhs, rhs } = split(list);
                        update<State>.bind(this)({
                            list: lhs, matrix: { [nft_token]: rhs }
                        });
                    }}
                    list={join(
                        list, matrix[nft_token]
                    )}
                    token={token}
                />
            </div>
            <div id='nft-batch-minting'>
                <NftMinter
                    onList={(list) => {
                        const { lhs, rhs } = split(list);
                        update<State>.bind(this)({
                            list: lhs, matrix: { [nft_token]: rhs }
                        });
                    }}
                    list={join(
                        list, matrix[nft_token]
                    )}
                    token={token}
                />
            </div>
        </React.Fragment>;
    }
}
Blockchain.onceConnect(async function initNfts({
    address, token
}) {
    let index = 0;
    const levels = Array.from(NftLevels());
    const issues = Array.from(Years()).reverse();
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
            App.setNft({
                issue, level, token: nft_token
            }, {
                amount, supply
            });
            index += 1;
        }
    }
}, {
    per: () => App.token
});
Blockchain.onConnect(function syncNfts({
    token
}) {
    const nfts = App.getNfts({
        token: Nft.token(token)
    });
    for (const [id, nft] of Object.entries(nfts.items)) {
        App.setNft(id as NftFullId, nft);
    }
});
Blockchain.onceConnect(async function onNftSingleTransfers({
    address, token
}) {
    const on_transfer: OnTransferSingle = async (
        op, from, to, id, value, ev
    ) => {
        if (App.token !== token) {
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
            App.removeNft(nft_id, { amount: value });
        }
        if (address === to) {
            App.addNft(nft_id, { amount: value });
        }
    };
    const nft_wallet = new NftWallet(address, token);
    nft_wallet.onTransferSingle(on_transfer)
}, {
    per: () => App.token
});
Blockchain.onceConnect(async function onNftBatchTransfers({
    address, token
}) {
    const on_transfer: OnTransferBatch = async (
        op, from, to, ids, values, ev
    ) => {
        if (App.token !== token) {
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
                App.removeNft(nft_id, { amount: values[i] });
            }
            if (address === to) {
                App.addNft(nft_id, { amount: values[i] });
            }
        }
    };
    const nft_wallet = new NftWallet(address, token);
    nft_wallet.onTransferBatch(on_transfer);
}, {
    per: () => App.token
});
if (require.main === module) {
    const $nfts = document.querySelector('content');
    createRoot($nfts!).render(createElement(UiNfts, {
        token: App.token
    }));
}
export default UiNfts;
