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

const XPOWER_ADDRESS_CPU_V2 = process.env.XPOWER_ADDRESS_CPU_V2 ?? '0x52C84043CD9c865236f11d9Fc9F56aa003c1f922';
assert(XPOWER_ADDRESS_CPU_V2, 'missing XPOWER_ADDRESS_CPU_V2 env variable');
const XPOWER_ADDRESS_GPU_V2 = process.env.XPOWER_ADDRESS_GPU_V2 ?? '0x5aa01B3b5877255cE50cc55e8986a7a5fe29C70e';
assert(XPOWER_ADDRESS_GPU_V2, 'missing XPOWER_ADDRESS_GPU_V2 env variable');
const XPOWER_ADDRESS_ASC_V2 = process.env.XPOWER_ADDRESS_ASC_V2 ?? '0x4Ac1d98D9cEF99EC6546dEd4Bd550b0b287aaD6D';
assert(XPOWER_ADDRESS_ASC_V2, 'missing XPOWER_ADDRESS_ASC_V2 env variable');

const XPOWER_ADDRESS_CPU_V3 = process.env.XPOWER_ADDRESS_CPU_V3 ?? '0xa4DfF80B4a1D748BF28BC4A271eD834689Ea3407';
assert(XPOWER_ADDRESS_CPU_V3, 'missing XPOWER_ADDRESS_CPU_V3 env variable');
const XPOWER_ADDRESS_GPU_V3 = process.env.XPOWER_ADDRESS_GPU_V3 ?? '0x95CA0a568236fC7413Cd2b794A7da24422c2BBb6';
assert(XPOWER_ADDRESS_GPU_V3, 'missing XPOWER_ADDRESS_GPU_V3 env variable');
const XPOWER_ADDRESS_ASC_V3 = process.env.XPOWER_ADDRESS_ASC_V3 ?? '0xE3573540ab8A1C4c754Fd958Dc1db39BBE81b208';
assert(XPOWER_ADDRESS_ASC_V3, 'missing XPOWER_ADDRESS_ASC_V3 env variable');

const XPOWER_SYMBOL_CPU_V3 = process.env.XPOWER_SYMBOL_CPU_V3 ?? 'XPOW.CPU';
assert(XPOWER_SYMBOL_CPU_V3, 'missing XPOWER_SYMBOL_CPU_V3 env variable');
const XPOWER_SYMBOL_GPU_V3 = process.env.XPOWER_SYMBOL_GPU_V3 ?? 'XPOW.GPU';
assert(XPOWER_SYMBOL_GPU_V3, 'missing XPOWER_SYMBOL_GPU_V3 env variable');
const XPOWER_SYMBOL_ASC_V3 = process.env.XPOWER_SYMBOL_ASC_V3 ?? 'XPOW.ASIC';
assert(XPOWER_SYMBOL_ASC_V3, 'missing XPOWER_SYMBOL_ASC_V3 env variable');

const XPOWER_DECIMALS_CPU_V3 = process.env.XPOWER_DECIMALS_CPU_V3 ?? '0';
assert(XPOWER_DECIMALS_CPU_V3, 'missing XPOWER_DECIMALS_CPU_V3 env variable');
const XPOWER_DECIMALS_GPU_V3 = process.env.XPOWER_DECIMALS_GPU_V3 ?? '0';
assert(XPOWER_DECIMALS_GPU_V3, 'missing XPOWER_DECIMALS_GPU_V3 env variable');
const XPOWER_DECIMALS_ASC_V3 = process.env.XPOWER_DECIMALS_ASC_V3 ?? '0';
assert(XPOWER_DECIMALS_ASC_V3, 'missing XPOWER_DECIMALS_ASC_V3 env variable');

