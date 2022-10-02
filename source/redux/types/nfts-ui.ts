import { Address, Amount } from './base';
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
        value: Address | null;
    };
    amount: {
        valid: boolean | null;
        value: Amount | null;
    };
    sender: {
        status: NftSenderStatus | null;
    };
    fixed: boolean;
    toggled: boolean;
    expanded: boolean | null;
}>>
export type NftMinterList = Record<NftLevel, {
    amount: Amount; max: Amount; min: Amount;
    display: boolean; toggled: boolean;
}>
export type NftAmounts = Record<NftLevel, {
    amount: Amount; max: Amount; min: Amount;
}>
export type NftFlags = Record<NftLevel, {
    display: boolean; toggled: boolean;
}>
export type NftMinter = {
    approval: NftMinterApproval | null;
    status: NftMinterStatus | null;
}
export enum NftMinterApproval {
    unapproved = 'unapproved',
    approving = 'approving',
    approved = 'approved',
    error = 'error'
}
export enum NftMinterStatus {
    minting = 'minting',
    minted = 'minted',
    error = 'error'
}
export enum NftSenderStatus {
    sending = 'sending',
    sent = 'sent',
    error = 'error'
}
export default NftsUi;
