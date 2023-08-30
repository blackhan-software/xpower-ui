import { useContext, useEffect, useState } from 'react';

import { Bus } from '../../../source/bus';
import { MoeTreasuryFactory } from '../../../source/contract';
import { buffered, nice_si } from '../../../source/functions';
import { AccountContext } from '../../../source/react';
import { Account, Nft, NftLevels, PptClaimerStatus, Token, TokenInfo } from '../../../source/redux/types';
import { Years } from '../../../source/years';

export type Props = {
    status: PptClaimerStatus | null;
}
export function UiPptBatchClaimerTitle(
    { status }: Props
) {
    const [title, set_title] = useState<string | undefined>();
    const [account] = useContext(AccountContext);
    useEffect(() => {
        claimable(account).then((a) => {
            set_title(`${a} ${Token.APOW}`);
            Bus.emit('refresh-tips');
        });
    }, [
        account, status
    ]);
    return title;
}
const claimable = buffered(async (
    account: Account | null
) => {
    if (account === null) {
        return Promise.resolve(undefined);
    }
    const ppt_ids = Nft.fullIds({
        issues: Array.from(Years()),
        levels: Array.from(NftLevels())
    });
    const moe_treasury = MoeTreasuryFactory();
    const claimables = await moe_treasury
        .claimableBatch(account, ppt_ids);
    const claimable = claimables
        .reduce((acc, c) => acc + c, 0n);
    return nice_si(claimable, {
        base: 10 ** TokenInfo(Token.APOW).decimals
    });
}, 0);
export default UiPptBatchClaimerTitle;
