import { readFileSync as read } from 'fs';
import dotenv from 'dotenv';
import check from 'assert';
dotenv.config();

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
const XPOW_MOE_V1a = process.env.XPOW_MOE_V1a ?? '0x74A68215AEdf59f317a23E87C13B848a292F27A4';
check(XPOW_MOE_V1a, 'missing env XPOW_MOE_V1a variable');
const XPOW_MOE_V2a = process.env.XPOW_MOE_V2a ?? '0xc63e3B6D0a2d382A74B13D19426b65C0aa5F3648';
check(XPOW_MOE_V2a, 'missing env XPOW_MOE_V2a variable');
const XPOW_MOE_V3a = process.env.XPOW_MOE_V3a ?? '0x2c5C3374c216BD8C36d598C40d990Eb2a2250cCD';
check(XPOW_MOE_V3a, 'missing env XPOW_MOE_V3a variable');
const XPOW_MOE_V4a = process.env.XPOW_MOE_V4a ?? '0x1Ab7b945f50D33cF387Fb74eB5f7a092aD03dc81';
check(XPOW_MOE_V4a, 'missing env XPOW_MOE_V4a variable');
const XPOW_MOE_V5a = process.env.XPOW_MOE_V5a ?? '0x4353CaC32924b45C01c2880F65E75B3795DDFd60';
check(XPOW_MOE_V5a, 'missing env XPOW_MOE_V5a variable');
const XPOW_MOE_V5b = process.env.XPOW_MOE_V5b ?? '0xF0F11D6d86346C541bA2eF2f48ad7A58255Cd52B';
check(XPOW_MOE_V5b, 'missing env XPOW_MOE_V5b variable');
const XPOW_MOE_V5c = process.env.XPOW_MOE_V5c ?? '0x0f310C35C006a86BD0Df6595B1856ce8Ef06Bbd3';
check(XPOW_MOE_V5c, 'missing env XPOW_MOE_V5c variable');
const XPOW_MOE_V6a = process.env.XPOW_MOE_V6a ?? '0x551b372ad7A7b85BaB113B273fd4c7924dfF4071';
check(XPOW_MOE_V6a, 'missing env XPOW_MOE_V6a variable');
const XPOW_MOE_V6b = process.env.XPOW_MOE_V6b ?? '0xC18dBF3Ebe65146B60b70fEfb686E621267Fe877';
check(XPOW_MOE_V6b, 'missing env XPOW_MOE_V6b variable');
const XPOW_MOE_V6c = process.env.XPOW_MOE_V6c ?? '0x1e6AB3d65Ad983202ebD92575aA5a168D0D6EBC9';
check(XPOW_MOE_V6c, 'missing env XPOW_MOE_V6c variable');
const XPOW_MOE_V7a = process.env.XPOW_MOE_V7a ?? '0xd8bF63eD3384f32d6CD5Af9B72299AadB7872992';
check(XPOW_MOE_V7a, 'missing env XPOW_MOE_V7a variable');
const XPOW_MOE_V7b = process.env.XPOW_MOE_V7b ?? '0x8dd3fB456f8d36191D94572802D7715a0665106B';
check(XPOW_MOE_V7b, 'missing env XPOW_MOE_V7b variable');
const XPOW_MOE_V7c = process.env.XPOW_MOE_V7c ?? '0xe2Dc552ab6848C2126229554ab3411911C28547b';
check(XPOW_MOE_V7c, 'missing env XPOW_MOE_V7c variable');
const XPOW_MOE_V8a = process.env.XPOW_MOE_V8a ?? '0x28ADA872f3deD545A275c3802b731F44D1883f73';
check(XPOW_MOE_V8a, 'missing env XPOW_MOE_V8a variable');
const XPOW_MOE_V8b = process.env.XPOW_MOE_V8b ?? '0x706c35f32C4a1bb783C4C83048467ED9c451152E';
check(XPOW_MOE_V8b, 'missing env XPOW_MOE_V8b variable');
const XPOW_MOE_V8c = process.env.XPOW_MOE_V8c ?? '0xE1448F03c097eB487560B93b4B5Bc536faFF94ad';
check(XPOW_MOE_V8c, 'missing env XPOW_MOE_V8c variable');
// NFT contract addresses
const XPOW_NFT_V2a = process.env.XPOW_NFT_V2a ?? '0x92E332cc5E9772f18e15B9ab72E2Dc86F5336d2b';
check(XPOW_NFT_V2a, 'missing env XPOW_NFT_V2a variable');
const XPOW_NFT_V2b = process.env.XPOW_NFT_V2b ?? '0x430A941564D6f9cDFb171d59Dc359F01035E7537';
check(XPOW_NFT_V2b, 'missing env XPOW_NFT_V2b variable');
const XPOW_NFT_V2c = process.env.XPOW_NFT_V2c ?? '0x3049AF79770b127814B08aE80b69F3Cf62433a74';
check(XPOW_NFT_V2c, 'missing env XPOW_NFT_V2c variable');
const XPOW_NFT_V3a = process.env.XPOW_NFT_V3a ?? '0x3e56F51369a4652095b9e45541BA4373526D5722';
check(XPOW_NFT_V3a, 'missing env XPOW_NFT_V3a variable');
const XPOW_NFT_V3b = process.env.XPOW_NFT_V3b ?? '0x8De2e43282fE87C8f04387b6511615EDf86Af5e4';
check(XPOW_NFT_V3b, 'missing env XPOW_NFT_V3b variable');
const XPOW_NFT_V4a = process.env.XPOW_NFT_V4a ?? '0x74aF5454E7A3b2A8D0F452b20b770d7d547e6A11';
check(XPOW_NFT_V4a, 'missing env XPOW_NFT_V4a variable');
const XPOW_NFT_V5a = process.env.XPOW_NFT_V5a ?? '0x8D558f21e745e84a818A6E0879294AE98423717a';
check(XPOW_NFT_V5a, 'missing env XPOW_NFT_V5a variable');
const XPOW_NFT_V5b = process.env.XPOW_NFT_V5b ?? '0x7fD7c89Caa8C0A071ab16f0e3fb95F9FE30dC3de';
check(XPOW_NFT_V5b, 'missing env XPOW_NFT_V5b variable');
const XPOW_NFT_V5c = process.env.XPOW_NFT_V5c ?? '0x67F6a112300455f00d174C0EF31083A5e0AD3cB3';
check(XPOW_NFT_V5c, 'missing env XPOW_NFT_V5c variable');
const XPOW_NFT_V6a = process.env.XPOW_NFT_V6a ?? '0x26569E92c82b474A5E492d8b47A3aA4CeEB36BCc';
check(XPOW_NFT_V6a, 'missing env XPOW_NFT_V6a variable');
const XPOW_NFT_V6b = process.env.XPOW_NFT_V6b ?? '0xF96E6A076c7C4F5F61843Bf5bE2C75D58567806A';
check(XPOW_NFT_V6b, 'missing env XPOW_NFT_V6b variable');
const XPOW_NFT_V6c = process.env.XPOW_NFT_V6c ?? '0x566533a903732dB0Af1DF53eFA388d340DD042FE';
check(XPOW_NFT_V6c, 'missing env XPOW_NFT_V6c variable');
const XPOW_NFT_V7a = process.env.XPOW_NFT_V7a ?? '0x985Ec408b076F8baC5a4D07FdC741a00c09B12c8';
check(XPOW_NFT_V7a, 'missing env XPOW_NFT_V7a variable');
const XPOW_NFT_V7b = process.env.XPOW_NFT_V7b ?? '0x4D4a28104ccD7dd17761f903e20388f3b3F5528E';
check(XPOW_NFT_V7b, 'missing env XPOW_NFT_V7b variable');
const XPOW_NFT_V7c = process.env.XPOW_NFT_V7c ?? '0x7dD4BcE782D4160805ce54d5a222a2266130dE29';
check(XPOW_NFT_V7c, 'missing env XPOW_NFT_V7c variable');
const XPOW_NFT_V8a = process.env.XPOW_NFT_V8a ?? '0xd1c9Fa13c6828a24De26c92aDCC097780b285020';
check(XPOW_NFT_V8a, 'missing env XPOW_NFT_V8a variable');
const XPOW_NFT_V8b = process.env.XPOW_NFT_V8b ?? '0x49366B17Bb038F1FA091cEaa3D7EFD5741f87BDE';
check(XPOW_NFT_V8b, 'missing env XPOW_NFT_V8b variable');
const XPOW_NFT_V8c = process.env.XPOW_NFT_V8c ?? '0x63a4DA9D755e273000170764407F9feD5E305095';
check(XPOW_NFT_V8c, 'missing env XPOW_NFT_V8c variable');
// PPT contract addresses
const XPOW_PPT_V4a = process.env.XPOW_PPT_V4a ?? '0xd4385Fbe9A8334162742254947858381EdcefdCe';
check(XPOW_PPT_V4a, 'missing env XPOW_PPT_V4a variable');
const XPOW_PPT_V5a = process.env.XPOW_PPT_V5a ?? '0x8FDE6D6bAb0D6557E6Ff923091A0767016631378';
check(XPOW_PPT_V5a, 'missing env XPOW_PPT_V5a variable');
const XPOW_PPT_V5b = process.env.XPOW_PPT_V5b ?? '0x807cE552003C2b2358C6bE2656Cc5234EC538d46';
check(XPOW_PPT_V5b, 'missing env XPOW_PPT_V5b variable');
const XPOW_PPT_V5c = process.env.XPOW_PPT_V5c ?? '0x098E7BEc9Aea1938Ee769b111Ab8BB56d22CFf02';
check(XPOW_PPT_V5c, 'missing env XPOW_PPT_V5c variable');
const XPOW_PPT_V6a = process.env.XPOW_PPT_V6a ?? '0x72290cbd47988be1546362C7D57EACDcdd01F052';
check(XPOW_PPT_V6a, 'missing env XPOW_PPT_V6a variable');
const XPOW_PPT_V6b = process.env.XPOW_PPT_V6b ?? '0xB8aD9099a232E142A5E3Cc2DdaEcD8781d55D456';
check(XPOW_PPT_V6b, 'missing env XPOW_PPT_V6b variable');
const XPOW_PPT_V6c = process.env.XPOW_PPT_V6c ?? '0x93a0929477187271C38cC991F5E355e2BEcd09a6';
check(XPOW_PPT_V6c, 'missing env XPOW_PPT_V6c variable');
const XPOW_PPT_V7a = process.env.XPOW_PPT_V7a ?? '0x68dB5e6Bf3f5C6041C3135eE18B27E07C12A9bba';
check(XPOW_PPT_V7a, 'missing env XPOW_PPT_V7a variable');
const XPOW_PPT_V7b = process.env.XPOW_PPT_V7b ?? '0x5a8A600D852Ee477891aC9B71794e850323aAf60';
check(XPOW_PPT_V7b, 'missing env XPOW_PPT_V7b variable');
const XPOW_PPT_V7c = process.env.XPOW_PPT_V7c ?? '0xe97780bA3b826980E6B40921Ae81566Ae5c1da35';
check(XPOW_PPT_V7c, 'missing env XPOW_PPT_V7c variable');
const XPOW_PPT_V8a = process.env.XPOW_PPT_V8a ?? '0x1F859150A2a6e8642c086eb4C23FE69481E14607';
check(XPOW_PPT_V8a, 'missing env XPOW_PPT_V8a variable');
const XPOW_PPT_V8b = process.env.XPOW_PPT_V8b ?? '0x64CE57850C2F15944c7988F60e6C5eFd9037B09A';
check(XPOW_PPT_V8b, 'missing env XPOW_PPT_V8b variable');
const XPOW_PPT_V8c = process.env.XPOW_PPT_V8c ?? '0x360aE2A496aC20859B838B670A9a7a22D40F200D';
check(XPOW_PPT_V8c, 'missing env XPOW_PPT_V8c variable');
// SOV contract addresses
const XPOW_SOV_V5a = process.env.XPOW_SOV_V5a ?? '0x411c1aB1e4CcD16A0b6556C625CAF5F556580995';
check(XPOW_SOV_V5a, 'missing env XPOW_SOV_V5a variable');
const XPOW_SOV_V5b = process.env.XPOW_SOV_V5b ?? '0x961359B67142D4Fc86b65A50FdC2B006a0439ca6';
check(XPOW_SOV_V5b, 'missing env XPOW_SOV_V5b variable');
const XPOW_SOV_V5c = process.env.XPOW_SOV_V5c ?? '0x42Fa90Abba2Acd3b064Dd3F29F99123Fc68fDDE3';
check(XPOW_SOV_V5c, 'missing env XPOW_SOV_V5c variable');
const XPOW_SOV_V6a = process.env.XPOW_SOV_V6a ?? '0xa63fba872931588e70a2CB4Aaf94C34b78E17922';
check(XPOW_SOV_V6a, 'missing env XPOW_SOV_V6a variable');
const XPOW_SOV_V6b = process.env.XPOW_SOV_V6b ?? '0xB57Ef0D6D4765CEBD70222c9c92F0a789174b5E4';
check(XPOW_SOV_V6b, 'missing env XPOW_SOV_V6b variable');
const XPOW_SOV_V6c = process.env.XPOW_SOV_V6c ?? '0xBF2f5179E3159E6860ddBFc6d6Ce83c3c586cF50';
check(XPOW_SOV_V6c, 'missing env XPOW_SOV_V6c variable');
const XPOW_SOV_V7a = process.env.XPOW_SOV_V7a ?? '0x7a5F2225a501039Cedd5CaD2EF5E528ab00B6790';
check(XPOW_SOV_V7a, 'missing env XPOW_SOV_V7a variable');
const XPOW_SOV_V7b = process.env.XPOW_SOV_V7b ?? '0x5ea0AFe9002C76956A3fc70df36aD2e5cCF4E3da';
check(XPOW_SOV_V7b, 'missing env XPOW_SOV_V7b variable');
const XPOW_SOV_V7c = process.env.XPOW_SOV_V7c ?? '0xFecbB287042F57BaC758Ec606C5AeD3A040aBeF8';
check(XPOW_SOV_V7c, 'missing env XPOW_SOV_V7c variable');
const XPOW_SOV_V8a = process.env.XPOW_SOV_V8a ?? '0xac1feC2e8bE3E2fd053e07780AFe77fac3e3bad9';
check(XPOW_SOV_V8a, 'missing env XPOW_SOV_V8a variable');
const XPOW_SOV_V8b = process.env.XPOW_SOV_V8b ?? '0x5F64506267Dac813D566597403304930a05cb79e';
check(XPOW_SOV_V8b, 'missing env XPOW_SOV_V8b variable');
const XPOW_SOV_V8c = process.env.XPOW_SOV_V8c ?? '0xc59bC469E5D4C99f1946F578DD5DE6bDa0E20Bf6';
check(XPOW_SOV_V8c, 'missing env XPOW_SOV_V8c variable');
// MOE treasury contract addresses
const XPOW_MTY_V4a = process.env.XPOW_MTY_V4a ?? '0x5823605b4d9548124E3a01f011d0834982D2b4fc';
check(XPOW_MTY_V4a, 'missing env XPOW_MTY_V4a variable');
const XPOW_MTY_V5a = process.env.XPOW_MTY_V5a ?? '0x1dd061234744088C36B26E81eC4c9c729507fF28';
check(XPOW_MTY_V5a, 'missing env XPOW_MTY_V5a variable');
const XPOW_MTY_V5b = process.env.XPOW_MTY_V5b ?? '0x442d629dd3028edF4eFCC2aaFfF00F9D7d1a7470';
check(XPOW_MTY_V5b, 'missing env XPOW_MTY_V5b variable');
const XPOW_MTY_V5c = process.env.XPOW_MTY_V5c ?? '0x10a9AC9Ab982F79572Cd186eBeE64148f2B268A7';
check(XPOW_MTY_V5c, 'missing env XPOW_MTY_V5c variable');
const XPOW_MTY_V6a = process.env.XPOW_MTY_V6a ?? '0xFCCDb91E5f6940A621a90aF65cA1d34F277f079B';
check(XPOW_MTY_V6a, 'missing env XPOW_MTY_V6a variable');
const XPOW_MTY_V6b = process.env.XPOW_MTY_V6b ?? '0x84277728d467f8E162eDdEd872070e19c40a475a';
check(XPOW_MTY_V6b, 'missing env XPOW_MTY_V6b variable');
const XPOW_MTY_V6c = process.env.XPOW_MTY_V6c ?? '0x46cDD46139d488a4185Dd69cf78FEE18E5eaAc48';
check(XPOW_MTY_V6c, 'missing env XPOW_MTY_V6c variable');
const XPOW_MTY_V7a = process.env.XPOW_MTY_V7a ?? '0xa4842F0050495542b86cF04528f7C98e11be4Bea';
check(XPOW_MTY_V7a, 'missing env XPOW_MTY_V7a variable');
const XPOW_MTY_V7b = process.env.XPOW_MTY_V7b ?? '0x3E7AB70A21027d35D57A2b0E47450305f06b2823';
check(XPOW_MTY_V7b, 'missing env XPOW_MTY_V7b variable');
const XPOW_MTY_V7c = process.env.XPOW_MTY_V7c ?? '0xada21f9F5b87aA5785C11FbbC5615bC7C8F66A77';
check(XPOW_MTY_V7c, 'missing env XPOW_MTY_V7c variable');
const XPOW_MTY_V8a = process.env.XPOW_MTY_V8a ?? '0x54220D8c2B1e8E24458864316d93c1F7Bf860243';
check(XPOW_MTY_V8a, 'missing env XPOW_MTY_V8a variable');
const XPOW_MTY_V8b = process.env.XPOW_MTY_V8b ?? '0x48Bc85af59b1271C449F6450bd9ff6B45cdC5391';
check(XPOW_MTY_V8b, 'missing env XPOW_MTY_V8b variable');
const XPOW_MTY_V8c = process.env.XPOW_MTY_V8c ?? '0x35Bf8180d301D02cBF794507Cb1f8AF0B6a04B41';
check(XPOW_MTY_V8c, 'missing env XPOW_MTY_V8c variable');
// PPT treasury contract addresses
const XPOW_PTY_V4a = process.env.XPOW_PTY_V4a ?? '0xEe231E251b5A422cCF9514fAc1362A0a06463CeD';
check(XPOW_PTY_V4a, 'missing env XPOW_PTY_V4a variable');
const XPOW_PTY_V5a = process.env.XPOW_PTY_V5a ?? '0x67044183139Be9fB4E11f503F209FE08a26A96c1';
check(XPOW_PTY_V5a, 'missing env XPOW_PTY_V5a variable');
const XPOW_PTY_V5b = process.env.XPOW_PTY_V5b ?? '0xA3eDfaAFA10b696356437223E17aee626Ddc4fBC';
check(XPOW_PTY_V5b, 'missing env XPOW_PTY_V5b variable');
const XPOW_PTY_V5c = process.env.XPOW_PTY_V5c ?? '0x7A3bA387933A3D21382403905f896618d65B2aBf';
check(XPOW_PTY_V5c, 'missing env XPOW_PTY_V5c variable');
const XPOW_PTY_V6a = process.env.XPOW_PTY_V6a ?? '0x953f16B53D8268CC09783ca76dBbf9Aa8708EDeA';
check(XPOW_PTY_V6a, 'missing env XPOW_PTY_V6a variable');
const XPOW_PTY_V6b = process.env.XPOW_PTY_V6b ?? '0x3df9124f68bCDcB340CB2d5F5b12500daC458c11';
check(XPOW_PTY_V6b, 'missing env XPOW_PTY_V6b variable');
const XPOW_PTY_V6c = process.env.XPOW_PTY_V6c ?? '0x8a27C6222F875786cC49aab437A29Fce2b1F1B89';
check(XPOW_PTY_V6c, 'missing env XPOW_PTY_V6c variable');
const XPOW_PTY_V7a = process.env.XPOW_PTY_V7a ?? '0xc8c54156f8E3872Bee13CC4B0Ba1EBe8775B6034';
check(XPOW_PTY_V7a, 'missing env XPOW_PTY_V7a variable');
const XPOW_PTY_V7b = process.env.XPOW_PTY_V7b ?? '0xE575890de907a748737d43F0dD80b456fe0F482e';
check(XPOW_PTY_V7b, 'missing env XPOW_PTY_V7b variable');
const XPOW_PTY_V7c = process.env.XPOW_PTY_V7c ?? '0xe83EA0D099c8073B3534D2e86247B96659cEfDF5';
check(XPOW_PTY_V7c, 'missing env XPOW_PTY_V7c variable');
const XPOW_PTY_V8a = process.env.XPOW_PTY_V8a ?? '0x9327133d9d873894Afb7F2278657d1044224Bc71';
check(XPOW_PTY_V8a, 'missing env XPOW_PTY_V8a variable');
const XPOW_PTY_V8b = process.env.XPOW_PTY_V8b ?? '0x07743256a169D4c91b1105F8Ba3B0da7543b2cc5';
check(XPOW_PTY_V8b, 'missing env XPOW_PTY_V8b variable');
const XPOW_PTY_V8c = process.env.XPOW_PTY_V8c ?? '0xC487e630Bd37ae212BbAFB5EA79afF60d6f7e64B';
check(XPOW_PTY_V8c, 'missing env XPOW_PTY_V8c variable');
// MOE contract images
const XPOW_MOE_IMAGE = process.env.XPOW_MOE_IMAGE ?? read('./public/images/svg/xpow.data.svg', 'utf8');
check(typeof XPOW_MOE_IMAGE === 'string', 'missing env XPOW_MOE_IMAGE variable');
// SOV contract images
const XPOW_SOV_IMAGE = process.env.XPOW_SOV_IMAGE ?? read('./public/images/svg/apow.data.svg', 'utf8');
check(typeof XPOW_SOV_IMAGE === 'string', 'missing env XPOW_SOV_IMAGE variable');

