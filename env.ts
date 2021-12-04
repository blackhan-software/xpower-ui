import assert from 'assert';
import dotenv from 'dotenv';
dotenv.config();

const IPFS_GATEWAY = process.env.IPFS_GATEWAY ?? 'https://dweb.link';
assert(IPFS_GATEWAY, 'missing IPFS_GATEWAY env variable');
const MD_ABOUT_URL = process.env.MD_ABOUT_URL ?? '/content/about.md';
assert(MD_ABOUT_URL, 'missing MD_ABOUT_URL env variable');
const UI_COPYRIGHT = process.env.UI_COPYRIGHT ?? 'XPowerMine.com';
assert(UI_COPYRIGHT, 'missing UI_COPYRIGHT env variable');
const UI_PERSISTENCE = process.env.UI_PERSISTENCE ?? '0';
assert(UI_PERSISTENCE, 'missing UI_PERSISTENCE env variable');
const UI_MINING_SPEED = process.env.UI_MINING_SPEED ?? '50';
assert(UI_MINING_SPEED, 'missing UI_MINING_SPEED env variable');

const XPOWER_ADDRESS_OLD = process.env.XPOWER_ADDRESS_OLD ?? '0x74A68215AEdf59f317a23E87C13B848a292F27A4';
assert(XPOWER_ADDRESS_OLD, 'missing XPOWER_ADDRESS_OLD env variable');
const XPOWER_ADDRESS_CPU = process.env.XPOWER_ADDRESS_CPU ?? '0xf48C4a0394dD9F27117a43dBb6400872399AB7E7';
assert(XPOWER_ADDRESS_CPU, 'missing XPOWER_ADDRESS_CPU env variable');
const XPOWER_ADDRESS_GPU = process.env.XPOWER_ADDRESS_GPU ?? '0xc63e3B6D0a2d382A74B13D19426b65C0aa5F3648';
assert(XPOWER_ADDRESS_GPU, 'missing XPOWER_ADDRESS_GPU env variable');
const XPOWER_ADDRESS_ASC = process.env.XPOWER_ADDRESS_ASC ?? '0xE71a2c51b8e0c35ee1F45ADDDb27fda1862Ad880';
assert(XPOWER_ADDRESS_ASC, 'missing XPOWER_ADDRESS_ASC env variable');

const XPOWER_SYMBOL_CPU = process.env.XPOWER_SYMBOL_CPU ?? 'XPOW.CPU';
assert(XPOWER_SYMBOL_CPU, 'missing XPOWER_SYMBOL_CPU env variable');
const XPOWER_SYMBOL_GPU = process.env.XPOWER_SYMBOL_GPU ?? 'XPOW.GPU';
assert(XPOWER_SYMBOL_GPU, 'missing XPOWER_SYMBOL_GPU env variable');
const XPOWER_SYMBOL_ASC = process.env.XPOWER_SYMBOL_ASC ?? 'XPOW.ASIC';
assert(XPOWER_SYMBOL_ASC, 'missing XPOWER_SYMBOL_ASC env variable');

const XPOWER_DECIMALS_CPU = process.env.XPOWER_DECIMALS_CPU ?? '0';
assert(XPOWER_DECIMALS_CPU, 'missing XPOWER_DECIMALS_CPU env variable');
const XPOWER_DECIMALS_GPU = process.env.XPOWER_DECIMALS_GPU ?? '0';
assert(XPOWER_DECIMALS_GPU, 'missing XPOWER_DECIMALS_GPU env variable');
const XPOWER_DECIMALS_ASC = process.env.XPOWER_DECIMALS_ASC ?? '0';
assert(XPOWER_DECIMALS_ASC, 'missing XPOWER_DECIMALS_ASC env variable');

const XPOWER_IMAGE_CPU = process.env.XPOWER_IMAGE_CPU ?? "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-lightning-fill' viewBox='0 0 16 16'%3E%3Cstyle%3Epath %7B fill: yellow; stroke: black; %7D%3C/style%3E%3Cpath d='M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z'/%3E%3C/svg%3E";
assert(typeof XPOWER_IMAGE_CPU === 'string', 'missing XPOWER_IMAGE_CPU env variable');
const XPOWER_IMAGE_GPU = process.env.XPOWER_IMAGE_GPU ?? "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-lightning-fill' viewBox='0 0 16 16'%3E%3Cstyle%3Epath %7B fill: lime; stroke: black; %7D%3C/style%3E%3Cpath d='M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z'/%3E%3C/svg%3E";
assert(typeof XPOWER_IMAGE_GPU === 'string', 'missing XPOWER_IMAGE_GPU env variable');
const XPOWER_IMAGE_ASC = process.env.XPOWER_IMAGE_ASC ?? "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-lightning-fill' viewBox='0 0 16 16'%3E%3Cstyle%3Epath %7B fill: cyan; stroke: black; %7D%3C/style%3E%3Cpath d='M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z'/%3E%3C/svg%3E";
assert(typeof XPOWER_IMAGE_ASC === 'string', 'missing XPOWER_IMAGE_ASC env variable');

