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

const XPOWER_NFT_REDIRECT = JSON.parse(process.env.XPOWER_NFT_REDIRECT ?? '{"asic/202100.json":"https://ipfs.xpowermine.com/ipfs/QmSihiyxGgXhkpHK2WF5Wk5z9cCgD1gU1mBuDAW8Xf7iwP","asic/202103.json":"https://ipfs.xpowermine.com/ipfs/QmSXUdPhtjcaM3gfDPVZHVU6Na88sjNq8MXawxY2zFrduE","asic/202106.json":"https://ipfs.xpowermine.com/ipfs/QmWahjAfSF18hKxV7eDbzVVRAMEpCe2toFHPiR6p6gM7Pn","asic/202109.json":"https://ipfs.xpowermine.com/ipfs/QmdCL5BaxFZXwNRbYZpLkG8LETVRGS8n8rwFYxB2mtmkCv","asic/202112.json":"https://ipfs.xpowermine.com/ipfs/QmQbdoeGKMs4gb82x2tqegbZGgLGc2Y9mFKts6Bi5UAaP3","asic/202115.json":"https://ipfs.xpowermine.com/ipfs/QmZwdHegm8MgZChzfuKnBKQXQagmdP3Tu745mQn5CZLzn2","asic/202118.json":"https://ipfs.xpowermine.com/ipfs/Qma2unMxmd6iDKt4sQPMVfqPx4sXmJSVSyvwwQauapXyBi","asic/202121.json":"https://ipfs.xpowermine.com/ipfs/QmaL8P7wgAT8rgs57GXoVLTBBjXqo3QPajwjwmkLFxH6RR","asic/202124.json":"https://ipfs.xpowermine.com/ipfs/QmYmKxWufPzJBiUNeQkKsBF9UYwoGiBerfkPjGjmUjsB4q","asic/202200.json":"https://ipfs.xpowermine.com/ipfs/QmVbKi5o46A7GxH3LJLkgqZGABu2ra8kUeFVuZ26i6sgFL","asic/202203.json":"https://ipfs.xpowermine.com/ipfs/QmVsm7TGV9JZqSPTeGShwZa8RhRJJKfm2jEuXy2cQzh9QF","asic/202206.json":"https://ipfs.xpowermine.com/ipfs/QmPLk9U7V7DiG2N6wyMJgAFv4QfBk1HimY1Y1mzPwPuATh","asic/202209.json":"https://ipfs.xpowermine.com/ipfs/QmT3keoVc5mJwywWU4hjNDk9iVqrFjXjrmZy48WjouL3zV","asic/202212.json":"https://ipfs.xpowermine.com/ipfs/QmZYyC3rcDhwhsxxL59F9m3sMqAHKuo32ejFq4jitfTmEU","asic/202215.json":"https://ipfs.xpowermine.com/ipfs/QmUFAc2DCseQwGjvjvK3U14VA898NkpMLaf9h6f6SiF9Sy","asic/202218.json":"https://ipfs.xpowermine.com/ipfs/QmVH1jGpEWKTJdwDbRKUQwL7jnavoUF4K8X5ZA8NVXJ25y","asic/202221.json":"https://ipfs.xpowermine.com/ipfs/QmehpTCUW1BvGhcTDtR7DZmapcHSXHNmJr25Fpch4XaXVH","asic/202224.json":"https://ipfs.xpowermine.com/ipfs/QmVc9oh4YUkgz46oPVxmQDXrYGUx1nirhRSZV7N4yijiqV","cpu/202100.json":"https://ipfs.xpowermine.com/ipfs/QmXwSADa7zRwirwsZ6CWSZbWXspvkEpbKx2Rw1zHARfv4J","cpu/202103.json":"https://ipfs.xpowermine.com/ipfs/QmawgH4PPKGrihbfCSt1vtm8Et9uhFV3CVxNaNBhryXf51","cpu/202106.json":"https://ipfs.xpowermine.com/ipfs/QmS21B7EhamX9YS5Gt9tzYL1vRmdMnBFt3rbrkteoWvLfu","cpu/202109.json":"https://ipfs.xpowermine.com/ipfs/QmcTQHez4rpFC1rdd4ZLFrZxvNQc5QR2wfDnMEoK8eWJRQ","cpu/202112.json":"https://ipfs.xpowermine.com/ipfs/QmaLGnKpCXC6doHQKvor9mUEmVGBSrzbqquMsPYD56MEnV","cpu/202115.json":"https://ipfs.xpowermine.com/ipfs/QmZoinczRfEZk1VbMKXKR9EsP3gZKG7vf4HYssgyhqueih","cpu/202118.json":"https://ipfs.xpowermine.com/ipfs/QmctE1jdhmQhcWZi9Y2C5a7LNv7TGwaBXUiTFJ2gPQVB2n","cpu/202121.json":"https://ipfs.xpowermine.com/ipfs/QmNZ5VcKM4hsqPC2A2K3aMniKKZ5eUk9zkups28WhUk1Yp","cpu/202124.json":"https://ipfs.xpowermine.com/ipfs/QmYpT2zoXggpN7aZGKU491DPHPGBiRUuGWZwzoiRxk9Hkx","cpu/202200.json":"https://ipfs.xpowermine.com/ipfs/QmYKi76R1BY2KwN1Hh7Z4GRKAirDNdJrjjntavzsj49cMc","cpu/202203.json":"https://ipfs.xpowermine.com/ipfs/QmQcfEuiXEcszfTorJAGYmEaSHccDaYhbz5Ve2ihcsRx3d","cpu/202206.json":"https://ipfs.xpowermine.com/ipfs/QmNha7EJ1HA57vFkTskinggjt3o5RATvt7mvs3QWzGSSRL","cpu/202209.json":"https://ipfs.xpowermine.com/ipfs/QmbxP2BbasbGjtYQ3hihsiaoytrXcdUpTW7MxrbUmUBX5B","cpu/202212.json":"https://ipfs.xpowermine.com/ipfs/QmdNAYNj3LT4hkj6UM2XNB51yrC4zzkwLaFpLPjtkdZ7gy","cpu/202215.json":"https://ipfs.xpowermine.com/ipfs/QmZGUufWu57hDxRdoh6kQXNeA7DvGYj5HQFEojb6MFcDv7","cpu/202218.json":"https://ipfs.xpowermine.com/ipfs/QmWHCc7PnymsDRd6qUdcgZh11dZWrsec9igMTmxycLpXct","cpu/202221.json":"https://ipfs.xpowermine.com/ipfs/QmaLAjApw7UoBUhu32yUHWL9C264RubafGBkB2VTsg4p4s","cpu/202224.json":"https://ipfs.xpowermine.com/ipfs/QmV3QtaHp51wyNbBC4R58WBnxPmE84rpJJXxwdQnNbgMj7","gpu/202100.json":"https://ipfs.xpowermine.com/ipfs/Qmd7ZMWERbW3549tmJqp6ztmvagfogjHPgz5J8LMDWsmSM","gpu/202103.json":"https://ipfs.xpowermine.com/ipfs/QmaQASUnRnAmtABfz7C7kr14Fg7p8ZNzFDHdaDHn5XdSw4","gpu/202106.json":"https://ipfs.xpowermine.com/ipfs/QmbVcFkwCisFHSivuMuJF7iKaV6m87peQ4CdE8iiyoR4WB","gpu/202109.json":"https://ipfs.xpowermine.com/ipfs/QmZ6dPA2xqQADEvhGNGaPfNjdDLy5EVM3vhaFEThL2sJo3","gpu/202112.json":"https://ipfs.xpowermine.com/ipfs/QmcJg3HhmchSEwAqQHSC6HgSMGkwwf7yyvLixAR9sfFDfo","gpu/202115.json":"https://ipfs.xpowermine.com/ipfs/Qmf84j4W2qgMFKXnkDK1Ykdcqt3BYkErsqYpGXxc7KixFy","gpu/202118.json":"https://ipfs.xpowermine.com/ipfs/QmTN58ZgZqmfitHQXUwoKiaYdRfkWgwe4wQ748VjGCJ2TA","gpu/202121.json":"https://ipfs.xpowermine.com/ipfs/QmYvdTyDLDz5X9FaNDfFBkU3xv15NyAjG5CApK9t3VC1Bp","gpu/202124.json":"https://ipfs.xpowermine.com/ipfs/QmRZbVorCwGnzXParveNY2z3U2AHwF7dWJXeo7koTzdwU1","gpu/202200.json":"https://ipfs.xpowermine.com/ipfs/QmacWmbyiPdYU43FfZvSnsT955dEzTvgUycJYvWac2RhFc","gpu/202203.json":"https://ipfs.xpowermine.com/ipfs/QmfSkdV7Q9Xt9SmpDHLxNmZA46N2YSqJUwJoeaRgsHY5wM","gpu/202206.json":"https://ipfs.xpowermine.com/ipfs/QmWriR8kK3LQNTtxbpgMxbsH38VPMGhj4hepejKRdptmiy","gpu/202209.json":"https://ipfs.xpowermine.com/ipfs/QmQk1CkaUy3oiUd3TqDvJaGdNXLq1eFSxjC38mEETT51ZR","gpu/202212.json":"https://ipfs.xpowermine.com/ipfs/QmW84EfMdv3jbuaEqAykoJ7ynZFF4h6iL7ovazKMzHPpHv","gpu/202215.json":"https://ipfs.xpowermine.com/ipfs/QmSkPZ4UMhwAU15w3dR3oWgWx3FKXuro2yge3fio3o9aPf","gpu/202218.json":"https://ipfs.xpowermine.com/ipfs/QmcyfVtcM96sszsy5bkG2xkQZwehPF5FAaUXFoyx4U7Pma","gpu/202221.json":"https://ipfs.xpowermine.com/ipfs/QmRyX49tPffwX4PL55w1FbCDE3Ldqiq9uPoZkzr2uSvtbF","gpu/202224.json":"https://ipfs.xpowermine.com/ipfs/QmeccwPQdcqBXpwWAQ6vreXnjEHpTCT5e8J3KT9RR8QCZS"}');
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
