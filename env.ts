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
const XPOW_MOE_01a = process.env.XPOW_MOE_01a ?? '0x74A68215AEdf59f317a23E87C13B848a292F27A4';
check(XPOW_MOE_01a, 'missing env XPOW_MOE_01a variable');
const XPOW_MOE_02a = process.env.XPOW_MOE_02a ?? '0xc63e3B6D0a2d382A74B13D19426b65C0aa5F3648';
check(XPOW_MOE_02a, 'missing env XPOW_MOE_02a variable');
const XPOW_MOE_03a = process.env.XPOW_MOE_03a ?? '0x2c5C3374c216BD8C36d598C40d990Eb2a2250cCD';
check(XPOW_MOE_03a, 'missing env XPOW_MOE_03a variable');
const XPOW_MOE_04a = process.env.XPOW_MOE_04a ?? '0x1Ab7b945f50D33cF387Fb74eB5f7a092aD03dc81';
check(XPOW_MOE_04a, 'missing env XPOW_MOE_04a variable');
const XPOW_MOE_05a = process.env.XPOW_MOE_05a ?? '0x4353CaC32924b45C01c2880F65E75B3795DDFd60';
check(XPOW_MOE_05a, 'missing env XPOW_MOE_05a variable');
const XPOW_MOE_05b = process.env.XPOW_MOE_05b ?? '0xF0F11D6d86346C541bA2eF2f48ad7A58255Cd52B';
check(XPOW_MOE_05b, 'missing env XPOW_MOE_05b variable');
const XPOW_MOE_05c = process.env.XPOW_MOE_05c ?? '0x0f310C35C006a86BD0Df6595B1856ce8Ef06Bbd3';
check(XPOW_MOE_05c, 'missing env XPOW_MOE_05c variable');
const XPOW_MOE_06a = process.env.XPOW_MOE_06a ?? '0x551b372ad7A7b85BaB113B273fd4c7924dfF4071';
check(XPOW_MOE_06a, 'missing env XPOW_MOE_06a variable');
const XPOW_MOE_06b = process.env.XPOW_MOE_06b ?? '0xC18dBF3Ebe65146B60b70fEfb686E621267Fe877';
check(XPOW_MOE_06b, 'missing env XPOW_MOE_06b variable');
const XPOW_MOE_06c = process.env.XPOW_MOE_06c ?? '0x1e6AB3d65Ad983202ebD92575aA5a168D0D6EBC9';
check(XPOW_MOE_06c, 'missing env XPOW_MOE_06c variable');
const XPOW_MOE_07a = process.env.XPOW_MOE_07a ?? '0xd8bF63eD3384f32d6CD5Af9B72299AadB7872992';
check(XPOW_MOE_07a, 'missing env XPOW_MOE_07a variable');
const XPOW_MOE_07b = process.env.XPOW_MOE_07b ?? '0x8dd3fB456f8d36191D94572802D7715a0665106B';
check(XPOW_MOE_07b, 'missing env XPOW_MOE_07b variable');
const XPOW_MOE_07c = process.env.XPOW_MOE_07c ?? '0xe2Dc552ab6848C2126229554ab3411911C28547b';
check(XPOW_MOE_07c, 'missing env XPOW_MOE_07c variable');
const XPOW_MOE_08a = process.env.XPOW_MOE_08a ?? '0x28ADA872f3deD545A275c3802b731F44D1883f73';
check(XPOW_MOE_08a, 'missing env XPOW_MOE_08a variable');
const XPOW_MOE_08b = process.env.XPOW_MOE_08b ?? '0x706c35f32C4a1bb783C4C83048467ED9c451152E';
check(XPOW_MOE_08b, 'missing env XPOW_MOE_08b variable');
const XPOW_MOE_08c = process.env.XPOW_MOE_08c ?? '0xE1448F03c097eB487560B93b4B5Bc536faFF94ad';
check(XPOW_MOE_08c, 'missing env XPOW_MOE_08c variable');
const XPOW_MOE_09a = process.env.XPOW_MOE_09a ?? '0xBc340583e3299E43f1E993C61857c3DE37E25460';
check(XPOW_MOE_09a, 'missing env XPOW_MOE_09a variable');
const XPOW_MOE_09b = process.env.XPOW_MOE_09b ?? '0x856cc60002Bac150b2738B424677879c02c516cb';
check(XPOW_MOE_09b, 'missing env XPOW_MOE_09b variable');
const XPOW_MOE_09c = process.env.XPOW_MOE_09c ?? '0x735D8f3B6A5d2c96D0405230c50Eaf96794FbB88';
check(XPOW_MOE_09c, 'missing env XPOW_MOE_09c variable');
const XPOW_MOE_10a = process.env.XPOW_MOE_10a ?? '';
check(XPOW_MOE_10a, 'missing env XPOW_MOE_10a variable');
// NFT contract addresses
const XPOW_NFT_02a = process.env.XPOW_NFT_02a ?? '0x92E332cc5E9772f18e15B9ab72E2Dc86F5336d2b';
check(XPOW_NFT_02a, 'missing env XPOW_NFT_02a variable');
const XPOW_NFT_02b = process.env.XPOW_NFT_02b ?? '0x430A941564D6f9cDFb171d59Dc359F01035E7537';
check(XPOW_NFT_02b, 'missing env XPOW_NFT_02b variable');
const XPOW_NFT_02c = process.env.XPOW_NFT_02c ?? '0x3049AF79770b127814B08aE80b69F3Cf62433a74';
check(XPOW_NFT_02c, 'missing env XPOW_NFT_02c variable');
const XPOW_NFT_03a = process.env.XPOW_NFT_03a ?? '0x3e56F51369a4652095b9e45541BA4373526D5722';
check(XPOW_NFT_03a, 'missing env XPOW_NFT_03a variable');
const XPOW_NFT_03b = process.env.XPOW_NFT_03b ?? '0x8De2e43282fE87C8f04387b6511615EDf86Af5e4';
check(XPOW_NFT_03b, 'missing env XPOW_NFT_03b variable');
const XPOW_NFT_04a = process.env.XPOW_NFT_04a ?? '0x74aF5454E7A3b2A8D0F452b20b770d7d547e6A11';
check(XPOW_NFT_04a, 'missing env XPOW_NFT_04a variable');
const XPOW_NFT_05a = process.env.XPOW_NFT_05a ?? '0x8D558f21e745e84a818A6E0879294AE98423717a';
check(XPOW_NFT_05a, 'missing env XPOW_NFT_05a variable');
const XPOW_NFT_05b = process.env.XPOW_NFT_05b ?? '0x7fD7c89Caa8C0A071ab16f0e3fb95F9FE30dC3de';
check(XPOW_NFT_05b, 'missing env XPOW_NFT_05b variable');
const XPOW_NFT_05c = process.env.XPOW_NFT_05c ?? '0x67F6a112300455f00d174C0EF31083A5e0AD3cB3';
check(XPOW_NFT_05c, 'missing env XPOW_NFT_05c variable');
const XPOW_NFT_06a = process.env.XPOW_NFT_06a ?? '0x26569E92c82b474A5E492d8b47A3aA4CeEB36BCc';
check(XPOW_NFT_06a, 'missing env XPOW_NFT_06a variable');
const XPOW_NFT_06b = process.env.XPOW_NFT_06b ?? '0xF96E6A076c7C4F5F61843Bf5bE2C75D58567806A';
check(XPOW_NFT_06b, 'missing env XPOW_NFT_06b variable');
const XPOW_NFT_06c = process.env.XPOW_NFT_06c ?? '0x566533a903732dB0Af1DF53eFA388d340DD042FE';
check(XPOW_NFT_06c, 'missing env XPOW_NFT_06c variable');
const XPOW_NFT_07a = process.env.XPOW_NFT_07a ?? '0x985Ec408b076F8baC5a4D07FdC741a00c09B12c8';
check(XPOW_NFT_07a, 'missing env XPOW_NFT_07a variable');
const XPOW_NFT_07b = process.env.XPOW_NFT_07b ?? '0x4D4a28104ccD7dd17761f903e20388f3b3F5528E';
check(XPOW_NFT_07b, 'missing env XPOW_NFT_07b variable');
const XPOW_NFT_07c = process.env.XPOW_NFT_07c ?? '0x7dD4BcE782D4160805ce54d5a222a2266130dE29';
check(XPOW_NFT_07c, 'missing env XPOW_NFT_07c variable');
const XPOW_NFT_08a = process.env.XPOW_NFT_08a ?? '0xd1c9Fa13c6828a24De26c92aDCC097780b285020';
check(XPOW_NFT_08a, 'missing env XPOW_NFT_08a variable');
const XPOW_NFT_08b = process.env.XPOW_NFT_08b ?? '0x49366B17Bb038F1FA091cEaa3D7EFD5741f87BDE';
check(XPOW_NFT_08b, 'missing env XPOW_NFT_08b variable');
const XPOW_NFT_08c = process.env.XPOW_NFT_08c ?? '0x63a4DA9D755e273000170764407F9feD5E305095';
check(XPOW_NFT_08c, 'missing env XPOW_NFT_08c variable');
const XPOW_NFT_09a = process.env.XPOW_NFT_09a ?? '0x0EA4F21B1B2A7CB88938B7B3Cb4Ca860856F4B38';
check(XPOW_NFT_09a, 'missing env XPOW_NFT_09a variable');
const XPOW_NFT_09b = process.env.XPOW_NFT_09b ?? '0xe69eC1233Bb8d4F409e11b3622e0a36d566DcC98';
check(XPOW_NFT_09b, 'missing env XPOW_NFT_09b variable');
const XPOW_NFT_09c = process.env.XPOW_NFT_09c ?? '0x871832d8c04deCE15E87F1b04aCCA01DC1066Ec7';
check(XPOW_NFT_09c, 'missing env XPOW_NFT_09c variable');
const XPOW_NFT_10a = process.env.XPOW_NFT_10a ?? '';
check(XPOW_NFT_10a, 'missing env XPOW_NFT_10a variable');
// PPT contract addresses
const APOW_NFT_04a = process.env.APOW_NFT_04a ?? '0xd4385Fbe9A8334162742254947858381EdcefdCe';
check(APOW_NFT_04a, 'missing env APOW_NFT_04a variable');
const APOW_NFT_05a = process.env.APOW_NFT_05a ?? '0x8FDE6D6bAb0D6557E6Ff923091A0767016631378';
check(APOW_NFT_05a, 'missing env APOW_NFT_05a variable');
const APOW_NFT_05b = process.env.APOW_NFT_05b ?? '0x807cE552003C2b2358C6bE2656Cc5234EC538d46';
check(APOW_NFT_05b, 'missing env APOW_NFT_05b variable');
const APOW_NFT_05c = process.env.APOW_NFT_05c ?? '0x098E7BEc9Aea1938Ee769b111Ab8BB56d22CFf02';
check(APOW_NFT_05c, 'missing env APOW_NFT_05c variable');
const APOW_NFT_06a = process.env.APOW_NFT_06a ?? '0x72290cbd47988be1546362C7D57EACDcdd01F052';
check(APOW_NFT_06a, 'missing env APOW_NFT_06a variable');
const APOW_NFT_06b = process.env.APOW_NFT_06b ?? '0xB8aD9099a232E142A5E3Cc2DdaEcD8781d55D456';
check(APOW_NFT_06b, 'missing env APOW_NFT_06b variable');
const APOW_NFT_06c = process.env.APOW_NFT_06c ?? '0x93a0929477187271C38cC991F5E355e2BEcd09a6';
check(APOW_NFT_06c, 'missing env APOW_NFT_06c variable');
const APOW_NFT_07a = process.env.APOW_NFT_07a ?? '0x68dB5e6Bf3f5C6041C3135eE18B27E07C12A9bba';
check(APOW_NFT_07a, 'missing env APOW_NFT_07a variable');
const APOW_NFT_07b = process.env.APOW_NFT_07b ?? '0x5a8A600D852Ee477891aC9B71794e850323aAf60';
check(APOW_NFT_07b, 'missing env APOW_NFT_07b variable');
const APOW_NFT_07c = process.env.APOW_NFT_07c ?? '0xe97780bA3b826980E6B40921Ae81566Ae5c1da35';
check(APOW_NFT_07c, 'missing env APOW_NFT_07c variable');
const APOW_NFT_08a = process.env.APOW_NFT_08a ?? '0x1F859150A2a6e8642c086eb4C23FE69481E14607';
check(APOW_NFT_08a, 'missing env APOW_NFT_08a variable');
const APOW_NFT_08b = process.env.APOW_NFT_08b ?? '0x64CE57850C2F15944c7988F60e6C5eFd9037B09A';
check(APOW_NFT_08b, 'missing env APOW_NFT_08b variable');
const APOW_NFT_08c = process.env.APOW_NFT_08c ?? '0x360aE2A496aC20859B838B670A9a7a22D40F200D';
check(APOW_NFT_08c, 'missing env APOW_NFT_08c variable');
const APOW_NFT_09a = process.env.APOW_NFT_09a ?? '0x53219B6022b4DB09F716cd044bAdB5a67B392179';
check(APOW_NFT_09a, 'missing env APOW_NFT_09a variable');
const APOW_NFT_09b = process.env.APOW_NFT_09b ?? '0x87D88076C2e4aCcb58cC836c2e06AD6a9D80f7C5';
check(APOW_NFT_09b, 'missing env APOW_NFT_09b variable');
const APOW_NFT_09c = process.env.APOW_NFT_09c ?? '0x0d7b30580A94E293BD29A9d33798617a384fCB0C';
check(APOW_NFT_09c, 'missing env APOW_NFT_09c variable');
const APOW_NFT_10a = process.env.APOW_NFT_10a ?? '';
check(APOW_NFT_10a, 'missing env APOW_NFT_10a variable');
// SOV contract addresses
const APOW_SOV_05a = process.env.APOW_SOV_05a ?? '0x411c1aB1e4CcD16A0b6556C625CAF5F556580995';
check(APOW_SOV_05a, 'missing env APOW_SOV_05a variable');
const APOW_SOV_05b = process.env.APOW_SOV_05b ?? '0x961359B67142D4Fc86b65A50FdC2B006a0439ca6';
check(APOW_SOV_05b, 'missing env APOW_SOV_05b variable');
const APOW_SOV_05c = process.env.APOW_SOV_05c ?? '0x42Fa90Abba2Acd3b064Dd3F29F99123Fc68fDDE3';
check(APOW_SOV_05c, 'missing env APOW_SOV_05c variable');
const APOW_SOV_06a = process.env.APOW_SOV_06a ?? '0xa63fba872931588e70a2CB4Aaf94C34b78E17922';
check(APOW_SOV_06a, 'missing env APOW_SOV_06a variable');
const APOW_SOV_06b = process.env.APOW_SOV_06b ?? '0xB57Ef0D6D4765CEBD70222c9c92F0a789174b5E4';
check(APOW_SOV_06b, 'missing env APOW_SOV_06b variable');
const APOW_SOV_06c = process.env.APOW_SOV_06c ?? '0xBF2f5179E3159E6860ddBFc6d6Ce83c3c586cF50';
check(APOW_SOV_06c, 'missing env APOW_SOV_06c variable');
const APOW_SOV_07a = process.env.APOW_SOV_07a ?? '0x7a5F2225a501039Cedd5CaD2EF5E528ab00B6790';
check(APOW_SOV_07a, 'missing env APOW_SOV_07a variable');
const APOW_SOV_07b = process.env.APOW_SOV_07b ?? '0x5ea0AFe9002C76956A3fc70df36aD2e5cCF4E3da';
check(APOW_SOV_07b, 'missing env APOW_SOV_07b variable');
const APOW_SOV_07c = process.env.APOW_SOV_07c ?? '0xFecbB287042F57BaC758Ec606C5AeD3A040aBeF8';
check(APOW_SOV_07c, 'missing env APOW_SOV_07c variable');
const APOW_SOV_08a = process.env.APOW_SOV_08a ?? '0xac1feC2e8bE3E2fd053e07780AFe77fac3e3bad9';
check(APOW_SOV_08a, 'missing env APOW_SOV_08a variable');
const APOW_SOV_08b = process.env.APOW_SOV_08b ?? '0x5F64506267Dac813D566597403304930a05cb79e';
check(APOW_SOV_08b, 'missing env APOW_SOV_08b variable');
const APOW_SOV_08c = process.env.APOW_SOV_08c ?? '0xc59bC469E5D4C99f1946F578DD5DE6bDa0E20Bf6';
check(APOW_SOV_08c, 'missing env APOW_SOV_08c variable');
const APOW_SOV_09a = process.env.APOW_SOV_09a ?? '0x0751293D7b2209cac5D48EEf89CA81f6B7fe0f8d';
check(APOW_SOV_09a, 'missing env APOW_SOV_09a variable');
const APOW_SOV_09b = process.env.APOW_SOV_09b ?? '0x992fc98f5761A00A4D4Ae63fCd720cdc96dC514F';
check(APOW_SOV_09b, 'missing env APOW_SOV_09b variable');
const APOW_SOV_09c = process.env.APOW_SOV_09c ?? '0x7F9C841FEAdDdB4bdBB2A161cA40bEbc4F215a9A';
check(APOW_SOV_09c, 'missing env APOW_SOV_09c variable');
const APOW_SOV_10a = process.env.APOW_SOV_10a ?? '';
check(APOW_SOV_10a, 'missing env APOW_SOV_10a variable');
// MOE treasury contract addresses
const XPOW_MTY_04a = process.env.XPOW_MTY_04a ?? '0x5823605b4d9548124E3a01f011d0834982D2b4fc';
check(XPOW_MTY_04a, 'missing env XPOW_MTY_04a variable');
const XPOW_MTY_05a = process.env.XPOW_MTY_05a ?? '0x1dd061234744088C36B26E81eC4c9c729507fF28';
check(XPOW_MTY_05a, 'missing env XPOW_MTY_05a variable');
const XPOW_MTY_05b = process.env.XPOW_MTY_05b ?? '0x442d629dd3028edF4eFCC2aaFfF00F9D7d1a7470';
check(XPOW_MTY_05b, 'missing env XPOW_MTY_05b variable');
const XPOW_MTY_05c = process.env.XPOW_MTY_05c ?? '0x10a9AC9Ab982F79572Cd186eBeE64148f2B268A7';
check(XPOW_MTY_05c, 'missing env XPOW_MTY_05c variable');
const XPOW_MTY_06a = process.env.XPOW_MTY_06a ?? '0xFCCDb91E5f6940A621a90aF65cA1d34F277f079B';
check(XPOW_MTY_06a, 'missing env XPOW_MTY_06a variable');
const XPOW_MTY_06b = process.env.XPOW_MTY_06b ?? '0x84277728d467f8E162eDdEd872070e19c40a475a';
check(XPOW_MTY_06b, 'missing env XPOW_MTY_06b variable');
const XPOW_MTY_06c = process.env.XPOW_MTY_06c ?? '0x46cDD46139d488a4185Dd69cf78FEE18E5eaAc48';
check(XPOW_MTY_06c, 'missing env XPOW_MTY_06c variable');
const XPOW_MTY_07a = process.env.XPOW_MTY_07a ?? '0xa4842F0050495542b86cF04528f7C98e11be4Bea';
check(XPOW_MTY_07a, 'missing env XPOW_MTY_07a variable');
const XPOW_MTY_07b = process.env.XPOW_MTY_07b ?? '0x3E7AB70A21027d35D57A2b0E47450305f06b2823';
check(XPOW_MTY_07b, 'missing env XPOW_MTY_07b variable');
const XPOW_MTY_07c = process.env.XPOW_MTY_07c ?? '0xada21f9F5b87aA5785C11FbbC5615bC7C8F66A77';
check(XPOW_MTY_07c, 'missing env XPOW_MTY_07c variable');
const XPOW_MTY_08a = process.env.XPOW_MTY_08a ?? '0x54220D8c2B1e8E24458864316d93c1F7Bf860243';
check(XPOW_MTY_08a, 'missing env XPOW_MTY_08a variable');
const XPOW_MTY_08b = process.env.XPOW_MTY_08b ?? '0x48Bc85af59b1271C449F6450bd9ff6B45cdC5391';
check(XPOW_MTY_08b, 'missing env XPOW_MTY_08b variable');
const XPOW_MTY_08c = process.env.XPOW_MTY_08c ?? '0x35Bf8180d301D02cBF794507Cb1f8AF0B6a04B41';
check(XPOW_MTY_08c, 'missing env XPOW_MTY_08c variable');
const XPOW_MTY_09a = process.env.XPOW_MTY_09a ?? '0x495A90AE733e0cBDF7C9c7495a5FB87660e588fB';
check(XPOW_MTY_09a, 'missing env XPOW_MTY_09a variable');
const XPOW_MTY_09b = process.env.XPOW_MTY_09b ?? '0xEC7FD452f7078D5F50aB3976Dd3E263B3d87f160';
check(XPOW_MTY_09b, 'missing env XPOW_MTY_09b variable');
const XPOW_MTY_09c = process.env.XPOW_MTY_09c ?? '0x6C48c9d2A3eD1153DB507Dc1D6e1ed0FCb39f909';
check(XPOW_MTY_09c, 'missing env XPOW_MTY_09c variable');
const XPOW_MTY_10a = process.env.XPOW_MTY_10a ?? '';
check(XPOW_MTY_10a, 'missing env XPOW_MTY_10a variable');
// PPT treasury contract addresses
const APOW_NTY_04a = process.env.APOW_NTY_04a ?? '0xEe231E251b5A422cCF9514fAc1362A0a06463CeD';
check(APOW_NTY_04a, 'missing env APOW_NTY_04a variable');
const APOW_NTY_05a = process.env.APOW_NTY_05a ?? '0x67044183139Be9fB4E11f503F209FE08a26A96c1';
check(APOW_NTY_05a, 'missing env APOW_NTY_05a variable');
const APOW_NTY_05b = process.env.APOW_NTY_05b ?? '0xA3eDfaAFA10b696356437223E17aee626Ddc4fBC';
check(APOW_NTY_05b, 'missing env APOW_NTY_05b variable');
const APOW_NTY_05c = process.env.APOW_NTY_05c ?? '0x7A3bA387933A3D21382403905f896618d65B2aBf';
check(APOW_NTY_05c, 'missing env APOW_NTY_05c variable');
const APOW_NTY_06a = process.env.APOW_NTY_06a ?? '0x953f16B53D8268CC09783ca76dBbf9Aa8708EDeA';
check(APOW_NTY_06a, 'missing env APOW_NTY_06a variable');
const APOW_NTY_06b = process.env.APOW_NTY_06b ?? '0x3df9124f68bCDcB340CB2d5F5b12500daC458c11';
check(APOW_NTY_06b, 'missing env APOW_NTY_06b variable');
const APOW_NTY_06c = process.env.APOW_NTY_06c ?? '0x8a27C6222F875786cC49aab437A29Fce2b1F1B89';
check(APOW_NTY_06c, 'missing env APOW_NTY_06c variable');
const APOW_NTY_07a = process.env.APOW_NTY_07a ?? '0xc8c54156f8E3872Bee13CC4B0Ba1EBe8775B6034';
check(APOW_NTY_07a, 'missing env APOW_NTY_07a variable');
const APOW_NTY_07b = process.env.APOW_NTY_07b ?? '0xE575890de907a748737d43F0dD80b456fe0F482e';
check(APOW_NTY_07b, 'missing env APOW_NTY_07b variable');
const APOW_NTY_07c = process.env.APOW_NTY_07c ?? '0xe83EA0D099c8073B3534D2e86247B96659cEfDF5';
check(APOW_NTY_07c, 'missing env APOW_NTY_07c variable');
const APOW_NTY_08a = process.env.APOW_NTY_08a ?? '0x9327133d9d873894Afb7F2278657d1044224Bc71';
check(APOW_NTY_08a, 'missing env APOW_NTY_08a variable');
const APOW_NTY_08b = process.env.APOW_NTY_08b ?? '0x07743256a169D4c91b1105F8Ba3B0da7543b2cc5';
check(APOW_NTY_08b, 'missing env APOW_NTY_08b variable');
const APOW_NTY_08c = process.env.APOW_NTY_08c ?? '0xC487e630Bd37ae212BbAFB5EA79afF60d6f7e64B';
check(APOW_NTY_08c, 'missing env APOW_NTY_08c variable');
const APOW_NTY_09a = process.env.APOW_NTY_09a ?? '0x77F2827552939c1812EebDfCc09f1F886F140ed5';
check(APOW_NTY_09a, 'missing env APOW_NTY_09a variable');
const APOW_NTY_09b = process.env.APOW_NTY_09b ?? '0xa59bE80EAf127F5a250991b12c931B6B6Da80AAb';
check(APOW_NTY_09b, 'missing env APOW_NTY_09b variable');
const APOW_NTY_09c = process.env.APOW_NTY_09c ?? '0x2a7faFdAb55458429EbB92f59598ED5762754Ab4';
check(APOW_NTY_09c, 'missing env APOW_NTY_09c variable');
const APOW_NTY_10a = process.env.APOW_NTY_10a ?? '';
check(APOW_NTY_10a, 'missing env APOW_NTY_10a variable');
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
    }, ...{
        XPOW_MOE_IMAGE,
        APOW_SOV_IMAGE,
    }
};
