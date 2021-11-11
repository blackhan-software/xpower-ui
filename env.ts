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

const XPOWER_ADDRESS_OLD = process.env.XPOWER_ADDRESS_OLD || '0x74A68215AEdf59f317a23E87C13B848a292F27A4';
assert(XPOWER_ADDRESS_OLD, 'missing XPOWER_ADDRESS_OLD env variable');
const XPOWER_ADDRESS_CPU = process.env.XPOWER_ADDRESS_CPU || '0xf48C4a0394dD9F27117a43dBb6400872399AB7E7';
assert(XPOWER_ADDRESS_CPU, 'missing XPOWER_ADDRESS_CPU env variable');
const XPOWER_ADDRESS_GPU = process.env.XPOWER_ADDRESS_GPU || '0xc63e3B6D0a2d382A74B13D19426b65C0aa5F3648';
assert(XPOWER_ADDRESS_GPU, 'missing XPOWER_ADDRESS_GPU env variable');
const XPOWER_ADDRESS_ASC = process.env.XPOWER_ADDRESS_ASC || '0xE71a2c51b8e0c35ee1F45ADDDb27fda1862Ad880';
assert(XPOWER_ADDRESS_ASC, 'missing XPOWER_ADDRESS_ASC env variable');

const XPOWER_SYMBOL_CPU = process.env.XPOWER_SYMBOL_CPU || 'XPOW.CPU';
assert(XPOWER_SYMBOL_CPU, 'missing XPOWER_SYMBOL_CPU env variable');
const XPOWER_SYMBOL_GPU = process.env.XPOWER_SYMBOL_GPU || 'XPOW.GPU';
assert(XPOWER_SYMBOL_GPU, 'missing XPOWER_SYMBOL_GPU env variable');
const XPOWER_SYMBOL_ASC = process.env.XPOWER_SYMBOL_ASC || 'XPOW.ASIC';
assert(XPOWER_SYMBOL_ASC, 'missing XPOWER_SYMBOL_ASC env variable');

const XPOWER_DECIMALS_CPU = process.env.XPOWER_DECIMALS_CPU || '0';
assert(XPOWER_DECIMALS_CPU, 'missing XPOWER_DECIMALS_CPU env variable');
const XPOWER_DECIMALS_GPU = process.env.XPOWER_DECIMALS_GPU || '0';
assert(XPOWER_DECIMALS_GPU, 'missing XPOWER_DECIMALS_GPU env variable');
const XPOWER_DECIMALS_ASC = process.env.XPOWER_DECIMALS_ASC || '0';
assert(XPOWER_DECIMALS_ASC, 'missing XPOWER_DECIMALS_ASC env variable');

const XPOWER_IMAGE_CPU = process.env.XPOWER_IMAGE_CPU || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-lightning-fill' viewBox='0 0 16 16'%3E%3Cstyle%3Epath %7B fill: yellow; stroke: black; %7D%3C/style%3E%3Cpath d='M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z'/%3E%3C/svg%3E";
assert(typeof XPOWER_IMAGE_CPU === 'string', 'missing XPOWER_IMAGE_CPU env variable');
const XPOWER_IMAGE_GPU = process.env.XPOWER_IMAGE_GPU || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-lightning-fill' viewBox='0 0 16 16'%3E%3Cstyle%3Epath %7B fill: lime; stroke: black; %7D%3C/style%3E%3Cpath d='M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z'/%3E%3C/svg%3E";
assert(typeof XPOWER_IMAGE_GPU === 'string', 'missing XPOWER_IMAGE_GPU env variable');
const XPOWER_IMAGE_ASC = process.env.XPOWER_IMAGE_ASC || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-lightning-fill' viewBox='0 0 16 16'%3E%3Cstyle%3Epath %7B fill: cyan; stroke: black; %7D%3C/style%3E%3Cpath d='M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z'/%3E%3C/svg%3E";
assert(typeof XPOWER_IMAGE_ASC === 'string', 'missing XPOWER_IMAGE_ASC env variable');

export default {
    IPFS_GATEWAY,
    MD_ABOUT_URL,
    UI_COPYRIGHT,
    UI_PERSISTENCE,
    UI_MINING_SPEED,
    XPOWER_ADDRESS_OLD,
    XPOWER_ADDRESS_CPU,
    XPOWER_ADDRESS_GPU,
    XPOWER_ADDRESS_ASC,
    XPOWER_SYMBOL_CPU,
    XPOWER_SYMBOL_GPU,
    XPOWER_SYMBOL_ASC,
    XPOWER_DECIMALS_CPU,
    XPOWER_DECIMALS_GPU,
    XPOWER_DECIMALS_ASC,
    XPOWER_IMAGE_CPU,
    XPOWER_IMAGE_GPU,
    XPOWER_IMAGE_ASC,
};
