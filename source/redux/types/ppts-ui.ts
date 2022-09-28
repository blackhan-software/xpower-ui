import { NftIssue, NftLevel, NftToken } from './nfts';
import { Address, Amount } from './base';

export type PptsUi = {
    amounts: Record<NftToken, PptAmounts>;
    details: Record<NftToken, PptDetails>;
    minter: Record<NftToken, PptMinter>;
    flags: PptFlags; toggled: boolean;
};
export type PptDetails = Record<NftLevel, Record<NftIssue, {
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
    claimer: {
        status: PptClaimerStatus | null;
    };
    fixed: boolean;
    toggled: boolean;
    expanded: boolean | null;
}>>
export type PptMinterList = Record<NftLevel, {
    amount: Amount; max: Amount; min: Amount;
    display: boolean; toggled: boolean;
}>
export type PptAmounts = Record<NftLevel, {
    amount: Amount; max: Amount; min: Amount;
}>
export type PptFlags = Record<NftLevel, {
    display: boolean; toggled: boolean;
}>
export type PptMinter = {
    approval: PptMinterApproval | null;
    minter_status: PptMinterStatus | null;
    burner_status: PptBurnerStatus | null;
}
export enum PptMinterApproval {
    unapproved = 'unapproved',
    approving = 'approving',
    approved = 'approved',
    error = 'error'
}
export enum PptMinterStatus {
    minting = 'minting',
    minted = 'minted',
    error = 'error'
}
export enum PptBurnerStatus {
    burning = 'burning',
    burned = 'burned',
    error = 'error'
}
export enum PptClaimerStatus {
    claiming = 'claiming',
    claimed = 'claimed',
    error = 'error'
}
export default PptsUi;
