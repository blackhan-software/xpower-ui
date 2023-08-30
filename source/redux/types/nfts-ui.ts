import { Account, Amount } from './base';
import { NftIssue, NftLevel } from './nfts';

export type NftsUi = {
    amounts: NftAmounts;
    details: NftDetails;
    minter: NftMinter;
    flags: NftFlags;
    toggled: boolean;
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
        status: NftSenderStatus | null;
    };
    fixed: boolean;
    toggled: boolean;
    expanded: boolean | null;
}>>
export type NftMinterList = Record<NftLevel, {
    amount1: Amount; max1: Amount; min1: Amount; // minting
    amount2: Amount; max2: Amount; min2: Amount; // upgrade
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
    approval: NftMinterApproval | null;
    minter_status: NftMinterStatus | null;
    burner_status: NftBurnerStatus | null;
    upgrader_status: NftUpgraderStatus | null;
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
export enum NftBurnerStatus {
    burning = 'burning',
    burned = 'burned',
    error = 'error'
}
export enum NftUpgraderStatus {
    upgrading = 'upgrading',
    upgraded = 'upgraded',
    error = 'error'
}
export enum NftSenderStatus {
    sending = 'sending',
    sent = 'sent',
    error = 'error'
}
export default NftsUi;
