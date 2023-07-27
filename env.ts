import assert from 'assert';
import dotenv from 'dotenv';
dotenv.config();

// App settings
const IPFS_GATEWAY = process.env.IPFS_GATEWAY ?? 'https://dweb.link';
assert(IPFS_GATEWAY, 'missing IPFS_GATEWAY env variable');
const MD_ABOUT_URL = process.env.MD_ABOUT_URL ?? '/content/about.md';
assert(MD_ABOUT_URL, 'missing MD_ABOUT_URL env variable');
const UI_PERSISTENCE = process.env.UI_PERSISTENCE ?? '0';
assert(UI_PERSISTENCE, 'missing UI_PERSISTENCE env variable');
const UI_MINING_SPEED = process.env.UI_MINING_SPEED ?? '50';
assert(UI_MINING_SPEED, 'missing UI_MINING_SPEED env variable');
const MY_PROVIDER_URL = process.env.MY_PROVIDER_URL ?? '';
assert(MY_PROVIDER_URL || MY_PROVIDER_URL === '', 'missing MY_PROVIDER_URL env variable');
// MOE contract addresses
const XPOW_MOE_V2a = process.env.XPOW_MOE_V2a ?? '0xc63e3B6D0a2d382A74B13D19426b65C0aa5F3648';
assert(XPOW_MOE_V2a, 'missing XPOW_MOE_V2a env variable');
const XPOW_MOE_V3a = process.env.XPOW_MOE_V3a ?? '0x2c5C3374c216BD8C36d598C40d990Eb2a2250cCD';
assert(XPOW_MOE_V3a, 'missing XPOW_MOE_V3a env variable');
const XPOW_MOE_V4a = process.env.XPOW_MOE_V4a ?? '0x1Ab7b945f50D33cF387Fb74eB5f7a092aD03dc81';
assert(XPOW_MOE_V4a, 'missing XPOW_MOE_V4a env variable');
const XPOW_MOE_V5a = process.env.XPOW_MOE_V5a ?? '0x4353CaC32924b45C01c2880F65E75B3795DDFd60';
assert(XPOW_MOE_V5a, 'missing XPOW_MOE_V5a env variable');
const XPOW_MOE_V5b = process.env.XPOW_MOE_V5b ?? '0xF0F11D6d86346C541bA2eF2f48ad7A58255Cd52B';
assert(XPOW_MOE_V5b, 'missing XPOW_MOE_V5b env variable');
const XPOW_MOE_V5c = process.env.XPOW_MOE_V5c ?? '0x0f310C35C006a86BD0Df6595B1856ce8Ef06Bbd3';
assert(XPOW_MOE_V5c, 'missing XPOW_MOE_V5c env variable');
const XPOW_MOE_V6a = process.env.XPOW_MOE_V6a ?? '0x551b372ad7A7b85BaB113B273fd4c7924dfF4071';
assert(XPOW_MOE_V6a, 'missing XPOW_MOE_V6a env variable');
const XPOW_MOE_V6b = process.env.XPOW_MOE_V6b ?? '0xC18dBF3Ebe65146B60b70fEfb686E621267Fe877';
assert(XPOW_MOE_V6b, 'missing XPOW_MOE_V6b env variable');
const XPOW_MOE_V6c = process.env.XPOW_MOE_V6c ?? '0x1e6AB3d65Ad983202ebD92575aA5a168D0D6EBC9';
assert(XPOW_MOE_V6c, 'missing XPOW_MOE_V6c env variable');
const XPOW_MOE_V7a = process.env.XPOW_MOE_V7a ?? '0xd8bF63eD3384f32d6CD5Af9B72299AadB7872992';
assert(XPOW_MOE_V7a, 'missing XPOW_MOE_V7a env variable');
const XPOW_MOE_V7b = process.env.XPOW_MOE_V7b ?? '0x8dd3fB456f8d36191D94572802D7715a0665106B';
assert(XPOW_MOE_V7b, 'missing XPOW_MOE_V7b env variable');
const XPOW_MOE_V7c = process.env.XPOW_MOE_V7c ?? '0xe2Dc552ab6848C2126229554ab3411911C28547b';
assert(XPOW_MOE_V7c, 'missing XPOW_MOE_V7c env variable');
// NFT contract addresses
const XPOW_NFT_V2a = process.env.XPOW_NFT_V2a ?? '0x92E332cc5E9772f18e15B9ab72E2Dc86F5336d2b';
assert(XPOW_NFT_V2a, 'missing XPOW_NFT_V2a env variable');
const XPOW_NFT_V2b = process.env.XPOW_NFT_V2b ?? '0x430A941564D6f9cDFb171d59Dc359F01035E7537';
assert(XPOW_NFT_V2b, 'missing XPOW_NFT_V2b env variable');
const XPOW_NFT_V2c = process.env.XPOW_NFT_V2c ?? '0x3049AF79770b127814B08aE80b69F3Cf62433a74';
assert(XPOW_NFT_V2c, 'missing XPOW_NFT_V2c env variable');
const XPOW_NFT_V3a = process.env.XPOW_NFT_V3a ?? '0x3e56F51369a4652095b9e45541BA4373526D5722';
assert(XPOW_NFT_V3a, 'missing XPOW_NFT_V3a env variable');
const XPOW_NFT_V3b = process.env.XPOW_NFT_V3b ?? '0x8De2e43282fE87C8f04387b6511615EDf86Af5e4';
assert(XPOW_NFT_V3b, 'missing XPOW_NFT_V3b env variable');
const XPOW_NFT_V4a = process.env.XPOW_NFT_V4a ?? '0x74aF5454E7A3b2A8D0F452b20b770d7d547e6A11';
assert(XPOW_NFT_V4a, 'missing XPOW_NFT_V4a env variable');
const XPOW_NFT_V5a = process.env.XPOW_NFT_V5a ?? '0x8D558f21e745e84a818A6E0879294AE98423717a';
assert(XPOW_NFT_V5a, 'missing XPOW_NFT_V5a env variable');
const XPOW_NFT_V5b = process.env.XPOW_NFT_V5b ?? '0x7fD7c89Caa8C0A071ab16f0e3fb95F9FE30dC3de';
assert(XPOW_NFT_V5b, 'missing XPOW_NFT_V5b env variable');
const XPOW_NFT_V5c = process.env.XPOW_NFT_V5c ?? '0x67F6a112300455f00d174C0EF31083A5e0AD3cB3';
assert(XPOW_NFT_V5c, 'missing XPOW_NFT_V5c env variable');
const XPOW_NFT_V6a = process.env.XPOW_NFT_V6a ?? '0x26569E92c82b474A5E492d8b47A3aA4CeEB36BCc';
assert(XPOW_NFT_V6a, 'missing XPOW_NFT_V6a env variable');
const XPOW_NFT_V6b = process.env.XPOW_NFT_V6b ?? '0xF96E6A076c7C4F5F61843Bf5bE2C75D58567806A';
assert(XPOW_NFT_V6b, 'missing XPOW_NFT_V6b env variable');
const XPOW_NFT_V6c = process.env.XPOW_NFT_V6c ?? '0x566533a903732dB0Af1DF53eFA388d340DD042FE';
assert(XPOW_NFT_V6c, 'missing XPOW_NFT_V6c env variable');
const XPOW_NFT_V7a = process.env.XPOW_NFT_V7a ?? '0x985Ec408b076F8baC5a4D07FdC741a00c09B12c8';
assert(XPOW_NFT_V7a, 'missing XPOW_NFT_V7a env variable');
const XPOW_NFT_V7b = process.env.XPOW_NFT_V7b ?? '0x4D4a28104ccD7dd17761f903e20388f3b3F5528E';
assert(XPOW_NFT_V7b, 'missing XPOW_NFT_V7b env variable');
const XPOW_NFT_V7c = process.env.XPOW_NFT_V7c ?? '0x7dD4BcE782D4160805ce54d5a222a2266130dE29';
assert(XPOW_NFT_V7c, 'missing XPOW_NFT_V7c env variable');
// PPT contract addresses
const XPOW_PPT_V4a = process.env.XPOW_PPT_V4a ?? '0xd4385Fbe9A8334162742254947858381EdcefdCe';
assert(XPOW_PPT_V4a, 'missing XPOW_PPT_V4a env variable');
const XPOW_PPT_V5a = process.env.XPOW_PPT_V5a ?? '0x8FDE6D6bAb0D6557E6Ff923091A0767016631378';
assert(XPOW_PPT_V5a, 'missing XPOW_PPT_V5a env variable');
const XPOW_PPT_V5b = process.env.XPOW_PPT_V5b ?? '0x807cE552003C2b2358C6bE2656Cc5234EC538d46';
assert(XPOW_PPT_V5b, 'missing XPOW_PPT_V5b env variable');
const XPOW_PPT_V5c = process.env.XPOW_PPT_V5c ?? '0x098E7BEc9Aea1938Ee769b111Ab8BB56d22CFf02';
assert(XPOW_PPT_V5c, 'missing XPOW_PPT_V5c env variable');
const XPOW_PPT_V6a = process.env.XPOW_PPT_V6a ?? '0x72290cbd47988be1546362C7D57EACDcdd01F052';
assert(XPOW_PPT_V6a, 'missing XPOW_PPT_V6a env variable');
const XPOW_PPT_V6b = process.env.XPOW_PPT_V6b ?? '0xB8aD9099a232E142A5E3Cc2DdaEcD8781d55D456';
assert(XPOW_PPT_V6b, 'missing XPOW_PPT_V6b env variable');
const XPOW_PPT_V6c = process.env.XPOW_PPT_V6c ?? '0x93a0929477187271C38cC991F5E355e2BEcd09a6';
assert(XPOW_PPT_V6c, 'missing XPOW_PPT_V6c env variable');
const XPOW_PPT_V7a = process.env.XPOW_PPT_V7a ?? '0x68dB5e6Bf3f5C6041C3135eE18B27E07C12A9bba';
assert(XPOW_PPT_V7a, 'missing XPOW_PPT_V7a env variable');
const XPOW_PPT_V7b = process.env.XPOW_PPT_V7b ?? '0x5a8A600D852Ee477891aC9B71794e850323aAf60';
assert(XPOW_PPT_V7b, 'missing XPOW_PPT_V7b env variable');
const XPOW_PPT_V7c = process.env.XPOW_PPT_V7c ?? '0xe97780bA3b826980E6B40921Ae81566Ae5c1da35';
assert(XPOW_PPT_V7c, 'missing XPOW_PPT_V7c env variable');
// SOV contract addresses
const XPOW_SOV_V5a = process.env.XPOW_SOV_V5a ?? '0x411c1aB1e4CcD16A0b6556C625CAF5F556580995';
assert(XPOW_SOV_V5a, 'missing XPOW_SOV_V5a env variable');
const XPOW_SOV_V5b = process.env.XPOW_SOV_V5b ?? '0x961359B67142D4Fc86b65A50FdC2B006a0439ca6';
assert(XPOW_SOV_V5b, 'missing XPOW_SOV_V5b env variable');
const XPOW_SOV_V5c = process.env.XPOW_SOV_V5c ?? '0x42Fa90Abba2Acd3b064Dd3F29F99123Fc68fDDE3';
assert(XPOW_SOV_V5c, 'missing XPOW_SOV_V5c env variable');
const XPOW_SOV_V6a = process.env.XPOW_SOV_V6a ?? '0xa63fba872931588e70a2CB4Aaf94C34b78E17922';
assert(XPOW_SOV_V6a, 'missing XPOW_SOV_V6a env variable');
const XPOW_SOV_V6b = process.env.XPOW_SOV_V6b ?? '0xB57Ef0D6D4765CEBD70222c9c92F0a789174b5E4';
assert(XPOW_SOV_V6b, 'missing XPOW_SOV_V6b env variable');
const XPOW_SOV_V6c = process.env.XPOW_SOV_V6c ?? '0xBF2f5179E3159E6860ddBFc6d6Ce83c3c586cF50';
assert(XPOW_SOV_V6c, 'missing XPOW_SOV_V6c env variable');
const XPOW_SOV_V7a = process.env.XPOW_SOV_V7a ?? '0x7a5F2225a501039Cedd5CaD2EF5E528ab00B6790';
assert(XPOW_SOV_V7a, 'missing XPOW_SOV_V7a env variable');
const XPOW_SOV_V7b = process.env.XPOW_SOV_V7b ?? '0x5ea0AFe9002C76956A3fc70df36aD2e5cCF4E3da';
assert(XPOW_SOV_V7b, 'missing XPOW_SOV_V7b env variable');
const XPOW_SOV_V7c = process.env.XPOW_SOV_V7c ?? '0xFecbB287042F57BaC758Ec606C5AeD3A040aBeF8';
assert(XPOW_SOV_V7c, 'missing XPOW_SOV_V7c env variable');
// MOE treasury contract addresses
const XPOW_MTY_V4a = process.env.XPOW_MTY_V4a ?? '0x5823605b4d9548124E3a01f011d0834982D2b4fc';
assert(XPOW_MTY_V4a, 'missing XPOW_MTY_V4a env variable');
const XPOW_MTY_V5a = process.env.XPOW_MTY_V5a ?? '0x1dd061234744088C36B26E81eC4c9c729507fF28';
assert(XPOW_MTY_V5a, 'missing XPOW_MTY_V5a env variable');
const XPOW_MTY_V5b = process.env.XPOW_MTY_V5b ?? '0x442d629dd3028edF4eFCC2aaFfF00F9D7d1a7470';
assert(XPOW_MTY_V5b, 'missing XPOW_MTY_V5b env variable');
const XPOW_MTY_V5c = process.env.XPOW_MTY_V5c ?? '0x10a9AC9Ab982F79572Cd186eBeE64148f2B268A7';
assert(XPOW_MTY_V5c, 'missing XPOW_MTY_V5c env variable');
const XPOW_MTY_V6a = process.env.XPOW_MTY_V6a ?? '0xFCCDb91E5f6940A621a90aF65cA1d34F277f079B';
assert(XPOW_MTY_V6a, 'missing XPOW_MTY_V6a env variable');
const XPOW_MTY_V6b = process.env.XPOW_MTY_V6b ?? '0x84277728d467f8E162eDdEd872070e19c40a475a';
assert(XPOW_MTY_V6b, 'missing XPOW_MTY_V6b env variable');
const XPOW_MTY_V6c = process.env.XPOW_MTY_V6c ?? '0x46cDD46139d488a4185Dd69cf78FEE18E5eaAc48';
assert(XPOW_MTY_V6c, 'missing XPOW_MTY_V6c env variable');
const XPOW_MTY_V7a = process.env.XPOW_MTY_V7a ?? '0xa4842F0050495542b86cF04528f7C98e11be4Bea';
assert(XPOW_MTY_V7a, 'missing XPOW_MTY_V7a env variable');
const XPOW_MTY_V7b = process.env.XPOW_MTY_V7b ?? '0x3E7AB70A21027d35D57A2b0E47450305f06b2823';
assert(XPOW_MTY_V7b, 'missing XPOW_MTY_V7b env variable');
const XPOW_MTY_V7c = process.env.XPOW_MTY_V7c ?? '0xada21f9F5b87aA5785C11FbbC5615bC7C8F66A77';
assert(XPOW_MTY_V7c, 'missing XPOW_MTY_V7c env variable');
// PPT treasury contract addresses
const XPOW_PTY_V4a = process.env.XPOW_PTY_V4a ?? '0xEe231E251b5A422cCF9514fAc1362A0a06463CeD';
assert(XPOW_PTY_V4a, 'missing XPOW_PTY_V4a env variable');
const XPOW_PTY_V5a = process.env.XPOW_PTY_V5a ?? '0x67044183139Be9fB4E11f503F209FE08a26A96c1';
assert(XPOW_PTY_V5a, 'missing XPOW_PTY_V5a env variable');
const XPOW_PTY_V5b = process.env.XPOW_PTY_V5b ?? '0xA3eDfaAFA10b696356437223E17aee626Ddc4fBC';
assert(XPOW_PTY_V5b, 'missing XPOW_PTY_V5b env variable');
const XPOW_PTY_V5c = process.env.XPOW_PTY_V5c ?? '0x7A3bA387933A3D21382403905f896618d65B2aBf';
assert(XPOW_PTY_V5c, 'missing XPOW_PTY_V5c env variable');
const XPOW_PTY_V6a = process.env.XPOW_PTY_V6a ?? '0x953f16B53D8268CC09783ca76dBbf9Aa8708EDeA';
assert(XPOW_PTY_V6a, 'missing XPOW_PTY_V6a env variable');
const XPOW_PTY_V6b = process.env.XPOW_PTY_V6b ?? '0x3df9124f68bCDcB340CB2d5F5b12500daC458c11';
assert(XPOW_PTY_V6b, 'missing XPOW_PTY_V6b env variable');
const XPOW_PTY_V6c = process.env.XPOW_PTY_V6c ?? '0x8a27C6222F875786cC49aab437A29Fce2b1F1B89';
assert(XPOW_PTY_V6c, 'missing XPOW_PTY_V6c env variable');
const XPOW_PTY_V7a = process.env.XPOW_PTY_V7a ?? '0xc8c54156f8E3872Bee13CC4B0Ba1EBe8775B6034';
assert(XPOW_PTY_V7a, 'missing XPOW_PTY_V7a env variable');
const XPOW_PTY_V7b = process.env.XPOW_PTY_V7b ?? '0xE575890de907a748737d43F0dD80b456fe0F482e';
assert(XPOW_PTY_V7b, 'missing XPOW_PTY_V7b env variable');
const XPOW_PTY_V7c = process.env.XPOW_PTY_V7c ?? '0xe83EA0D099c8073B3534D2e86247B96659cEfDF5';
assert(XPOW_PTY_V7c, 'missing XPOW_PTY_V7c env variable');
// MOE contract images
const XPOW_MOE_IMAGE = process.env.XPOW_MOE_IMAGE ?? "data:image/svg+xml,%3Csvg viewBox='0 0 480 480' id='svg49' width='480' height='480' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svg='http://www.w3.org/2000/svg'%3E%3Cdefs id='defs29'%3E%3Cstyle id='style2'%3E.cls-1%7Bfill:%2322262a;%7D.cls-2,.cls-3,.cls-4,.cls-5,.cls-6,.cls-7,.cls-8%7Bstroke:%2317492c;stroke-miterlimit:10;fill-rule:evenodd;%7D.cls-2%7Bfill:url(%23linear-gradient);%7D.cls-3%7Bfill:url(%23linear-gradient-2);%7D.cls-4%7Bfill:url(%23linear-gradient-3);%7D.cls-5%7Bfill:url(%23linear-gradient-4);%7D.cls-6%7Bfill:url(%23linear-gradient-5);%7D.cls-7%7Bfill:url(%23linear-gradient-6);%7D.cls-8%7Bfill:url(%23linear-gradient-7);%7D%3C/style%3E%3ClinearGradient id='linear-gradient' x1='193.78' y1='443.70999' x2='229.10001' y2='443.70999' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='lime' id='stop4' /%3E%3Cstop offset='0.43' stop-color='%2300fd00' id='stop6' /%3E%3Cstop offset='0.58' stop-color='%2300f600' id='stop8' /%3E%3Cstop offset='0.69' stop-color='%2300eb00' id='stop10' /%3E%3Cstop offset='0.78' stop-color='%2300da00' id='stop12' /%3E%3Cstop offset='0.86' stop-color='%2300c400' id='stop14' /%3E%3Cstop offset='0.93' stop-color='%2300a800' id='stop16' /%3E%3Cstop offset='0.99' stop-color='%23008900' id='stop18' /%3E%3Cstop offset='1' stop-color='green' id='stop20' /%3E%3C/linearGradient%3E%3ClinearGradient id='linear-gradient-2' x1='195.17999' y1='440.20999' x2='352.32999' y2='440.20999' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-3' x1='197.17999' y1='426.32999' x2='353.60999' y2='426.32999' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-4' x1='194.44' y1='370.32999' x2='379.09' y2='370.32999' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-5' x1='254.82001' y1='237.95' x2='347.35001' y2='237.95' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-6' x1='244.61' y1='223.39999' x2='365.23999' y2='223.39999' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-7' x1='196.46001' y1='253.25999' x2='406.22' y2='253.25999' xlink:href='%23linear-gradient' /%3E%3ClinearGradient xlink:href='%23linear-gradient' id='linearGradient870' gradientUnits='userSpaceOnUse' x1='193.78' y1='443.70999' x2='229.10001' y2='443.70999' /%3E%3C/defs%3E%3Crect class='cls-1' width='480' height='480' id='rect31' x='0' y='0' style='stroke-width:0.8' /%3E%3Cg id='g896' transform='translate(-59.796875,-60.132812)'%3E%3Cpath class='cls-2' d='m 224.75,464.38 c -2.85,-9.22 -2.87,-21.08 0,-32.87 0.42,-1.77 0.77,-3.35 0.77,-3.51 0,-0.43 -2.34,-1.07 -6.46,-1.75 -9.11,-1.52 -14.87,-4.43 -20.37,-10.34 -3,-3.25 -3.08,-3.29 -3.46,-2.29 -1.2,3.16 -1.42,4.92 -1.42,11.22 0,5.87 0.12,7.19 1.07,11 4,15.94 14.3,30.18 26.17,36.16 3.63,1.82 7.24,2.87 7.84,2.26 0.34,-0.33 0.33,-0.63 0,-1.15 a 42.11,42.11 0 0 1 -4.14,-8.73 z' id='path33' style='fill:url(%23linearGradient870)' /%3E%3Cpath class='cls-3' d='m 319.73,435.27 a 65.52,65.52 0 0 0 -25.61,-6.37 68.45,68.45 0 0 1 -18.26,-3.29 c -4,-1.24 -4.79,-1.62 -13.36,-6.37 a 48.64,48.64 0 0 0 -14.14,-5.53 c -6.09,-1.42 -17.34,-2.69 -21.13,-2.39 a 26.38,26.38 0 0 1 -13.46,-2.51 c -3,-1.66 -4.56,-2.82 -9.12,-6.86 a 42.65,42.65 0 0 0 -4.11,-3.34 5.69,5.69 0 0 0 -4,-0.16 c -0.51,0.37 -1.41,4.66 -1.38,6.6 0.03,1.94 0.46,2.55 4,6.45 a 34.46,34.46 0 0 0 9.91,7.78 c 4.09,2 12.3,4.07 19,4.75 a 136.68,136.68 0 0 1 18.18,3.29 98.77,98.77 0 0 1 10.51,4.62 c 10.91,5.38 18.53,7.48 35.8,9.9 19.11,2.66 26.79,5.64 34.38,13.32 4.41,4.46 7,8.54 9.9,15.53 1,2.48 2.59,6 3.48,7.82 1.48,3.08 1.71,3.36 3.05,3.6 a 17.76,17.76 0 0 0 7.68,-0.71 c 1.09,-0.52 1.16,-0.72 1.2,-3 0.09,-5.07 -2.61,-13.48 -6.27,-19.55 a 59.51,59.51 0 0 0 -26.25,-23.58 z' id='path35' style='fill:url(%23linear-gradient-2)' /%3E%3Cpath class='cls-4' d='m 325.41,429.15 c -11,-5.82 -24.45,-9.55 -34.46,-9.58 -4,0 -7,-0.59 -13.28,-2.62 a 55,55 0 0 1 -14.44,-6.7 c -8.45,-5.48 -12,-6.38 -28.24,-7.24 -10.74,-0.57 -18.14,-2.7 -26.05,-7.46 -3,-1.84 -7.77,-3.32 -9.13,-2.87 -0.22,0.07 -0.9,0.25 -1.51,0.38 -0.84,0.18 -1.12,0.48 -1.12,1.21 0,1.07 0.67,1.45 2.61,1.45 1.94,0 4.26,0.91 8.25,3.22 8.79,5.07 16.23,7.08 28.3,7.69 8.12,0.41 11.86,0.85 15.56,1.82 2.94,0.77 4.53,1.58 9.56,4.89 5.71,3.73 9.93,5.56 19,8.26 3.56,1 5.34,1.31 10.92,1.62 a 67.25,67.25 0 0 1 19.81,3.78 c 6.22,2.06 16.65,7.2 20.47,10.09 4.71,3.54 11.36,10.29 16.5,16.72 l 5,6.24 c 0.08,0.09 0.25,0.06 0.39,-0.07 0.41,-0.41 -1.35,-3.88 -4.12,-8.12 -7.22,-11.09 -13.84,-17.33 -24.02,-22.71 z' id='path37' style='fill:url(%23linear-gradient-3)' /%3E%3Cpath class='cls-5' d='m 377.87,327.2 a 10.46,10.46 0 0 0 -0.52,2 c -1.23,6.57 -6.42,13.29 -11.54,15 -2.43,0.8 -5.92,0.61 -7.48,-0.41 -0.53,-0.35 -3.39,-1.75 -6.34,-3.09 -31.53,-14.46 -63.38,-16.84 -85.85,-6.46 -9.77,4.52 -18.25,12.93 -22,21.85 -2.33,5.53 -2.94,8.53 -3.16,15.6 a 48.56,48.56 0 0 0 1.75,15.82 c 0.39,1.44 -1.87,3.57 -5,4.74 -7.56,2.83 -10.14,2.59 -19.59,-1.79 -10,-4.61 -14.2,-5.41 -18.65,-3.53 -2,0.85 -5.27,2.77 -5,3 a 19.87,19.87 0 0 0 2.84,-0.32 q 7.52,-1.16 20,6.53 c 5.09,3.14 8.84,3.78 20.1,3.44 12.41,-0.36 19.35,0.81 25.69,4.4 2.78,1.57 4.57,2.92 8.81,6.66 3.8,3.34 4.93,3.65 6.72,1.87 2,-2 1.91,-3.8 -0.35,-6.64 -1.79,-2.24 -3.7,-7.08 -4.3,-11 -0.88,-5.56 0.38,-19.87 2.33,-26.62 4.19,-14.46 13.76,-23.48 26.12,-24.64 7.75,-0.73 15.8,1 24.28,5.26 a 51.86,51.86 0 0 1 9.34,5.75 c 3.32,2.73 5.86,3.17 7.84,1.36 1.36,-1.21 1.24,-3.94 -0.27,-6.57 -1.51,-2.63 -5.26,-6.1 -8.82,-8.24 -3.17,-1.9 -2.67,-2.11 1.12,-0.5 7.43,3.18 13.11,9.16 13.59,14.34 0.24,2.45 -0.52,4 -2.81,5.72 -3.08,2.35 -5.62,1.8 -12.41,-2.71 a 67.34,67.34 0 0 0 -19.93,-9.28 29.72,29.72 0 0 0 -8.38,-0.86 c -4.45,0 -5.42,0.12 -8,1 -8.74,3.14 -14.15,9.5 -16.93,19.93 -1,3.72 -1.08,4.71 -1.1,12.14 0,8.27 0.54,13.64 1.63,15.06 0.46,0.6 0.54,-0.29 0.55,-5.71 0,-10.18 1.53,-17.93 4.54,-23.31 5.34,-9.54 14.39,-14.23 24.94,-12.92 7.07,0.87 14.2,4 21.47,9.5 a 87.28,87.28 0 0 1 14.39,14.59 c 4,5.4 4.52,5.82 6.7,5.82 a 3.16,3.16 0 0 0 3.14,-1.4 19.34,19.34 0 0 0 4.13,-7.89 c 1.18,-4.24 2.56,-6.85 10.17,-19.22 5.53,-9 6.73,-12.35 7.27,-20.26 0.35,-5.16 0.32,-6.32 -0.17,-7.26 -0.36,-0.6 -0.73,-0.95 -0.86,-0.75 z' id='path39' style='fill:url(%23linear-gradient-4)' /%3E%3Cpath class='cls-6' d='m 260.49,281.41 c -4.52,0.36 -5.67,0.57 -5.67,1 0,1 3.54,1.32 9.91,0.85 a 82.46,82.46 0 0 0 31.59,-9 c 19.56,-9.79 35.53,-25.28 44.19,-42.9 A 62.15,62.15 0 0 0 347.22,208 c 0.51,-6.52 -0.5,-15.12 -1.83,-15.56 -0.22,-0.07 -0.37,3.67 -0.37,9.08 0,9.06 0,9.27 -1.29,14.06 -4.73,17.64 -16.53,34.42 -32.94,46.65 -15.48,11.56 -31.46,17.66 -50.3,19.18 z' id='path41' style='fill:url(%23linear-gradient-5)' /%3E%3Cpath class='cls-7' d='M 344.94,237.16 A 95.35,95.35 0 0 1 302.33,279 c -11.12,5.52 -21.29,8.19 -32.74,8.6 a 57.49,57.49 0 0 1 -19.12,-2 c -2.83,-0.7 -5.27,-1.15 -5.41,-1 -0.6,0.59 -0.6,4.65 0,7.47 0.8,3.75 3.77,10 5.56,11.66 1.57,1.45 5.77,3 11.75,4.19 22.43,4.67 45.86,-0.88 65.45,-15.49 a 111.87,111.87 0 0 0 17.28,-17.32 c 10.17,-13.64 16.17,-27.8 19.19,-45.24 0.82,-4.76 0.95,-6.78 0.95,-15.78 0,-10.44 -0.22,-12.71 -1.88,-20.79 a 97.07,97.07 0 0 0 -12.11,-30.67 c -8,-12.92 -20.27,-22.24 -32.56,-24.77 -2.8,-0.59 -6.24,-0.83 -6.24,-0.44 a 23.52,23.52 0 0 0 3.33,1.44 54,54 0 0 1 19.48,12.71 58,58 0 0 1 11.59,16.61 c 5.55,11.39 7.44,19.76 7.41,33 0,8.7 -0.52,12.5 -2.62,19.79 a 76.5,76.5 0 0 1 -6.7,16.19 z' id='path43' style='fill:url(%23linear-gradient-6)' /%3E%3Cpath class='cls-8' d='m 209.72,379.74 c 0.56,0.16 4,1.63 7.68,3.25 11.73,5.16 16.94,6.59 19.6,5.39 1.45,-0.67 1.58,-1.55 0.66,-4.32 -2.37,-7 -2.69,-18.85 -0.72,-26.41 4.13,-15.81 16.12,-26.24 36.49,-31.73 24.33,-6.58 52.66,-3.29 79.41,9.23 2,0.92 3.33,1.32 4.05,1.19 2.09,-0.4 13,-11.79 19.32,-20.1 20.91,-27.68 32,-64.66 29.7,-98.69 -1,-14.8 -3.54,-26.52 -8.39,-38.83 -11.92,-30.25 -34.53,-51.44 -62.36,-58.44 a 85.39,85.39 0 0 0 -26.55,-2.37 c -10.93,0.59 -20.47,3 -32.81,8.18 -7.54,3.18 -20.37,11.14 -20.37,12.62 0,0.91 0.74,0.68 4,-1.22 19.41,-11.38 39.67,-14.23 58.68,-8.25 a 78.36,78.36 0 0 1 18,9 c 18.12,13.06 30.27,34.34 35.46,62.1 0.82,4.45 0.93,6.26 0.92,14.78 0,10.54 -0.39,13.72 -2.61,22.52 A 104.79,104.79 0 0 1 355,270.91 c -12.16,18.29 -29.77,32.88 -48.38,40.06 -18.91,7.29 -37.15,7 -54.17,-1 -5.36,-2.49 -11.44,-7.17 -13.67,-10.51 -1.21,-1.82 -1.25,-2 -1.12,-5.72 0.1,-3 0.33,-4.25 1.05,-5.69 3.58,-7.29 14.13,-12.89 25.38,-13.51 2.22,-0.12 6.49,-0.5 9.5,-0.82 3.01,-0.32 6.82,-0.72 8.5,-0.84 5.51,-0.4 5.8,-0.68 2.49,-2.36 -6.81,-3.44 -19.4,-5.6 -32.63,-5.6 a 104.37,104.37 0 0 0 -22.66,2.13 c -8.33,1.68 -11.59,2.8 -12.27,4.2 -2,4.24 -3,16.56 -1.89,24 a 40.9,40.9 0 0 1 0.54,4.67 c -3.62,2.16 -6,4.75 -9.32,10 -11.71,18.64 -13.39,52.42 -3.28,65.79 0.98,1.29 4.34,3.34 6.65,4.03 z' id='path45' style='fill:url(%23linear-gradient-7)' /%3E%3C/g%3E%3C/svg%3E";
assert(typeof XPOW_MOE_IMAGE === 'string', 'missing XPOW_MOE_IMAGE env variable');
// SOV contract images
const XPOW_SOV_IMAGE = process.env.XPOW_SOV_IMAGE ?? "data:image/svg+xml,%3Csvg style='filter:invert(1)' viewBox='0 0 480 480' id='svg49' width='480' height='480' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svg='http://www.w3.org/2000/svg'%3E%3Cdefs id='defs29'%3E%3Cstyle id='style2'%3E.cls-1%7Bfill:%2322262a;%7D.cls-2,.cls-3,.cls-4,.cls-5,.cls-6,.cls-7,.cls-8%7Bstroke:%2317492c;stroke-miterlimit:10;fill-rule:evenodd;%7D.cls-2%7Bfill:url(%23linear-gradient);%7D.cls-3%7Bfill:url(%23linear-gradient-2);%7D.cls-4%7Bfill:url(%23linear-gradient-3);%7D.cls-5%7Bfill:url(%23linear-gradient-4);%7D.cls-6%7Bfill:url(%23linear-gradient-5);%7D.cls-7%7Bfill:url(%23linear-gradient-6);%7D.cls-8%7Bfill:url(%23linear-gradient-7);%7D%3C/style%3E%3ClinearGradient id='linear-gradient' x1='193.78' y1='443.70999' x2='229.10001' y2='443.70999' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='lime' id='stop4' /%3E%3Cstop offset='0.43' stop-color='%2300fd00' id='stop6' /%3E%3Cstop offset='0.58' stop-color='%2300f600' id='stop8' /%3E%3Cstop offset='0.69' stop-color='%2300eb00' id='stop10' /%3E%3Cstop offset='0.78' stop-color='%2300da00' id='stop12' /%3E%3Cstop offset='0.86' stop-color='%2300c400' id='stop14' /%3E%3Cstop offset='0.93' stop-color='%2300a800' id='stop16' /%3E%3Cstop offset='0.99' stop-color='%23008900' id='stop18' /%3E%3Cstop offset='1' stop-color='green' id='stop20' /%3E%3C/linearGradient%3E%3ClinearGradient id='linear-gradient-2' x1='195.17999' y1='440.20999' x2='352.32999' y2='440.20999' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-3' x1='197.17999' y1='426.32999' x2='353.60999' y2='426.32999' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-4' x1='194.44' y1='370.32999' x2='379.09' y2='370.32999' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-5' x1='254.82001' y1='237.95' x2='347.35001' y2='237.95' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-6' x1='244.61' y1='223.39999' x2='365.23999' y2='223.39999' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-7' x1='196.46001' y1='253.25999' x2='406.22' y2='253.25999' xlink:href='%23linear-gradient' /%3E%3ClinearGradient xlink:href='%23linear-gradient' id='linearGradient870' gradientUnits='userSpaceOnUse' x1='193.78' y1='443.70999' x2='229.10001' y2='443.70999' /%3E%3C/defs%3E%3Crect class='cls-1' width='480' height='480' id='rect31' x='0' y='0' style='stroke-width:0.8' /%3E%3Cg id='g896' transform='translate(-59.796875,-60.132812)'%3E%3Cpath class='cls-2' d='m 224.75,464.38 c -2.85,-9.22 -2.87,-21.08 0,-32.87 0.42,-1.77 0.77,-3.35 0.77,-3.51 0,-0.43 -2.34,-1.07 -6.46,-1.75 -9.11,-1.52 -14.87,-4.43 -20.37,-10.34 -3,-3.25 -3.08,-3.29 -3.46,-2.29 -1.2,3.16 -1.42,4.92 -1.42,11.22 0,5.87 0.12,7.19 1.07,11 4,15.94 14.3,30.18 26.17,36.16 3.63,1.82 7.24,2.87 7.84,2.26 0.34,-0.33 0.33,-0.63 0,-1.15 a 42.11,42.11 0 0 1 -4.14,-8.73 z' id='path33' style='fill:url(%23linearGradient870)' /%3E%3Cpath class='cls-3' d='m 319.73,435.27 a 65.52,65.52 0 0 0 -25.61,-6.37 68.45,68.45 0 0 1 -18.26,-3.29 c -4,-1.24 -4.79,-1.62 -13.36,-6.37 a 48.64,48.64 0 0 0 -14.14,-5.53 c -6.09,-1.42 -17.34,-2.69 -21.13,-2.39 a 26.38,26.38 0 0 1 -13.46,-2.51 c -3,-1.66 -4.56,-2.82 -9.12,-6.86 a 42.65,42.65 0 0 0 -4.11,-3.34 5.69,5.69 0 0 0 -4,-0.16 c -0.51,0.37 -1.41,4.66 -1.38,6.6 0.03,1.94 0.46,2.55 4,6.45 a 34.46,34.46 0 0 0 9.91,7.78 c 4.09,2 12.3,4.07 19,4.75 a 136.68,136.68 0 0 1 18.18,3.29 98.77,98.77 0 0 1 10.51,4.62 c 10.91,5.38 18.53,7.48 35.8,9.9 19.11,2.66 26.79,5.64 34.38,13.32 4.41,4.46 7,8.54 9.9,15.53 1,2.48 2.59,6 3.48,7.82 1.48,3.08 1.71,3.36 3.05,3.6 a 17.76,17.76 0 0 0 7.68,-0.71 c 1.09,-0.52 1.16,-0.72 1.2,-3 0.09,-5.07 -2.61,-13.48 -6.27,-19.55 a 59.51,59.51 0 0 0 -26.25,-23.58 z' id='path35' style='fill:url(%23linear-gradient-2)' /%3E%3Cpath class='cls-4' d='m 325.41,429.15 c -11,-5.82 -24.45,-9.55 -34.46,-9.58 -4,0 -7,-0.59 -13.28,-2.62 a 55,55 0 0 1 -14.44,-6.7 c -8.45,-5.48 -12,-6.38 -28.24,-7.24 -10.74,-0.57 -18.14,-2.7 -26.05,-7.46 -3,-1.84 -7.77,-3.32 -9.13,-2.87 -0.22,0.07 -0.9,0.25 -1.51,0.38 -0.84,0.18 -1.12,0.48 -1.12,1.21 0,1.07 0.67,1.45 2.61,1.45 1.94,0 4.26,0.91 8.25,3.22 8.79,5.07 16.23,7.08 28.3,7.69 8.12,0.41 11.86,0.85 15.56,1.82 2.94,0.77 4.53,1.58 9.56,4.89 5.71,3.73 9.93,5.56 19,8.26 3.56,1 5.34,1.31 10.92,1.62 a 67.25,67.25 0 0 1 19.81,3.78 c 6.22,2.06 16.65,7.2 20.47,10.09 4.71,3.54 11.36,10.29 16.5,16.72 l 5,6.24 c 0.08,0.09 0.25,0.06 0.39,-0.07 0.41,-0.41 -1.35,-3.88 -4.12,-8.12 -7.22,-11.09 -13.84,-17.33 -24.02,-22.71 z' id='path37' style='fill:url(%23linear-gradient-3)' /%3E%3Cpath class='cls-5' d='m 377.87,327.2 a 10.46,10.46 0 0 0 -0.52,2 c -1.23,6.57 -6.42,13.29 -11.54,15 -2.43,0.8 -5.92,0.61 -7.48,-0.41 -0.53,-0.35 -3.39,-1.75 -6.34,-3.09 -31.53,-14.46 -63.38,-16.84 -85.85,-6.46 -9.77,4.52 -18.25,12.93 -22,21.85 -2.33,5.53 -2.94,8.53 -3.16,15.6 a 48.56,48.56 0 0 0 1.75,15.82 c 0.39,1.44 -1.87,3.57 -5,4.74 -7.56,2.83 -10.14,2.59 -19.59,-1.79 -10,-4.61 -14.2,-5.41 -18.65,-3.53 -2,0.85 -5.27,2.77 -5,3 a 19.87,19.87 0 0 0 2.84,-0.32 q 7.52,-1.16 20,6.53 c 5.09,3.14 8.84,3.78 20.1,3.44 12.41,-0.36 19.35,0.81 25.69,4.4 2.78,1.57 4.57,2.92 8.81,6.66 3.8,3.34 4.93,3.65 6.72,1.87 2,-2 1.91,-3.8 -0.35,-6.64 -1.79,-2.24 -3.7,-7.08 -4.3,-11 -0.88,-5.56 0.38,-19.87 2.33,-26.62 4.19,-14.46 13.76,-23.48 26.12,-24.64 7.75,-0.73 15.8,1 24.28,5.26 a 51.86,51.86 0 0 1 9.34,5.75 c 3.32,2.73 5.86,3.17 7.84,1.36 1.36,-1.21 1.24,-3.94 -0.27,-6.57 -1.51,-2.63 -5.26,-6.1 -8.82,-8.24 -3.17,-1.9 -2.67,-2.11 1.12,-0.5 7.43,3.18 13.11,9.16 13.59,14.34 0.24,2.45 -0.52,4 -2.81,5.72 -3.08,2.35 -5.62,1.8 -12.41,-2.71 a 67.34,67.34 0 0 0 -19.93,-9.28 29.72,29.72 0 0 0 -8.38,-0.86 c -4.45,0 -5.42,0.12 -8,1 -8.74,3.14 -14.15,9.5 -16.93,19.93 -1,3.72 -1.08,4.71 -1.1,12.14 0,8.27 0.54,13.64 1.63,15.06 0.46,0.6 0.54,-0.29 0.55,-5.71 0,-10.18 1.53,-17.93 4.54,-23.31 5.34,-9.54 14.39,-14.23 24.94,-12.92 7.07,0.87 14.2,4 21.47,9.5 a 87.28,87.28 0 0 1 14.39,14.59 c 4,5.4 4.52,5.82 6.7,5.82 a 3.16,3.16 0 0 0 3.14,-1.4 19.34,19.34 0 0 0 4.13,-7.89 c 1.18,-4.24 2.56,-6.85 10.17,-19.22 5.53,-9 6.73,-12.35 7.27,-20.26 0.35,-5.16 0.32,-6.32 -0.17,-7.26 -0.36,-0.6 -0.73,-0.95 -0.86,-0.75 z' id='path39' style='fill:url(%23linear-gradient-4)' /%3E%3Cpath class='cls-6' d='m 260.49,281.41 c -4.52,0.36 -5.67,0.57 -5.67,1 0,1 3.54,1.32 9.91,0.85 a 82.46,82.46 0 0 0 31.59,-9 c 19.56,-9.79 35.53,-25.28 44.19,-42.9 A 62.15,62.15 0 0 0 347.22,208 c 0.51,-6.52 -0.5,-15.12 -1.83,-15.56 -0.22,-0.07 -0.37,3.67 -0.37,9.08 0,9.06 0,9.27 -1.29,14.06 -4.73,17.64 -16.53,34.42 -32.94,46.65 -15.48,11.56 -31.46,17.66 -50.3,19.18 z' id='path41' style='fill:url(%23linear-gradient-5)' /%3E%3Cpath class='cls-7' d='M 344.94,237.16 A 95.35,95.35 0 0 1 302.33,279 c -11.12,5.52 -21.29,8.19 -32.74,8.6 a 57.49,57.49 0 0 1 -19.12,-2 c -2.83,-0.7 -5.27,-1.15 -5.41,-1 -0.6,0.59 -0.6,4.65 0,7.47 0.8,3.75 3.77,10 5.56,11.66 1.57,1.45 5.77,3 11.75,4.19 22.43,4.67 45.86,-0.88 65.45,-15.49 a 111.87,111.87 0 0 0 17.28,-17.32 c 10.17,-13.64 16.17,-27.8 19.19,-45.24 0.82,-4.76 0.95,-6.78 0.95,-15.78 0,-10.44 -0.22,-12.71 -1.88,-20.79 a 97.07,97.07 0 0 0 -12.11,-30.67 c -8,-12.92 -20.27,-22.24 -32.56,-24.77 -2.8,-0.59 -6.24,-0.83 -6.24,-0.44 a 23.52,23.52 0 0 0 3.33,1.44 54,54 0 0 1 19.48,12.71 58,58 0 0 1 11.59,16.61 c 5.55,11.39 7.44,19.76 7.41,33 0,8.7 -0.52,12.5 -2.62,19.79 a 76.5,76.5 0 0 1 -6.7,16.19 z' id='path43' style='fill:url(%23linear-gradient-6)' /%3E%3Cpath class='cls-8' d='m 209.72,379.74 c 0.56,0.16 4,1.63 7.68,3.25 11.73,5.16 16.94,6.59 19.6,5.39 1.45,-0.67 1.58,-1.55 0.66,-4.32 -2.37,-7 -2.69,-18.85 -0.72,-26.41 4.13,-15.81 16.12,-26.24 36.49,-31.73 24.33,-6.58 52.66,-3.29 79.41,9.23 2,0.92 3.33,1.32 4.05,1.19 2.09,-0.4 13,-11.79 19.32,-20.1 20.91,-27.68 32,-64.66 29.7,-98.69 -1,-14.8 -3.54,-26.52 -8.39,-38.83 -11.92,-30.25 -34.53,-51.44 -62.36,-58.44 a 85.39,85.39 0 0 0 -26.55,-2.37 c -10.93,0.59 -20.47,3 -32.81,8.18 -7.54,3.18 -20.37,11.14 -20.37,12.62 0,0.91 0.74,0.68 4,-1.22 19.41,-11.38 39.67,-14.23 58.68,-8.25 a 78.36,78.36 0 0 1 18,9 c 18.12,13.06 30.27,34.34 35.46,62.1 0.82,4.45 0.93,6.26 0.92,14.78 0,10.54 -0.39,13.72 -2.61,22.52 A 104.79,104.79 0 0 1 355,270.91 c -12.16,18.29 -29.77,32.88 -48.38,40.06 -18.91,7.29 -37.15,7 -54.17,-1 -5.36,-2.49 -11.44,-7.17 -13.67,-10.51 -1.21,-1.82 -1.25,-2 -1.12,-5.72 0.1,-3 0.33,-4.25 1.05,-5.69 3.58,-7.29 14.13,-12.89 25.38,-13.51 2.22,-0.12 6.49,-0.5 9.5,-0.82 3.01,-0.32 6.82,-0.72 8.5,-0.84 5.51,-0.4 5.8,-0.68 2.49,-2.36 -6.81,-3.44 -19.4,-5.6 -32.63,-5.6 a 104.37,104.37 0 0 0 -22.66,2.13 c -8.33,1.68 -11.59,2.8 -12.27,4.2 -2,4.24 -3,16.56 -1.89,24 a 40.9,40.9 0 0 1 0.54,4.67 c -3.62,2.16 -6,4.75 -9.32,10 -11.71,18.64 -13.39,52.42 -3.28,65.79 0.98,1.29 4.34,3.34 6.65,4.03 z' id='path45' style='fill:url(%23linear-gradient-7)' /%3E%3C/g%3E%3C/svg%3E";
assert(typeof XPOW_SOV_IMAGE === 'string', 'missing XPOW_SOV_IMAGE env variable');

export default {
    ...{
        IPFS_GATEWAY,
        MD_ABOUT_URL,
        UI_PERSISTENCE,
        UI_MINING_SPEED,
        MY_PROVIDER_URL,
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
    }, ...{
        XPOW_MOE_IMAGE,
        XPOW_SOV_IMAGE,
    }
};