const XPOWER_NFT_ADDRESS_CPU_V1 = process.env.XPOWER_NFT_ADDRESS_CPU_V1 ?? '0x8c6122CA798C39137c340951E69969ce78aD5788';
assert(XPOWER_NFT_ADDRESS_CPU_V1, 'missing XPOWER_NFT_ADDRESS_CPU_V1 env variable');
const XPOWER_NFT_ADDRESS_GPU_V1 = process.env.XPOWER_NFT_ADDRESS_GPU_V1 ?? '0x3049AF79770b127814B08aE80b69F3Cf62433a74';
assert(XPOWER_NFT_ADDRESS_GPU_V1, 'missing XPOWER_NFT_ADDRESS_GPU_V1 env variable');
const XPOWER_NFT_ADDRESS_ASC_V1 = process.env.XPOWER_NFT_ADDRESS_ASC_V1 ?? '0x1ebD373c55E194a2448DEaD7B355d744F55FdD20';
assert(XPOWER_NFT_ADDRESS_ASC_V1, 'missing XPOWER_NFT_ADDRESS_ASC_V1 env variable');

const XPOWER_NFT_ADDRESS_CPU_V2 = process.env.XPOWER_NFT_ADDRESS_CPU_V2 ?? '0x367905eE54817631DbF1d7a1aA15228426CB10Ba';
assert(XPOWER_NFT_ADDRESS_CPU_V2, 'missing XPOWER_NFT_ADDRESS_CPU_V2 env variable');
const XPOWER_NFT_ADDRESS_GPU_V2 = process.env.XPOWER_NFT_ADDRESS_GPU_V2 ?? '0x92E332cc5E9772f18e15B9ab72E2Dc86F5336d2b';
assert(XPOWER_NFT_ADDRESS_GPU_V2, 'missing XPOWER_NFT_ADDRESS_GPU_V2 env variable');
const XPOWER_NFT_ADDRESS_ASC_V2 = process.env.XPOWER_NFT_ADDRESS_ASC_V2 ?? '0xa64d15809D0F74bb26B85597885292899d7a6695';
assert(XPOWER_NFT_ADDRESS_ASC_V2, 'missing XPOWER_NFT_ADDRESS_ASC_V2 env variable');