export default {
    ...{
        IPFS_GATEWAY,
        MD_ABOUT_URL,
        UI_PERSISTENCE,
        UI_MINING_SPEED,
        MY_PROVIDER_URL,
    }, ...{
        XPOW_MOE_V1a,
    }, ...{
        XPOW_MOE_V2a,
        XPOW_MOE_V2b: XPOW_MOE_V2a,
        XPOW_MOE_V2c: XPOW_MOE_V2a,
        XPOW_MOE_V3a,
        XPOW_MOE_V3b: XPOW_MOE_V3a,
        XPOW_MOE_V4a,
        XPOW_MOE_V5a,
        XPOW_MOE_V5b,
        XPOW_MOE_V5c,
        XPOW_MOE_V6a,
        XPOW_MOE_V6b,
        XPOW_MOE_V6c,
        XPOW_MOE_V7a,
        XPOW_MOE_V7b,
        XPOW_MOE_V7c,
        XPOW_MOE_V8a,
        XPOW_MOE_V8b,
        XPOW_MOE_V8c,
    }, ...{
        XPOW_NFT_V2a,
        XPOW_NFT_V2b,
        XPOW_NFT_V2c,
        XPOW_NFT_V3a,
        XPOW_NFT_V3b,
        XPOW_NFT_V4a,
        XPOW_NFT_V5a,
        XPOW_NFT_V5b,
        XPOW_NFT_V5c,
        XPOW_NFT_V6a,
        XPOW_NFT_V6b,
        XPOW_NFT_V6c,
        XPOW_NFT_V7a,
        XPOW_NFT_V7b,
        XPOW_NFT_V7c,
        XPOW_NFT_V8a,
        XPOW_NFT_V8b,
        XPOW_NFT_V8c,
    }, ...{
        XPOW_PPT_V4a,
        XPOW_PPT_V5a,
        XPOW_PPT_V5b,
        XPOW_PPT_V5c,
        XPOW_PPT_V6a,
        XPOW_PPT_V6b,
        XPOW_PPT_V6c,
        XPOW_PPT_V7a,
        XPOW_PPT_V7b,
        XPOW_PPT_V7c,
        XPOW_PPT_V8a,
        XPOW_PPT_V8b,
        XPOW_PPT_V8c,
    }, ...{
        XPOW_SOV_V5a,
        XPOW_SOV_V5b,
        XPOW_SOV_V5c,
        XPOW_SOV_V6a,
        XPOW_SOV_V6b,
        XPOW_SOV_V6c,
        XPOW_SOV_V7a,
        XPOW_SOV_V7b,
        XPOW_SOV_V7c,
        XPOW_SOV_V8a,
        XPOW_SOV_V8b,
        XPOW_SOV_V8c,
    }, ...{
        XPOW_MTY_V4a,
        XPOW_MTY_V5a,
        XPOW_MTY_V5b,
        XPOW_MTY_V5c,
        XPOW_MTY_V6a,
        XPOW_MTY_V6b,
        XPOW_MTY_V6c,
        XPOW_MTY_V7a,
        XPOW_MTY_V7b,
        XPOW_MTY_V7c,
        XPOW_MTY_V8a,
        XPOW_MTY_V8b,
        XPOW_MTY_V8c,
    }, ...{
        XPOW_PTY_V4a,
        XPOW_PTY_V5a,
        XPOW_PTY_V5b,
        XPOW_PTY_V5c,
        XPOW_PTY_V6a,
        XPOW_PTY_V6b,
        XPOW_PTY_V6c,
        XPOW_PTY_V7a,
        XPOW_PTY_V7b,
        XPOW_PTY_V7c,
        XPOW_PTY_V8a,
        XPOW_PTY_V8b,
        XPOW_PTY_V8c,
    }, ...{
        XPOW_MOE_IMAGE,
        XPOW_SOV_IMAGE,
    }
};