const XPOWER_IMAGE_CPU_V3 = process.env.XPOWER_IMAGE_CPU_V3 ?? "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-lightning-fill' viewBox='0 0 16 16'%3E%3Cstyle%3Epath %7B fill: yellow; stroke: black; %7D%3C/style%3E%3Cpath d='M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z'/%3E%3C/svg%3E";
assert(typeof XPOWER_IMAGE_CPU_V3 === 'string', 'missing XPOWER_IMAGE_CPU_V3 env variable');
const XPOWER_IMAGE_GPU_V3 = process.env.XPOWER_IMAGE_GPU_V3 ?? "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-lightning-fill' viewBox='0 0 16 16'%3E%3Cstyle%3Epath %7B fill: lime; stroke: black; %7D%3C/style%3E%3Cpath d='M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z'/%3E%3C/svg%3E";
assert(typeof XPOWER_IMAGE_GPU_V3 === 'string', 'missing XPOWER_IMAGE_GPU_V3 env variable');
const XPOWER_IMAGE_ASC_V3 = process.env.XPOWER_IMAGE_ASC_V3 ?? "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-lightning-fill' viewBox='0 0 16 16'%3E%3Cstyle%3Epath %7B fill: cyan; stroke: black; %7D%3C/style%3E%3Cpath d='M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z'/%3E%3C/svg%3E";
assert(typeof XPOWER_IMAGE_ASC_V3 === 'string', 'missing XPOWER_IMAGE_ASC_V3 env variable');

const XPOWER_NFT_ADDRESS_CPU_V2 = process.env.XPOWER_NFT_ADDRESS_CPU_V2 ?? '0x7B4982e1F7ee384F206417Fb851a1EB143c513F9';
assert(XPOWER_NFT_ADDRESS_CPU_V2, 'missing XPOWER_NFT_ADDRESS_CPU_V2 env variable');
const XPOWER_NFT_ADDRESS_GPU_V2 = process.env.XPOWER_NFT_ADDRESS_GPU_V2 ?? '0xB8a934dcb74d0E3d1DF6Bce0faC12cD8B18801eD';
assert(XPOWER_NFT_ADDRESS_GPU_V2, 'missing XPOWER_NFT_ADDRESS_GPU_V2 env variable');
const XPOWER_NFT_ADDRESS_ASC_V2 = process.env.XPOWER_NFT_ADDRESS_ASC_V2 ?? '0xe17bDC68168d07c1776c362d596adaa5d52A1De7';
assert(XPOWER_NFT_ADDRESS_ASC_V2, 'missing XPOWER_NFT_ADDRESS_ASC_V2 env variable');

const XPOWER_NFT_ADDRESS_CPU_V3 = process.env.XPOWER_NFT_ADDRESS_CPU_V3 ?? '0x768AF58E63775354938e9F3FEdB764F601c038b4';
assert(XPOWER_NFT_ADDRESS_CPU_V3, 'missing XPOWER_NFT_ADDRESS_CPU_V3 env variable');
const XPOWER_NFT_ADDRESS_GPU_V3 = process.env.XPOWER_NFT_ADDRESS_GPU_V3 ?? '0xCB5bf91D236ebe6eF6AE57342570884234bd11Cc';
assert(XPOWER_NFT_ADDRESS_GPU_V3, 'missing XPOWER_NFT_ADDRESS_GPU_V3 env variable');
const XPOWER_NFT_ADDRESS_ASC_V3 = process.env.XPOWER_NFT_ADDRESS_ASC_V3 ?? '0xc5812E2F22177682ad9731330814F0444Ac23E9e';
assert(XPOWER_NFT_ADDRESS_ASC_V3, 'missing XPOWER_NFT_ADDRESS_ASC_V3 env variable');