const XPOWER_NFT_REDIRECT = JSON.parse(process.env.XPOWER_NFT_REDIRECT ?? '{"cpu/202100.json":"https://ipfs.notex.ch/ipfs/QmbbpMYcEkkbdGRhFyDMMd1o2HMtLiHwtjgTfULJ1yCLc6","cpu/202103.json":"https://ipfs.notex.ch/ipfs/QmZqv9JqVbmAzbazic6RUGtWG77FxWqC4owUHoZYTLiAfg","cpu/202106.json":"https://ipfs.notex.ch/ipfs/QmWZqrCXKbA67QkvBopmjC2wFUVXHVKHGWb6sRi5Cou9Uk","cpu/202109.json":"https://ipfs.notex.ch/ipfs/Qmb3G1pEuZSPRun8A3h4i4ZAMCPv3BJ7AEWw9YyFqJ4FVB","cpu/202112.json":"https://ipfs.notex.ch/ipfs/Qmdy1g2hHohZubuLLw9fF5d7FenGq63n1H9xSihZDqVGqg","cpu/202115.json":"https://ipfs.notex.ch/ipfs/QmUHaSCzUbvY7nHMpwLQv1UCxG4Gjeymf7B55otYpMkL5K","cpu/202118.json":"https://ipfs.notex.ch/ipfs/QmTF35PdEwFtncFnZVKLrh1pVMJqSTGd1fzSPxgoC31nGY","cpu/202121.json":"https://ipfs.notex.ch/ipfs/QmYCPnvJzHwy4xxWv7Biv9UEsUEV9ncA4tKdTXqRQeY3xM","cpu/202124.json":"https://ipfs.notex.ch/ipfs/QmSeViBzvKTzxNjrbWoAfK5v5sP3QZE4qMtjuFW8imMy1A","gpu/202100.json":"https://ipfs.notex.ch/ipfs/QmUNEqEKPFWziTgGF2sLcbnhCJK38kHX7FQe1EHnT5MZ1e","gpu/202103.json":"https://ipfs.notex.ch/ipfs/QmcJnoiRNVZ1ywVYrxeeQFbXVSjqjptFpfwFBfg76g7PQB","gpu/202106.json":"https://ipfs.notex.ch/ipfs/QmNf391EGPpExyHFQB2mCrvtK8YaXypSTKrPdUrpsL8enX","gpu/202109.json":"https://ipfs.notex.ch/ipfs/QmXmF3D455dwR6aRgu54qNCCBSNKhA67EhMYnCVHcypHDU","gpu/202112.json":"https://ipfs.notex.ch/ipfs/Qmak5w6fo1jx42grbERYuzjp9rXdFshp1tqt9XhieW3YgR","gpu/202115.json":"https://ipfs.notex.ch/ipfs/Qmeyeb1HNS151MqCVnnWbD2ZZTH3jvkBkkutitqfBZsxGX","gpu/202118.json":"https://ipfs.notex.ch/ipfs/QmWiNGNojRmivVqfCY7uWmVZnishLnnjfmwKdMBjhABgsG","gpu/202121.json":"https://ipfs.notex.ch/ipfs/QmVoVf1u1mj8UK6U6QhMiYAKZHKKhQP7ZSjrM7EAkUZmqK","gpu/202124.json":"https://ipfs.notex.ch/ipfs/QmavfC44c28DCgdZYEjXkCGQKdGnn3rFUd16drkMjzTmo6","asic/202100.json":"https://ipfs.notex.ch/ipfs/QmWA8hPesGzL5Ks6gXRiok4envtFSWcyuNAiEBNaGZNVyR","asic/202103.json":"https://ipfs.notex.ch/ipfs/QmduQW3Bg1o5b7pDa7j4rCAzJza8G2dAuMUHcAwoFdLyAK","asic/202106.json":"https://ipfs.notex.ch/ipfs/QmZRHJaeynDFXUn1XzweNRgpVRwv7WRPdWfq7UW6rTePrZ","asic/202109.json":"https://ipfs.notex.ch/ipfs/QmaawjoS4JNfddyk6GmJUK34hZQxFds7XFfrkpsdW6Xx7z","asic/202112.json":"https://ipfs.notex.ch/ipfs/QmSvyDQ8zX2m2eP5Ezo549DcFzeFiFUSMqT3YYLfFD6vDh","asic/202115.json":"https://ipfs.notex.ch/ipfs/QmdyAj1jkoPtrdAGN1j74UsUN4vVP2BKUHrnybdMHnsr6g","asic/202118.json":"https://ipfs.notex.ch/ipfs/QmWiHNqFcdvzrgeCDKDckzmzxiTELH5AAUdadqJnwJPMrQ","asic/202121.json":"https://ipfs.notex.ch/ipfs/QmWATthhgNQ995dMaUACRBCLQryUWLYZZPyw5hC7i6JC9t","asic/202124.json":"https://ipfs.notex.ch/ipfs/QmSc7b8us4bhryTk4qh9m2ZQzHSLhsLFEdaLy8xjpgFDp4"}');
assert(XPOWER_NFT_REDIRECT, 'missing XPOWER_NFT_REDIRECT env variable');

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
    XPOWER_NFT_ADDRESS_CPU_V1: XPOWER_NFT_ADDRESS_CPU_V1,
    XPOWER_NFT_ADDRESS_GPU_V1: XPOWER_NFT_ADDRESS_GPU_V1,
    XPOWER_NFT_ADDRESS_ASC_V1: XPOWER_NFT_ADDRESS_ASC_V1,
    XPOWER_NFT_ADDRESS_CPU_V2: XPOWER_NFT_ADDRESS_CPU_V2,
    XPOWER_NFT_ADDRESS_GPU_V2: XPOWER_NFT_ADDRESS_GPU_V2,
    XPOWER_NFT_ADDRESS_ASC_V2: XPOWER_NFT_ADDRESS_ASC_V2,
    XPOWER_NFT_REDIRECT
};
