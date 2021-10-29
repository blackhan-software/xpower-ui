import assert from 'assert';
import dotenv from 'dotenv';
dotenv.config();

const IPFS_GATEWAY = process.env.IPFS_GATEWAY || 'https://dweb.link';
assert(IPFS_GATEWAY, 'missing IPFS_GATEWAY env variable');
const MD_ABOUT_URL = process.env.MD_ABOUT_URL || '/content/about.md';
assert(MD_ABOUT_URL, 'missing MD_ABOUT_URL env variable');
const UI_COPYRIGHT = process.env.UI_COPYRIGHT || 'Kârūn The Lydian';
assert(UI_COPYRIGHT, 'missing UI_COPYRIGHT env variable');
const UI_PERSISTENCE = process.env.UI_PERSISTENCE || '0';
assert(UI_PERSISTENCE, 'missing UI_PERSISTENCE env variable');
const UI_MINING_SPEED = process.env.UI_MINING_SPEED || '50';
assert(UI_MINING_SPEED, 'missing UI_MINING_SPEED env variable');
const XPOWER_ADDRESS = process.env.XPOWER_ADDRESS || '0x74A68215AEdf59f317a23E87C13B848a292F27A4';
assert(XPOWER_ADDRESS, 'missing XPOWER_ADDRESS env variable');
const XPOWER_SYMBOL = process.env.XPOWER_SYMBOL || 'XPOW';
assert(XPOWER_SYMBOL, 'missing XPOWER_SYMBOL env variable');
const XPOWER_DECIMALS = process.env.XPOWER_DECIMALS || '0';
assert(XPOWER_DECIMALS, 'missing XPOWER_DECIMALS env variable');
const XPOWER_IMAGE = process.env.XPOWER_IMAGE || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktbGlnaHRuaW5nLWZpbGwiIHZpZXdCb3g9IjAgMCAxNiAxNiI+CiAgPHN0eWxlPnBhdGggeyBmaWxsOiB5ZWxsb3c7IHN0cm9rZTogYmxhY2s7IH08L3N0eWxlPgogIDxwYXRoIGQ9Ik0xMS4yNTEuMDY4YS41LjUgMCAwIDEgLjIyNy41OEw5LjY3NyA2LjVIMTNhLjUuNSAwIDAgMSAuMzY0Ljg0M2wtOCA4LjVhLjUuNSAwIDAgMS0uODQyLS40OUw2LjMyMyA5LjVIM2EuNS41IDAgMCAxLS4zNjQtLjg0M2w4LTguNWEuNS41IDAgMCAxIC42MTUtLjA5eiIvPgo8L3N2Zz4K';
assert(typeof XPOWER_IMAGE === 'string', 'missing XPOW_IMAGE env variable');

export default {
    IPFS_GATEWAY,
    MD_ABOUT_URL,
    UI_COPYRIGHT,
    UI_PERSISTENCE,
    UI_MINING_SPEED,
    XPOWER_ADDRESS,
    XPOWER_SYMBOL,
    XPOWER_DECIMALS,
    XPOWER_IMAGE
};
