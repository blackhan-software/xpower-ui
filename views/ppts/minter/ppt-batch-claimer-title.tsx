import { BigNumber } from 'ethers';
import { useContext, useEffect, useState } from 'react';

import { Bus } from '../../../source/bus';
import { MoeTreasuryFactory } from '../../../source/contract';
import { buffered, nice_si, x40 } from '../../../source/functions';
import { AddressContext } from '../../../source/react';
import { Address, Nft, NftLevels, PptClaimerStatus, Token, TokenInfo } from '../../../source/redux/types';
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
    const [address] = useContext(AddressContext);
    useEffect(() => {
        claimable(address, token).then((a) => {
            set_title(`${a} ${Tokenizer.aify(token)}`);
            Bus.emit('refresh-tips');
        });
    }, [
        address, status, token
    ]);
    return title;
}
const claimable = buffered(async (
    address: Address | null, token: Props['token']
) => {
    if (address === null) {
        return Promise.resolve(undefined);
    }
    const ppt_ids = Nft.fullIds({
        issues: Array.from(Years()),
        levels: Array.from(NftLevels()),
        token: Nft.token(token)
    });
    const moe_treasury = await MoeTreasuryFactory({
        token
    });
    const claimables: BigNumber[] = await moe_treasury
        .claimableForBatch(x40(address), Nft.realIds(ppt_ids));
    const claimable = claimables
        .reduce((acc, c) => acc.add(c), BigNumber.from(0));
    return nice_si(claimable.toBigInt(), {
        base: 10 ** TokenInfo(token).decimals
    });
}, 0);
export default UiPptBatchClaimerTitle;
