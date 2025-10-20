import { readFileSync as read } from 'fs';
import dotenv from 'dotenv';
import check from 'assert';

if (process.env.NETWORK === 'testnet') {
    dotenv.config({ path: ['.env.testnet.local', '.env.testnet'] });
} else {
    dotenv.config({ path: ['.env.mainnet.local', '.env.mainnet'] });
}

// App settings
const IPFS_GATEWAY = process.env.IPFS_GATEWAY ?? 'https://dweb.link';
check(IPFS_GATEWAY, 'missing env IPFS_GATEWAY variable');
const MD_ABOUT_URL = process.env.MD_ABOUT_URL ?? '/content/about.md';
check(MD_ABOUT_URL, 'missing env MD_ABOUT_URL variable');
const UI_PERSISTENCE = process.env.UI_PERSISTENCE ?? '0';
check(UI_PERSISTENCE, 'missing env UI_PERSISTENCE variable');
const UI_MINING_SPEED = process.env.UI_MINING_SPEED ?? '50';
check(UI_MINING_SPEED, 'missing env UI_MINING_SPEED variable');
const MY_PROVIDER_URL = process.env.MY_PROVIDER_URL ?? '';
check(MY_PROVIDER_URL || MY_PROVIDER_URL === '', 'missing env MY_PROVIDER_URL variable');
// MOE contract addresses
const XPOW_MOE_01a = process.env.XPOW_MOE_01a;
check(XPOW_MOE_01a, 'missing env XPOW_MOE_01a variable');
const XPOW_MOE_02a = process.env.XPOW_MOE_02a;
check(XPOW_MOE_02a, 'missing env XPOW_MOE_02a variable');
const XPOW_MOE_03a = process.env.XPOW_MOE_03a;
check(XPOW_MOE_03a, 'missing env XPOW_MOE_03a variable');
const XPOW_MOE_04a = process.env.XPOW_MOE_04a;
check(XPOW_MOE_04a, 'missing env XPOW_MOE_04a variable');
const XPOW_MOE_05a = process.env.XPOW_MOE_05a;
check(XPOW_MOE_05a, 'missing env XPOW_MOE_05a variable');
const XPOW_MOE_05b = process.env.XPOW_MOE_05b;
check(XPOW_MOE_05b, 'missing env XPOW_MOE_05b variable');
const XPOW_MOE_05c = process.env.XPOW_MOE_05c;
check(XPOW_MOE_05c, 'missing env XPOW_MOE_05c variable');
const XPOW_MOE_06a = process.env.XPOW_MOE_06a;
check(XPOW_MOE_06a, 'missing env XPOW_MOE_06a variable');
const XPOW_MOE_06b = process.env.XPOW_MOE_06b;
check(XPOW_MOE_06b, 'missing env XPOW_MOE_06b variable');
const XPOW_MOE_06c = process.env.XPOW_MOE_06c;
check(XPOW_MOE_06c, 'missing env XPOW_MOE_06c variable');
const XPOW_MOE_07a = process.env.XPOW_MOE_07a;
check(XPOW_MOE_07a, 'missing env XPOW_MOE_07a variable');
const XPOW_MOE_07b = process.env.XPOW_MOE_07b;
check(XPOW_MOE_07b, 'missing env XPOW_MOE_07b variable');
const XPOW_MOE_07c = process.env.XPOW_MOE_07c;
check(XPOW_MOE_07c, 'missing env XPOW_MOE_07c variable');
const XPOW_MOE_08a = process.env.XPOW_MOE_08a;
check(XPOW_MOE_08a, 'missing env XPOW_MOE_08a variable');
const XPOW_MOE_08b = process.env.XPOW_MOE_08b;
check(XPOW_MOE_08b, 'missing env XPOW_MOE_08b variable');
const XPOW_MOE_08c = process.env.XPOW_MOE_08c;
check(XPOW_MOE_08c, 'missing env XPOW_MOE_08c variable');
const XPOW_MOE_09a = process.env.XPOW_MOE_09a;
check(XPOW_MOE_09a, 'missing env XPOW_MOE_09a variable');
const XPOW_MOE_09b = process.env.XPOW_MOE_09b;
check(XPOW_MOE_09b, 'missing env XPOW_MOE_09b variable');
const XPOW_MOE_09c = process.env.XPOW_MOE_09c;
check(XPOW_MOE_09c, 'missing env XPOW_MOE_09c variable');
const XPOW_MOE_10a = process.env.XPOW_MOE_10a;
check(XPOW_MOE_10a, 'missing env XPOW_MOE_10a variable');
const XPOW_MOE_10b = process.env.XPOW_MOE_10b;
check(XPOW_MOE_10b, 'missing env XPOW_MOE_10b variable');
// NFT contract addresses
const XPOW_NFT_02a = process.env.XPOW_NFT_02a;
check(XPOW_NFT_02a, 'missing env XPOW_NFT_02a variable');
const XPOW_NFT_02b = process.env.XPOW_NFT_02b;
check(XPOW_NFT_02b, 'missing env XPOW_NFT_02b variable');
const XPOW_NFT_02c = process.env.XPOW_NFT_02c;
check(XPOW_NFT_02c, 'missing env XPOW_NFT_02c variable');
const XPOW_NFT_03a = process.env.XPOW_NFT_03a;
check(XPOW_NFT_03a, 'missing env XPOW_NFT_03a variable');
const XPOW_NFT_03b = process.env.XPOW_NFT_03b;
check(XPOW_NFT_03b, 'missing env XPOW_NFT_03b variable');
const XPOW_NFT_04a = process.env.XPOW_NFT_04a;
check(XPOW_NFT_04a, 'missing env XPOW_NFT_04a variable');
const XPOW_NFT_05a = process.env.XPOW_NFT_05a;
check(XPOW_NFT_05a, 'missing env XPOW_NFT_05a variable');
const XPOW_NFT_05b = process.env.XPOW_NFT_05b;
check(XPOW_NFT_05b, 'missing env XPOW_NFT_05b variable');
const XPOW_NFT_05c = process.env.XPOW_NFT_05c;
check(XPOW_NFT_05c, 'missing env XPOW_NFT_05c variable');
const XPOW_NFT_06a = process.env.XPOW_NFT_06a;
check(XPOW_NFT_06a, 'missing env XPOW_NFT_06a variable');
const XPOW_NFT_06b = process.env.XPOW_NFT_06b;
check(XPOW_NFT_06b, 'missing env XPOW_NFT_06b variable');
const XPOW_NFT_06c = process.env.XPOW_NFT_06c;
check(XPOW_NFT_06c, 'missing env XPOW_NFT_06c variable');
const XPOW_NFT_07a = process.env.XPOW_NFT_07a;
check(XPOW_NFT_07a, 'missing env XPOW_NFT_07a variable');
const XPOW_NFT_07b = process.env.XPOW_NFT_07b;
check(XPOW_NFT_07b, 'missing env XPOW_NFT_07b variable');
const XPOW_NFT_07c = process.env.XPOW_NFT_07c;
check(XPOW_NFT_07c, 'missing env XPOW_NFT_07c variable');
const XPOW_NFT_08a = process.env.XPOW_NFT_08a;
check(XPOW_NFT_08a, 'missing env XPOW_NFT_08a variable');
const XPOW_NFT_08b = process.env.XPOW_NFT_08b;
check(XPOW_NFT_08b, 'missing env XPOW_NFT_08b variable');
const XPOW_NFT_08c = process.env.XPOW_NFT_08c;
check(XPOW_NFT_08c, 'missing env XPOW_NFT_08c variable');
const XPOW_NFT_09a = process.env.XPOW_NFT_09a;
check(XPOW_NFT_09a, 'missing env XPOW_NFT_09a variable');
const XPOW_NFT_09b = process.env.XPOW_NFT_09b;
check(XPOW_NFT_09b, 'missing env XPOW_NFT_09b variable');
const XPOW_NFT_09c = process.env.XPOW_NFT_09c;
check(XPOW_NFT_09c, 'missing env XPOW_NFT_09c variable');
const XPOW_NFT_10a = process.env.XPOW_NFT_10a;
check(XPOW_NFT_10a, 'missing env XPOW_NFT_10a variable');
const XPOW_NFT_10b = process.env.XPOW_NFT_10b;
check(XPOW_NFT_10b, 'missing env XPOW_NFT_10b variable');
// PPT contract addresses
const APOW_NFT_04a = process.env.APOW_NFT_04a;
check(APOW_NFT_04a, 'missing env APOW_NFT_04a variable');
const APOW_NFT_05a = process.env.APOW_NFT_05a;
check(APOW_NFT_05a, 'missing env APOW_NFT_05a variable');
const APOW_NFT_05b = process.env.APOW_NFT_05b;
check(APOW_NFT_05b, 'missing env APOW_NFT_05b variable');
const APOW_NFT_05c = process.env.APOW_NFT_05c;
check(APOW_NFT_05c, 'missing env APOW_NFT_05c variable');
const APOW_NFT_06a = process.env.APOW_NFT_06a;
check(APOW_NFT_06a, 'missing env APOW_NFT_06a variable');
const APOW_NFT_06b = process.env.APOW_NFT_06b;
check(APOW_NFT_06b, 'missing env APOW_NFT_06b variable');
const APOW_NFT_06c = process.env.APOW_NFT_06c;
check(APOW_NFT_06c, 'missing env APOW_NFT_06c variable');
const APOW_NFT_07a = process.env.APOW_NFT_07a;
check(APOW_NFT_07a, 'missing env APOW_NFT_07a variable');
const APOW_NFT_07b = process.env.APOW_NFT_07b;
check(APOW_NFT_07b, 'missing env APOW_NFT_07b variable');
const APOW_NFT_07c = process.env.APOW_NFT_07c;
check(APOW_NFT_07c, 'missing env APOW_NFT_07c variable');
const APOW_NFT_08a = process.env.APOW_NFT_08a;
check(APOW_NFT_08a, 'missing env APOW_NFT_08a variable');
const APOW_NFT_08b = process.env.APOW_NFT_08b;
check(APOW_NFT_08b, 'missing env APOW_NFT_08b variable');
const APOW_NFT_08c = process.env.APOW_NFT_08c;
check(APOW_NFT_08c, 'missing env APOW_NFT_08c variable');
const APOW_NFT_09a = process.env.APOW_NFT_09a;
check(APOW_NFT_09a, 'missing env APOW_NFT_09a variable');
const APOW_NFT_09b = process.env.APOW_NFT_09b;
check(APOW_NFT_09b, 'missing env APOW_NFT_09b variable');
const APOW_NFT_09c = process.env.APOW_NFT_09c;
check(APOW_NFT_09c, 'missing env APOW_NFT_09c variable');
const APOW_NFT_10a = process.env.APOW_NFT_10a;
check(APOW_NFT_10a, 'missing env APOW_NFT_10a variable');
const APOW_NFT_10b = process.env.APOW_NFT_10b;
check(APOW_NFT_10b, 'missing env APOW_NFT_10b variable');
// SOV contract addresses
const APOW_SOV_05a = process.env.APOW_SOV_05a;
check(APOW_SOV_05a, 'missing env APOW_SOV_05a variable');
const APOW_SOV_05b = process.env.APOW_SOV_05b;
check(APOW_SOV_05b, 'missing env APOW_SOV_05b variable');
const APOW_SOV_05c = process.env.APOW_SOV_05c;
check(APOW_SOV_05c, 'missing env APOW_SOV_05c variable');
const APOW_SOV_06a = process.env.APOW_SOV_06a;
check(APOW_SOV_06a, 'missing env APOW_SOV_06a variable');
const APOW_SOV_06b = process.env.APOW_SOV_06b;
check(APOW_SOV_06b, 'missing env APOW_SOV_06b variable');
const APOW_SOV_06c = process.env.APOW_SOV_06c;
check(APOW_SOV_06c, 'missing env APOW_SOV_06c variable');
const APOW_SOV_07a = process.env.APOW_SOV_07a;
check(APOW_SOV_07a, 'missing env APOW_SOV_07a variable');
const APOW_SOV_07b = process.env.APOW_SOV_07b;
check(APOW_SOV_07b, 'missing env APOW_SOV_07b variable');
const APOW_SOV_07c = process.env.APOW_SOV_07c;
check(APOW_SOV_07c, 'missing env APOW_SOV_07c variable');
const APOW_SOV_08a = process.env.APOW_SOV_08a;
check(APOW_SOV_08a, 'missing env APOW_SOV_08a variable');
const APOW_SOV_08b = process.env.APOW_SOV_08b;
check(APOW_SOV_08b, 'missing env APOW_SOV_08b variable');
const APOW_SOV_08c = process.env.APOW_SOV_08c;
check(APOW_SOV_08c, 'missing env APOW_SOV_08c variable');
const APOW_SOV_09a = process.env.APOW_SOV_09a;
check(APOW_SOV_09a, 'missing env APOW_SOV_09a variable');
const APOW_SOV_09b = process.env.APOW_SOV_09b;
check(APOW_SOV_09b, 'missing env APOW_SOV_09b variable');
const APOW_SOV_09c = process.env.APOW_SOV_09c;
check(APOW_SOV_09c, 'missing env APOW_SOV_09c variable');
const APOW_SOV_10a = process.env.APOW_SOV_10a;
check(APOW_SOV_10a, 'missing env APOW_SOV_10a variable');
const APOW_SOV_10b = process.env.APOW_SOV_10b;
check(APOW_SOV_10b, 'missing env APOW_SOV_10b variable');
// MOE treasury contract addresses
const XPOW_MTY_04a = process.env.XPOW_MTY_04a;
check(XPOW_MTY_04a, 'missing env XPOW_MTY_04a variable');
const XPOW_MTY_05a = process.env.XPOW_MTY_05a;
check(XPOW_MTY_05a, 'missing env XPOW_MTY_05a variable');
const XPOW_MTY_05b = process.env.XPOW_MTY_05b;
check(XPOW_MTY_05b, 'missing env XPOW_MTY_05b variable');
const XPOW_MTY_05c = process.env.XPOW_MTY_05c;
check(XPOW_MTY_05c, 'missing env XPOW_MTY_05c variable');
const XPOW_MTY_06a = process.env.XPOW_MTY_06a;
check(XPOW_MTY_06a, 'missing env XPOW_MTY_06a variable');
const XPOW_MTY_06b = process.env.XPOW_MTY_06b;
check(XPOW_MTY_06b, 'missing env XPOW_MTY_06b variable');
const XPOW_MTY_06c = process.env.XPOW_MTY_06c;
check(XPOW_MTY_06c, 'missing env XPOW_MTY_06c variable');
const XPOW_MTY_07a = process.env.XPOW_MTY_07a;
check(XPOW_MTY_07a, 'missing env XPOW_MTY_07a variable');
const XPOW_MTY_07b = process.env.XPOW_MTY_07b;
check(XPOW_MTY_07b, 'missing env XPOW_MTY_07b variable');
const XPOW_MTY_07c = process.env.XPOW_MTY_07c;
check(XPOW_MTY_07c, 'missing env XPOW_MTY_07c variable');
const XPOW_MTY_08a = process.env.XPOW_MTY_08a;
check(XPOW_MTY_08a, 'missing env XPOW_MTY_08a variable');
const XPOW_MTY_08b = process.env.XPOW_MTY_08b;
check(XPOW_MTY_08b, 'missing env XPOW_MTY_08b variable');
const XPOW_MTY_08c = process.env.XPOW_MTY_08c;
check(XPOW_MTY_08c, 'missing env XPOW_MTY_08c variable');
const XPOW_MTY_09a = process.env.XPOW_MTY_09a;
check(XPOW_MTY_09a, 'missing env XPOW_MTY_09a variable');
const XPOW_MTY_09b = process.env.XPOW_MTY_09b;
check(XPOW_MTY_09b, 'missing env XPOW_MTY_09b variable');
const XPOW_MTY_09c = process.env.XPOW_MTY_09c;
check(XPOW_MTY_09c, 'missing env XPOW_MTY_09c variable');
const XPOW_MTY_10a = process.env.XPOW_MTY_10a;
check(XPOW_MTY_10a, 'missing env XPOW_MTY_10a variable');
const XPOW_MTY_10b = process.env.XPOW_MTY_10b;
check(XPOW_MTY_10b, 'missing env XPOW_MTY_10b variable');
// PPT treasury contract addresses
const APOW_NTY_04a = process.env.APOW_NTY_04a;
check(APOW_NTY_04a, 'missing env APOW_NTY_04a variable');
const APOW_NTY_05a = process.env.APOW_NTY_05a;
check(APOW_NTY_05a, 'missing env APOW_NTY_05a variable');
const APOW_NTY_05b = process.env.APOW_NTY_05b;
check(APOW_NTY_05b, 'missing env APOW_NTY_05b variable');
const APOW_NTY_05c = process.env.APOW_NTY_05c;
check(APOW_NTY_05c, 'missing env APOW_NTY_05c variable');
const APOW_NTY_06a = process.env.APOW_NTY_06a;
check(APOW_NTY_06a, 'missing env APOW_NTY_06a variable');
const APOW_NTY_06b = process.env.APOW_NTY_06b;
check(APOW_NTY_06b, 'missing env APOW_NTY_06b variable');
const APOW_NTY_06c = process.env.APOW_NTY_06c;
check(APOW_NTY_06c, 'missing env APOW_NTY_06c variable');
const APOW_NTY_07a = process.env.APOW_NTY_07a;
check(APOW_NTY_07a, 'missing env APOW_NTY_07a variable');
const APOW_NTY_07b = process.env.APOW_NTY_07b;
check(APOW_NTY_07b, 'missing env APOW_NTY_07b variable');
const APOW_NTY_07c = process.env.APOW_NTY_07c;
check(APOW_NTY_07c, 'missing env APOW_NTY_07c variable');
const APOW_NTY_08a = process.env.APOW_NTY_08a;
check(APOW_NTY_08a, 'missing env APOW_NTY_08a variable');
const APOW_NTY_08b = process.env.APOW_NTY_08b;
check(APOW_NTY_08b, 'missing env APOW_NTY_08b variable');
const APOW_NTY_08c = process.env.APOW_NTY_08c;
check(APOW_NTY_08c, 'missing env APOW_NTY_08c variable');
const APOW_NTY_09a = process.env.APOW_NTY_09a;
check(APOW_NTY_09a, 'missing env APOW_NTY_09a variable');
const APOW_NTY_09b = process.env.APOW_NTY_09b;
check(APOW_NTY_09b, 'missing env APOW_NTY_09b variable');
const APOW_NTY_09c = process.env.APOW_NTY_09c;
check(APOW_NTY_09c, 'missing env APOW_NTY_09c variable');
const APOW_NTY_10a = process.env.APOW_NTY_10a;
check(APOW_NTY_10a, 'missing env APOW_NTY_10a variable');
const APOW_NTY_10b = process.env.APOW_NTY_10b;
check(APOW_NTY_10b, 'missing env APOW_NTY_10b variable');
// MOE contract images
const XPOW_MOE_IMAGE = process.env.XPOW_MOE_IMAGE ?? read('./public/images/svg/xpow.data.svg', 'utf8');
check(typeof XPOW_MOE_IMAGE === 'string', 'missing env XPOW_MOE_IMAGE variable');
// SOV contract images
const APOW_SOV_IMAGE = process.env.APOW_SOV_IMAGE ?? read('./public/images/svg/apow.data.svg', 'utf8');
check(typeof APOW_SOV_IMAGE === 'string', 'missing env APOW_SOV_IMAGE variable');

