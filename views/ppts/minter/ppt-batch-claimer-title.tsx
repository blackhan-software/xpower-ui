import { useContext, useEffect, useState } from 'react';

import { Bus } from '../../../source/bus';
import { MoeTreasuryFactory } from '../../../source/contract';
import { buffered, nice_si } from '../../../source/functions';
import { AccountContext } from '../../../source/react';
import { Account, Nft, NftLevels, PptClaimerStatus, Token, TokenInfo } from '../../../source/redux/types';
import { Tokenizer } from '../../../source/token';
import { Years } from '../../../source/years';

export type Props = {
    status: PptClaimerStatus | null;
    token: Token;
}
export function UiPptBatchClaimerTitle(
    { status, token }: Props
) {
    const [title, set_title] = useState<string | undefined>();
    const [account] = useContext(AccountContext);
    useEffect(() => {
        claimable(account, token).then((a) => {
            set_title(`${a} ${Tokenizer.aify(token)}`);
            Bus.emit('refresh-tips');
        });
    }, [
        account, status, token
    ]);
    return title;
}
const claimable = buffered(async (
    account: Account | null, token: Props['token']
) => {
    if (account === null) {
        return Promise.resolve(undefined);
    }
    const ppt_ids = Nft.fullIds({
        issues: Array.from(Years()),
        levels: Array.from(NftLevels()),
        token: Nft.token(token)
    });
    const moe_treasury = MoeTreasuryFactory({
        token
    });
    const claimables = await moe_treasury
        .claimableForBatch(account, ppt_ids);
    const claimable = claimables
        .reduce((acc, c) => acc + c, 0n);
    return nice_si(claimable, {
        base: 10 ** TokenInfo(token).decimals
    });
}, 0);
export default UiPptBatchClaimerTitle;
