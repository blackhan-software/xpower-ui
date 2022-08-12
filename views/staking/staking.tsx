import './staking.scss';

import { App } from '../../source/app';
import { Blockchain } from '../../source/blockchain';
import { MoeTreasuryFactory } from '../../source/contract';
import { ancestor, next } from '../../source/functions';
import { buffered, update, x40 } from '../../source/functions';
import { Amount, NftFullId, Token } from '../../source/redux/types';
import { Nfts, Nft } from '../../source/redux/types';
import { NftLevel, NftLevels } from '../../source/redux/types';
import { NftToken, NftTokens } from '../../source/redux/types';
import { NftWallet, PptWallet } from '../../source/wallet';
import { OnTransferBatch } from '../../source/wallet';
import { OnTransferSingle } from '../../source/wallet';
import { Years } from '../../source/years';

import React, { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { Header } from '../header/header';
import { PptList } from './list/list';
import { PptMinter } from './minter';
import { Footer } from '../footer/footer';

type Props = {
    token: Token;
}
type State = {
    token: Token;
    nfts: Nfts;
    ppts: Nfts;
    list: List;
    matrix: Matrix;
}
type Matrix = Record<NftToken, Record<NftLevel, {
    amount: Amount;
    max: Amount;
    min: Amount;
}>>;
type List = Record<NftLevel, {
    display: boolean;
    toggled: boolean;
}>;
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
    const union = {} as Record<
        NftLevel, Matrix[NftToken][NftLevel] & List[NftLevel]
    >;
    for (const [key, value] of Object.entries(rhs)) {
        const nft_level = key as unknown as NftLevel;
        union[nft_level] = { ...value, ...lhs[nft_level] };
    }
    return union;
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
export class UiPpts extends React.Component<
    Props, State
> {
    constructor(props: Props) {
        super(props);
        const { token } = this.props;
        const nft_token = Nft.token(token);
        this.state = {
            token,
            nfts: App.getNfts({ token: nft_token }),
            ppts: App.getPpts({ token: nft_token }),
            list: list(), matrix: matrix(),
        };
        this.events();
    }
    events() {
        App.onTokenSwitch((token) => this.setState({
            token
        }));
        App.onNftChanged(async/*sync-nfts*/() => {
            const nft_token = Nft.token(this.state.token);
            await update<State>.bind(this)({
                nfts: App.getNfts({ token: nft_token })
            });
            reset(nft_token);
        });
        App.onPptChanged(async/*sync-ppts*/() => {
            const nft_token = Nft.token(this.state.token);
            await update<State>.bind(this)({
                ppts: App.getPpts({ token: nft_token })
            });
            reset(nft_token);
        });
        const reset = (
            nft_token: NftToken
        ) => {
            const entries = Array.from(NftLevels()).map((nft_level): [
                NftLevel, Matrix[NftToken][NftLevel]
            ] => {
                const { amount: max } = App.getNftTotalBy({
                    level: nft_level, token: nft_token
                });
                const { amount: min } = App.getPptTotalBy({
                    level: nft_level, token: nft_token
                });
                return [nft_level, {
                    amount: max, max, min: -min
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
        const { token, list, matrix } = this.state;
        const nft_token = Nft.token(token);
        return <React.Fragment>
            <form id='single-minting'>
                <PptList
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
            </form>
            <form id='batch-minting'>
                <PptMinter
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
            </form>
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
Blockchain.onceConnect(async function initPpts({
    address, token
}) {
    let index = 0;
    const levels = Array.from(NftLevels());
    const issues = Array.from(Years()).reverse();
    const wallet = new PptWallet(address, token);
    const balances = await wallet.balances({ issues, levels });
    const supplies = wallet.totalSupplies({ issues, levels });
    const ppt_token = Nft.token(
        token
    );
    for (const issue of issues) {
        for (const level of levels) {
            const amount = balances[index];
            const supply = await supplies[index];
            App.setPpt({
                issue, level, token: ppt_token
            }, {
                amount, supply
            });
            index += 1;
        }
    }
}, {
    per: () => App.token
});
Blockchain.onConnect(function syncPpts({
    token
}) {
    const ppts = App.getPpts({
        token: Nft.token(token)
    });
    for (const [id, ppt] of Object.entries(ppts.items)) {
        App.setPpt(id as NftFullId, ppt);
    }
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
Blockchain.onceConnect(async function onPptBatchTransfers({
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
            const ppt_id = Nft.fullId({
                issue: Nft.issue(ids[i]),
                level: Nft.level(ids[i]),
                token: nft_token
            });
            if (address === from) {
                App.removePpt(ppt_id, { amount: values[i] });
            }
            if (address === to) {
                App.addPpt(ppt_id, { amount: values[i] });
            }
        }
    };
    const ppt_wallet = new PptWallet(address, token);
    ppt_wallet.onTransferBatch(on_transfer);
}, {
    per: () => App.token
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
Blockchain.onceConnect(async function onPptSingleTransfers({
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
            App.removePpt(nft_id, { amount: value });
        }
        if (address === to) {
            App.addPpt(nft_id, { amount: value });
        }
    };
    const ppt_wallet = new PptWallet(address, token);
    ppt_wallet.onTransferSingle(on_transfer)
}, {
    per: () => App.token
});
Blockchain.onceConnect(async function updateClaims() {
    const moe_treasury = await MoeTreasuryFactory({
        token: App.token
    });
    moe_treasury.provider.on('block', buffered(() => {
        const $toggles = document.querySelectorAll<HTMLElement>(
            '.nft-minter .toggle[data-state="on"]'
        );
        $toggles.forEach(($toggle) => {
            const $minter_on = ancestor($toggle, ($el) => {
                return $el.classList.contains('nft-minter');
            });
            const $details = next($minter_on, ($el) => {
                return $el.classList.contains('nft-details');
            })
            const $rows_on = $details?.querySelectorAll<HTMLElement>(
                '.row.year[data-state="on"]'
            );
            $rows_on?.forEach(($el) => {
                $el.dispatchEvent(new Event('refresh'));
            });
        });
    }));
});
if (require.main === module) {
    const $header = document.querySelector('header');
    createRoot($header!).render(createElement(Header, {
        token: App.token, page: App.page
    }));
    const $ppts = document.querySelector('div#ppts');
    createRoot($ppts!).render(createElement(UiPpts, {
        token: App.token
    }));
    const $footer = document.querySelector('footer');
    createRoot($footer!).render(createElement(Footer, {
        token: App.token
    }));
}
export default UiPpts;
