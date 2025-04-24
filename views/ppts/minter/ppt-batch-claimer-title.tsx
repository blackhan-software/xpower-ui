import { useContext, useEffect, useState } from 'react';

import { Bus } from '../../../source/bus';
import { MoeTreasuryFactory } from '../../../source/contract';
import { buffered, nice_si } from '../../../source/functions';
import { AccountContext } from '../../../source/react';
import { Account, Amount, Nft, NftLevels, PptClaimerStatus, Token, TokenInfo } from '../../../source/redux/types';
import { Years } from '../../../source/years';
import { parseUnits } from 'ethers';

export type Props = {
    status: PptClaimerStatus | null;
}
export function UiPptBatchClaimerTitle(
    { status }: Props
) {
    const [title, set_title] = useState<string | undefined>();
    const [account] = useContext(AccountContext);
    useEffect(() => {
        mintable(account).then((amount) => {
            set_title(`Supply ${amount} *locked* ${Token.APOW}s to XPowerbanq.com`);
            Bus.emit('refresh-tips');
        });
    }, [
        account, status
    ]);
    return title;
}
const mintable = buffered(async (
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
    const mintables = await moe_treasury
        .mintableBatch(account, ppt_ids);
    const mintable = mintables
        .reduce((acc, m) => acc + floor(m), 0n);
    return nice_si(mintable, {
        base: 10 ** TokenInfo(Token.APOW).decimals
    });
}, 0);
const floor = (amount: Amount) => {
    const { decimals } = TokenInfo(Token.APOW);
    const lower = parseUnits('1.000', decimals);
    return lower < amount ? amount : 0n;
};
export default UiPptBatchClaimerTitle;