export default {
    ...{
        IPFS_GATEWAY,
        MD_ABOUT_URL,
        UI_PERSISTENCE,
        UI_MINING_SPEED,
        MY_PROVIDER_URL,
    }, ...{
        XPOW_MOE_01a,
    }, ...{
        XPOW_MOE_02a,
        XPOW_MOE_02b: XPOW_MOE_02a,
        XPOW_MOE_02c: XPOW_MOE_02a,
        XPOW_MOE_03a,
        XPOW_MOE_03b: XPOW_MOE_03a,
        XPOW_MOE_04a,
        XPOW_MOE_05a,
        XPOW_MOE_05b,
        XPOW_MOE_05c,
        XPOW_MOE_06a,
        XPOW_MOE_06b,
        XPOW_MOE_06c,
        XPOW_MOE_07a,
        XPOW_MOE_07b,
        XPOW_MOE_07c,
        XPOW_MOE_08a,
        XPOW_MOE_08b,
        XPOW_MOE_08c,
        XPOW_MOE_09a,
        XPOW_MOE_09b,
        XPOW_MOE_09c,
        XPOW_MOE_10a,
        XPOW_MOE_10b,
    }, ...{
        XPOW_NFT_02a,
        XPOW_NFT_02b,
        XPOW_NFT_02c,
        XPOW_NFT_03a,
        XPOW_NFT_03b,
        XPOW_NFT_04a,
        XPOW_NFT_05a,
        XPOW_NFT_05b,
        XPOW_NFT_05c,
        XPOW_NFT_06a,
        XPOW_NFT_06b,
        XPOW_NFT_06c,
        XPOW_NFT_07a,
        XPOW_NFT_07b,
        XPOW_NFT_07c,
        XPOW_NFT_08a,
        XPOW_NFT_08b,
        XPOW_NFT_08c,
        XPOW_NFT_09a,
        XPOW_NFT_09b,
        XPOW_NFT_09c,
        XPOW_NFT_10a,
        XPOW_NFT_10b,
    }, ...{
        APOW_NFT_04a,
        APOW_NFT_05a,
        APOW_NFT_05b,
        APOW_NFT_05c,
        APOW_NFT_06a,
        APOW_NFT_06b,
        APOW_NFT_06c,
        APOW_NFT_07a,
        APOW_NFT_07b,
        APOW_NFT_07c,
        APOW_NFT_08a,
        APOW_NFT_08b,
        APOW_NFT_08c,
        APOW_NFT_09a,
        APOW_NFT_09b,
        APOW_NFT_09c,
        APOW_NFT_10a,
        APOW_NFT_10b,
    }, ...{
        APOW_SOV_05a,
        APOW_SOV_05b,
        APOW_SOV_05c,
        APOW_SOV_06a,
        APOW_SOV_06b,
        APOW_SOV_06c,
        APOW_SOV_07a,
        APOW_SOV_07b,
        APOW_SOV_07c,
        APOW_SOV_08a,
        APOW_SOV_08b,
        APOW_SOV_08c,
        APOW_SOV_09a,
        APOW_SOV_09b,
        APOW_SOV_09c,
        APOW_SOV_10a,
        APOW_SOV_10b,
    }, ...{
        XPOW_MTY_04a,
        XPOW_MTY_05a,
        XPOW_MTY_05b,
        XPOW_MTY_05c,
        XPOW_MTY_06a,
        XPOW_MTY_06b,
        XPOW_MTY_06c,
        XPOW_MTY_07a,
        XPOW_MTY_07b,
        XPOW_MTY_07c,
        XPOW_MTY_08a,
        XPOW_MTY_08b,
        XPOW_MTY_08c,
        XPOW_MTY_09a,
        XPOW_MTY_09b,
        XPOW_MTY_09c,
        XPOW_MTY_10a,
        XPOW_MTY_10b,
    }, ...{
        APOW_NTY_04a,
        APOW_NTY_05a,
        APOW_NTY_05b,
        APOW_NTY_05c,
        APOW_NTY_06a,
        APOW_NTY_06b,
        APOW_NTY_06c,
        APOW_NTY_07a,
        APOW_NTY_07b,
        APOW_NTY_07c,
        APOW_NTY_08a,
        APOW_NTY_08b,
        APOW_NTY_08c,
        APOW_NTY_09a,
        APOW_NTY_09b,
        APOW_NTY_09c,
        APOW_NTY_10a,
        APOW_NTY_10b,
    }, ...{
        XPOW_MOE_IMAGE,
        APOW_SOV_IMAGE,
    }
};
