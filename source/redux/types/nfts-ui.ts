import { Account, Amount } from './base';
import { NftIssue, NftLevel, NftToken } from './nfts';

export type NftsUi = {
    amounts: Record<NftToken, NftAmounts>;
    details: Record<NftToken, NftDetails>;
    minter: Record<NftToken, NftMinter>;
    flags: NftFlags; toggled: boolean;
};
export type NftDetails = Record<NftLevel, Record<NftIssue, {
    image: {
        url_content: string | null;
        url_market: string | null;
        loading: boolean;
    };
    target: {
        valid: boolean | null;
        value: Account | null;
    };
    amount: {
        valid: boolean | null;
        value: Amount | null;
    };
    sender: {
        status: NftSendStatus | null;
    };
    fixed: boolean;
    toggled: boolean;
    expanded: boolean | null;
}>>
export type NftMinterList = Record<NftLevel, {
    amount1: Amount; max1: Amount; min1: Amount;
    amount2: Amount; max2: Amount; min2: Amount;
    display: boolean; toggled: boolean;
}>
export type NftAmounts = Record<NftLevel, {
    amount1: Amount; max1: Amount; min1: Amount;
    amount2: Amount; max2: Amount; min2: Amount;
}>
export type NftFlags = Record<NftLevel, {
    display: boolean; toggled: boolean;
}>
export type NftMinter = {
    approval: NftMintApproval | null;
    mintStatus: NftMintStatus | null;
    upgradeStatus: NftUpgradeStatus | null;
}
export enum NftMintApproval {
    unapproved = 'unapproved',
    approving = 'approving',
    approved = 'approved',
    error = 'error'
}
export enum NftMintStatus {
    minting = 'minting',
    minted = 'minted',
    error = 'error'
}
export enum NftUpgradeStatus {
    upgrading = 'upgrading',
    upgraded = 'upgraded',
    error = 'error'
}
export enum NftSendStatus {
    sending = 'sending',
    sent = 'sent',
    error = 'error'
}
export default NftsUi;