const XPOWER_NFT_REDIRECT = JSON.parse(process.env.XPOWER_NFT_REDIRECT ?? '{"asic/202100.json":"https://ipfs.xpowermine.com/ipfs/QmSihiyxGgXhkpHK2WF5Wk5z9cCgD1gU1mBuDAW8Xf7iwP","asic/202103.json":"https://ipfs.xpowermine.com/ipfs/QmSXUdPhtjcaM3gfDPVZHVU6Na88sjNq8MXawxY2zFrduE","asic/202106.json":"https://ipfs.xpowermine.com/ipfs/QmWahjAfSF18hKxV7eDbzVVRAMEpCe2toFHPiR6p6gM7Pn","asic/202109.json":"https://ipfs.xpowermine.com/ipfs/QmdCL5BaxFZXwNRbYZpLkG8LETVRGS8n8rwFYxB2mtmkCv","asic/202112.json":"https://ipfs.xpowermine.com/ipfs/QmQbdoeGKMs4gb82x2tqegbZGgLGc2Y9mFKts6Bi5UAaP3","asic/202115.json":"https://ipfs.xpowermine.com/ipfs/QmZwdHegm8MgZChzfuKnBKQXQagmdP3Tu745mQn5CZLzn2","asic/202118.json":"https://ipfs.xpowermine.com/ipfs/Qma2unMxmd6iDKt4sQPMVfqPx4sXmJSVSyvwwQauapXyBi","asic/202121.json":"https://ipfs.xpowermine.com/ipfs/QmaL8P7wgAT8rgs57GXoVLTBBjXqo3QPajwjwmkLFxH6RR","asic/202124.json":"https://ipfs.xpowermine.com/ipfs/QmYmKxWufPzJBiUNeQkKsBF9UYwoGiBerfkPjGjmUjsB4q","asic/202200.json":"https://ipfs.xpowermine.com/ipfs/QmVbKi5o46A7GxH3LJLkgqZGABu2ra8kUeFVuZ26i6sgFL","asic/202203.json":"https://ipfs.xpowermine.com/ipfs/QmVsm7TGV9JZqSPTeGShwZa8RhRJJKfm2jEuXy2cQzh9QF","asic/202206.json":"https://ipfs.xpowermine.com/ipfs/QmPLk9U7V7DiG2N6wyMJgAFv4QfBk1HimY1Y1mzPwPuATh","asic/202209.json":"https://ipfs.xpowermine.com/ipfs/QmT3keoVc5mJwywWU4hjNDk9iVqrFjXjrmZy48WjouL3zV","asic/202212.json":"https://ipfs.xpowermine.com/ipfs/QmZYyC3rcDhwhsxxL59F9m3sMqAHKuo32ejFq4jitfTmEU","asic/202215.json":"https://ipfs.xpowermine.com/ipfs/QmUFAc2DCseQwGjvjvK3U14VA898NkpMLaf9h6f6SiF9Sy","asic/202218.json":"https://ipfs.xpowermine.com/ipfs/QmVH1jGpEWKTJdwDbRKUQwL7jnavoUF4K8X5ZA8NVXJ25y","asic/202221.json":"https://ipfs.xpowermine.com/ipfs/QmehpTCUW1BvGhcTDtR7DZmapcHSXHNmJr25Fpch4XaXVH","asic/202224.json":"https://ipfs.xpowermine.com/ipfs/QmVc9oh4YUkgz46oPVxmQDXrYGUx1nirhRSZV7N4yijiqV","cpu/202100.json":"https://ipfs.xpowermine.com/ipfs/QmXwSADa7zRwirwsZ6CWSZbWXspvkEpbKx2Rw1zHARfv4J","cpu/202103.json":"https://ipfs.xpowermine.com/ipfs/QmawgH4PPKGrihbfCSt1vtm8Et9uhFV3CVxNaNBhryXf51","cpu/202106.json":"https://ipfs.xpowermine.com/ipfs/QmS21B7EhamX9YS5Gt9tzYL1vRmdMnBFt3rbrkteoWvLfu","cpu/202109.json":"https://ipfs.xpowermine.com/ipfs/QmcTQHez4rpFC1rdd4ZLFrZxvNQc5QR2wfDnMEoK8eWJRQ","cpu/202112.json":"https://ipfs.xpowermine.com/ipfs/QmaLGnKpCXC6doHQKvor9mUEmVGBSrzbqquMsPYD56MEnV","cpu/202115.json":"https://ipfs.xpowermine.com/ipfs/QmZoinczRfEZk1VbMKXKR9EsP3gZKG7vf4HYssgyhqueih","cpu/202118.json":"https://ipfs.xpowermine.com/ipfs/QmctE1jdhmQhcWZi9Y2C5a7LNv7TGwaBXUiTFJ2gPQVB2n","cpu/202121.json":"https://ipfs.xpowermine.com/ipfs/QmNZ5VcKM4hsqPC2A2K3aMniKKZ5eUk9zkups28WhUk1Yp","cpu/202124.json":"https://ipfs.xpowermine.com/ipfs/QmYpT2zoXggpN7aZGKU491DPHPGBiRUuGWZwzoiRxk9Hkx","cpu/202200.json":"https://ipfs.xpowermine.com/ipfs/QmYKi76R1BY2KwN1Hh7Z4GRKAirDNdJrjjntavzsj49cMc","cpu/202203.json":"https://ipfs.xpowermine.com/ipfs/QmQcfEuiXEcszfTorJAGYmEaSHccDaYhbz5Ve2ihcsRx3d","cpu/202206.json":"https://ipfs.xpowermine.com/ipfs/QmNha7EJ1HA57vFkTskinggjt3o5RATvt7mvs3QWzGSSRL","cpu/202209.json":"https://ipfs.xpowermine.com/ipfs/QmbxP2BbasbGjtYQ3hihsiaoytrXcdUpTW7MxrbUmUBX5B","cpu/202212.json":"https://ipfs.xpowermine.com/ipfs/QmdNAYNj3LT4hkj6UM2XNB51yrC4zzkwLaFpLPjtkdZ7gy","cpu/202215.json":"https://ipfs.xpowermine.com/ipfs/QmZGUufWu57hDxRdoh6kQXNeA7DvGYj5HQFEojb6MFcDv7","cpu/202218.json":"https://ipfs.xpowermine.com/ipfs/QmWHCc7PnymsDRd6qUdcgZh11dZWrsec9igMTmxycLpXct","cpu/202221.json":"https://ipfs.xpowermine.com/ipfs/QmaLAjApw7UoBUhu32yUHWL9C264RubafGBkB2VTsg4p4s","cpu/202224.json":"https://ipfs.xpowermine.com/ipfs/QmV3QtaHp51wyNbBC4R58WBnxPmE84rpJJXxwdQnNbgMj7","gpu/202100.json":"https://ipfs.xpowermine.com/ipfs/Qmd7ZMWERbW3549tmJqp6ztmvagfogjHPgz5J8LMDWsmSM","gpu/202103.json":"https://ipfs.xpowermine.com/ipfs/QmaQASUnRnAmtABfz7C7kr14Fg7p8ZNzFDHdaDHn5XdSw4","gpu/202106.json":"https://ipfs.xpowermine.com/ipfs/QmbVcFkwCisFHSivuMuJF7iKaV6m87peQ4CdE8iiyoR4WB","gpu/202109.json":"https://ipfs.xpowermine.com/ipfs/QmZ6dPA2xqQADEvhGNGaPfNjdDLy5EVM3vhaFEThL2sJo3","gpu/202112.json":"https://ipfs.xpowermine.com/ipfs/QmcJg3HhmchSEwAqQHSC6HgSMGkwwf7yyvLixAR9sfFDfo","gpu/202115.json":"https://ipfs.xpowermine.com/ipfs/Qmf84j4W2qgMFKXnkDK1Ykdcqt3BYkErsqYpGXxc7KixFy","gpu/202118.json":"https://ipfs.xpowermine.com/ipfs/QmTN58ZgZqmfitHQXUwoKiaYdRfkWgwe4wQ748VjGCJ2TA","gpu/202121.json":"https://ipfs.xpowermine.com/ipfs/QmYvdTyDLDz5X9FaNDfFBkU3xv15NyAjG5CApK9t3VC1Bp","gpu/202124.json":"https://ipfs.xpowermine.com/ipfs/QmRZbVorCwGnzXParveNY2z3U2AHwF7dWJXeo7koTzdwU1","gpu/202200.json":"https://ipfs.xpowermine.com/ipfs/QmacWmbyiPdYU43FfZvSnsT955dEzTvgUycJYvWac2RhFc","gpu/202203.json":"https://ipfs.xpowermine.com/ipfs/QmfSkdV7Q9Xt9SmpDHLxNmZA46N2YSqJUwJoeaRgsHY5wM","gpu/202206.json":"https://ipfs.xpowermine.com/ipfs/QmWriR8kK3LQNTtxbpgMxbsH38VPMGhj4hepejKRdptmiy","gpu/202209.json":"https://ipfs.xpowermine.com/ipfs/QmQk1CkaUy3oiUd3TqDvJaGdNXLq1eFSxjC38mEETT51ZR","gpu/202212.json":"https://ipfs.xpowermine.com/ipfs/QmW84EfMdv3jbuaEqAykoJ7ynZFF4h6iL7ovazKMzHPpHv","gpu/202215.json":"https://ipfs.xpowermine.com/ipfs/QmSkPZ4UMhwAU15w3dR3oWgWx3FKXuro2yge3fio3o9aPf","gpu/202218.json":"https://ipfs.xpowermine.com/ipfs/QmcyfVtcM96sszsy5bkG2xkQZwehPF5FAaUXFoyx4U7Pma","gpu/202221.json":"https://ipfs.xpowermine.com/ipfs/QmRyX49tPffwX4PL55w1FbCDE3Ldqiq9uPoZkzr2uSvtbF","gpu/202224.json":"https://ipfs.xpowermine.com/ipfs/QmeccwPQdcqBXpwWAQ6vreXnjEHpTCT5e8J3KT9RR8QCZS"}');
assert(XPOWER_NFT_REDIRECT, 'missing XPOWER_NFT_REDIRECT env variable');

export default {
    IPFS_GATEWAY,
    MD_ABOUT_URL,
    UI_COPYRIGHT,
    UI_PERSISTENCE,
    UI_MINING_SPEED,
    XPOWER_ADDRESS_CPU_V2: XPOWER_ADDRESS_CPU_V2,
    XPOWER_ADDRESS_GPU_V2: XPOWER_ADDRESS_GPU_V2,
    XPOWER_ADDRESS_ASC_V2: XPOWER_ADDRESS_ASC_V2,
    XPOWER_ADDRESS_CPU_V3,
    XPOWER_ADDRESS_GPU_V3,
    XPOWER_ADDRESS_ASC_V3,
    XPOWER_SYMBOL_CPU_V2: XPOWER_SYMBOL_CPU_V3,
    XPOWER_SYMBOL_GPU_V2: XPOWER_SYMBOL_GPU_V3,
    XPOWER_SYMBOL_ASC_V2: XPOWER_SYMBOL_ASC_V3,
    XPOWER_SYMBOL_CPU_V3,
    XPOWER_SYMBOL_GPU_V3,
    XPOWER_SYMBOL_ASC_V3,
    XPOWER_DECIMALS_CPU_V2: XPOWER_DECIMALS_CPU_V3,
    XPOWER_DECIMALS_GPU_V2: XPOWER_DECIMALS_GPU_V3,
    XPOWER_DECIMALS_ASC_V2: XPOWER_DECIMALS_ASC_V3,
    XPOWER_DECIMALS_CPU_V3,
    XPOWER_DECIMALS_GPU_V3,
    XPOWER_DECIMALS_ASC_V3,
    XPOWER_IMAGE_CPU_V2: XPOWER_IMAGE_CPU_V3,
    XPOWER_IMAGE_GPU_V2: XPOWER_IMAGE_GPU_V3,
    XPOWER_IMAGE_ASC_V2: XPOWER_IMAGE_ASC_V3,
    XPOWER_IMAGE_CPU_V3,
    XPOWER_IMAGE_GPU_V3,
    XPOWER_IMAGE_ASC_V3,
    XPOWER_NFT_ADDRESS_CPU_V2: XPOWER_NFT_ADDRESS_CPU_V2,
    XPOWER_NFT_ADDRESS_GPU_V2: XPOWER_NFT_ADDRESS_GPU_V2,
    XPOWER_NFT_ADDRESS_ASC_V2: XPOWER_NFT_ADDRESS_ASC_V2,
    XPOWER_NFT_ADDRESS_CPU_V3,
    XPOWER_NFT_ADDRESS_GPU_V3,
    XPOWER_NFT_ADDRESS_ASC_V3,
    XPOWER_NFT_REDIRECT
};
