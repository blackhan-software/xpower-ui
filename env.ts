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
// MOE contract addresses
const THOR_MOE_V2a = process.env.THOR_MOE_V2a ?? '0xf48C4a0394dD9F27117a43dBb6400872399AB7E7';
assert(THOR_MOE_V2a, 'missing THOR_MOE_V2a env variable');
const LOKI_MOE_V2a = process.env.LOKI_MOE_V2a ?? '0xc63e3B6D0a2d382A74B13D19426b65C0aa5F3648';
assert(LOKI_MOE_V2a, 'missing LOKI_MOE_V2a env variable');
const ODIN_MOE_V2a = process.env.ODIN_MOE_V2a ?? '0xE71a2c51b8e0c35ee1F45ADDDb27fda1862Ad880';
assert(ODIN_MOE_V2a, 'missing ODIN_MOE_V2a env variable');
const THOR_MOE_V3a = process.env.THOR_MOE_V3a ?? '0xbB8B956520CAA6B8cd71c24cd4b515aD31937A90';
assert(THOR_MOE_V3a, 'missing THOR_MOE_V3a env variable');
const LOKI_MOE_V3a = process.env.LOKI_MOE_V3a ?? '0x2c5C3374c216BD8C36d598C40d990Eb2a2250cCD';
assert(LOKI_MOE_V3a, 'missing LOKI_MOE_V3a env variable');
const ODIN_MOE_V3a = process.env.ODIN_MOE_V3a ?? '0x621Ffc228F23Eb391bf7689bD05405e08665a11f';
assert(ODIN_MOE_V3a, 'missing ODIN_MOE_V3a env variable');
const THOR_MOE_V4a = process.env.THOR_MOE_V4a ?? '0xd7ECFFE5525fB17aBac76c5C18f1EEE9241F2205';
assert(THOR_MOE_V4a, 'missing THOR_MOE_V4a env variable');
const LOKI_MOE_V4a = process.env.LOKI_MOE_V4a ?? '0x1Ab7b945f50D33cF387Fb74eB5f7a092aD03dc81';
assert(LOKI_MOE_V4a, 'missing LOKI_MOE_V4a env variable');
const ODIN_MOE_V4a = process.env.ODIN_MOE_V4a ?? '0xA18Cd7e596aaa98A697D0511Ed87DD19AC981AFB';
assert(ODIN_MOE_V4a, 'missing ODIN_MOE_V4a env variable');
const THOR_MOE_V5a = process.env.THOR_MOE_V5a ?? '0x43b0917Dd2ab595FD3d1287d79FD1BfDb7e6f881';
assert(THOR_MOE_V5a, 'missing THOR_MOE_V5a env variable');
const LOKI_MOE_V5a = process.env.LOKI_MOE_V5a ?? '0x4353CaC32924b45C01c2880F65E75B3795DDFd60';
assert(LOKI_MOE_V5a, 'missing LOKI_MOE_V5a env variable');
const ODIN_MOE_V5a = process.env.ODIN_MOE_V5a ?? '0x635199DCD56f1aB8A7F1641Dc03a39A59485ad23';
assert(ODIN_MOE_V5a, 'missing ODIN_MOE_V5a env variable');
const THOR_MOE_V5b = process.env.THOR_MOE_V5b ?? '0x3CCCCBf2fbbE7e918617A7fb9799129DE3A150b8';
assert(THOR_MOE_V5b, 'missing THOR_MOE_V5b env variable');
const LOKI_MOE_V5b = process.env.LOKI_MOE_V5b ?? '0xF0F11D6d86346C541bA2eF2f48ad7A58255Cd52B';
assert(LOKI_MOE_V5b, 'missing LOKI_MOE_V5b env variable');
const ODIN_MOE_V5b = process.env.ODIN_MOE_V5b ?? '0xC326a3efDc529cc3DFeDEfB01BCD2f5aA9d77147';
assert(ODIN_MOE_V5b, 'missing ODIN_MOE_V5b env variable');
const THOR_MOE_V5c = process.env.THOR_MOE_V5c ?? '0x5cF59759385B2E1DF22A920ad42EeAAA8f77f012';
assert(THOR_MOE_V5c, 'missing THOR_MOE_V5c env variable');
const LOKI_MOE_V5c = process.env.LOKI_MOE_V5c ?? '0x0f310C35C006a86BD0Df6595B1856ce8Ef06Bbd3';
assert(LOKI_MOE_V5c, 'missing LOKI_MOE_V5c env variable');
const ODIN_MOE_V5c = process.env.ODIN_MOE_V5c ?? '0x7577131aCA38c2B2CE2a3F7c447CCC2D6decc977';
assert(ODIN_MOE_V5c, 'missing ODIN_MOE_V5c env variable');
const THOR_MOE_V6a = process.env.THOR_MOE_V6a ?? '0x40A8b2Ed72c6E0DD82184d4a67bD19815BEb2a74';
assert(THOR_MOE_V6a, 'missing THOR_MOE_V6a env variable');
const LOKI_MOE_V6a = process.env.LOKI_MOE_V6a ?? '0x551b372ad7A7b85BaB113B273fd4c7924dfF4071';
assert(LOKI_MOE_V6a, 'missing LOKI_MOE_V6a env variable');
const ODIN_MOE_V6a = process.env.ODIN_MOE_V6a ?? '0x823B8a1B9c92312388F65758F53b13d8B75Df5a0';
assert(ODIN_MOE_V6a, 'missing ODIN_MOE_V6a env variable');
const THOR_MOE_V6b = process.env.THOR_MOE_V6b ?? '0xB6246857bDaC7d00dd01d5a5C2a70F9173109693';
assert(THOR_MOE_V6b, 'missing THOR_MOE_V6b env variable');
const LOKI_MOE_V6b = process.env.LOKI_MOE_V6b ?? '0xC18dBF3Ebe65146B60b70fEfb686E621267Fe877';
assert(LOKI_MOE_V6b, 'missing LOKI_MOE_V6b env variable');
const ODIN_MOE_V6b = process.env.ODIN_MOE_V6b ?? '0xb7442a0D56f26851236d63Ffb314802115814e3F';
assert(ODIN_MOE_V6b, 'missing ODIN_MOE_V6b env variable');
const THOR_MOE_V6c = process.env.THOR_MOE_V6c ?? '0xA56953C7581F40264d50aA0e057cf74b336c3114';
assert(THOR_MOE_V6c, 'missing THOR_MOE_V6c env variable');
const LOKI_MOE_V6c = process.env.LOKI_MOE_V6c ?? '0x1e6AB3d65Ad983202ebD92575aA5a168D0D6EBC9';
assert(LOKI_MOE_V6c, 'missing LOKI_MOE_V6c env variable');
const ODIN_MOE_V6c = process.env.ODIN_MOE_V6c ?? '0xc6e1BdC859d7d85136efC0bbd502C09E6c1D531A';
assert(ODIN_MOE_V6c, 'missing ODIN_MOE_V6c env variable');
const THOR_MOE_V7a = process.env.THOR_MOE_V7a ?? '0x853Aa1e221A722c327542eFE2b9034E2f9e4cF3D';
assert(THOR_MOE_V7a, 'missing THOR_MOE_V7a env variable');
const LOKI_MOE_V7a = process.env.LOKI_MOE_V7a ?? '0xd8bF63eD3384f32d6CD5Af9B72299AadB7872992';
assert(LOKI_MOE_V7a, 'missing LOKI_MOE_V7a env variable');
const ODIN_MOE_V7a = process.env.ODIN_MOE_V7a ?? '0x052be95B940151dEce41558590342Ab18f85C1BB';
assert(ODIN_MOE_V7a, 'missing ODIN_MOE_V7a env variable');
// MOE contract images
const THOR_MOE_IMAGE = process.env.THOR_MOE_IMAGE ?? "data:image/svg+xml,%3Csvg viewBox='0 0 480 480' id='svg72' width='480' height='480' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svg='http://www.w3.org/2000/svg'%3E%3Cdefs id='defs30'%3E%3Cstyle id='style2'%3E.cls-1%7Bfill:%2322262a;%7D.cls-10,.cls-11,.cls-12,.cls-13,.cls-14,.cls-15,.cls-16,.cls-17,.cls-18,.cls-19,.cls-2,.cls-3,.cls-4,.cls-5,.cls-6,.cls-7,.cls-8,.cls-9%7Bstroke:%2322262a;stroke-miterlimit:10;fill-rule:evenodd;%7D.cls-2%7Bfill:url(%23linear-gradient);%7D.cls-3%7Bfill:url(%23linear-gradient-2);%7D.cls-4%7Bfill:url(%23linear-gradient-3);%7D.cls-5%7Bfill:url(%23linear-gradient-4);%7D.cls-6%7Bfill:url(%23linear-gradient-5);%7D.cls-7%7Bfill:url(%23linear-gradient-6);%7D.cls-8%7Bfill:url(%23linear-gradient-7);%7D.cls-9%7Bfill:url(%23linear-gradient-8);%7D.cls-10%7Bfill:url(%23linear-gradient-9);%7D.cls-11%7Bfill:url(%23linear-gradient-10);%7D.cls-12%7Bfill:url(%23linear-gradient-11);%7D.cls-13%7Bfill:url(%23linear-gradient-12);%7D.cls-14%7Bfill:url(%23linear-gradient-13);%7D.cls-15%7Bfill:url(%23linear-gradient-14);%7D.cls-16%7Bfill:url(%23linear-gradient-15);%7D.cls-17%7Bfill:url(%23linear-gradient-16);%7D.cls-18%7Bfill:url(%23linear-gradient-17);%7D.cls-19%7Bfill:url(%23linear-gradient-18);%7D%3C/style%3E%3ClinearGradient id='linear-gradient' x1='166.59' y1='418.81' x2='197.08' y2='471.63' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23ff0' id='stop4' /%3E%3Cstop offset='0.27' stop-color='%23fbf801' id='stop6' /%3E%3Cstop offset='0.65' stop-color='%23f1e603' id='stop8' /%3E%3Cstop offset='1' stop-color='%23e4cf06' id='stop10' /%3E%3C/linearGradient%3E%3ClinearGradient id='linear-gradient-2' x1='189.23' y1='401.69' x2='207.67' y2='433.62' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-3' x1='193.89999' y1='387.98999' x2='214.62' y2='423.88' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-4' x1='204.77' y1='372.70999' x2='225.58' y2='408.75' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-5' x1='216.63' y1='356.17001' x2='237.41' y2='392.16' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-6' x1='228.75999' y1='339.26999' x2='249.67' y2='375.5' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-7' x1='240.58' y1='320.60999' x2='262' y2='357.70999' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-8' x1='253.82001' y1='302.42001' x2='274.87' y2='338.88' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-9' x1='266.20001' y1='283.38' x2='287.94' y2='321.03' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-10' x1='279.76999' y1='264.32999' x2='301.84' y2='302.56' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-11' x1='293.59' y1='242.92999' x2='316.72' y2='282.98999' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-12' x1='283.85999' y1='215.28' x2='339.14001' y2='311.01999' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-13' x1='274.45999' y1='197.24001' x2='283.20999' y2='212.39999' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-14' x1='300.64999' y1='167.35001' x2='307.06' y2='178.46001' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-15' x1='366.01999' y1='135.64999' x2='380.34' y2='160.45' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-16' x1='338.54999' y1='163.94' x2='351.23999' y2='185.92999' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-17' x1='349.64999' y1='176.52' x2='405.04999' y2='272.45999' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-18' x1='381.73001' y1='146.48' x2='438.29999' y2='244.46001' xlink:href='%23linear-gradient' /%3E%3ClinearGradient xlink:href='%23linear-gradient' id='linearGradient893' gradientUnits='userSpaceOnUse' x1='166.59' y1='418.81' x2='197.08' y2='471.63' /%3E%3C/defs%3E%3Crect class='cls-1' width='480' height='480' id='rect32' x='0' y='0' style='stroke-width:0.8' /%3E%3Cg id='g952' transform='translate(-59.156252,-59.91375)'%3E%3Cpath class='cls-2' d='m 198.3,432.52 c -5.58,0.56 -7.53,0.14 -9.92,-2.19 -1.76,-1.71 -2.53,-3.17 -3.49,-6.65 -0.89,-3.19 -1.44,-4.22 -3.42,-6.34 -1.98,-2.12 -3.83,-3 -6,-3 -1.56,0 -2,0.25 -12.32,8 -5.9,4.44 -10.8,8.19 -10.91,8.36 -0.11,0.17 0,3.08 0.82,10.43 0.58,5.47 1.42,13.72 1.72,17.1 a 19.35,19.35 0 0 0 0.46,3.26 c 0.17,0.16 20.64,8.23 25.53,10.06 l 1.92,0.72 8.94,-2.55 c 4.92,-1.41 10.9,-3.07 13.29,-3.72 a 23,23 0 0 0 4.57,-1.51 11.55,11.55 0 0 0 0.31,-2.75 c 0,-1.31 0.31,-5.69 0.58,-9.74 0.27,-4.05 0.68,-9.71 0.89,-12.58 0.25,-3.63 0.25,-5.35 0,-5.66 -1.09,-1.26 -7.12,-1.84 -12.97,-1.24 z' id='path34' style='fill:url(%23linearGradient893)' /%3E%3Cpath class='cls-3' d='m 213.34,412 c -1.48,-3.45 -5.2,-5.64 -10.45,-6.15 a 101.14,101.14 0 0 0 -15,0 c -6.37,0.52 -10.42,1.86 -11.43,3.74 -0.64,1.21 -0.17,1.76 2,2.4 3,0.86 4.44,1.71 5.9,3.4 a 18.67,18.67 0 0 1 3.7,7.26 c 1.1,3.61 2.85,5.45 6.1,6.39 0.7,0.2 2.84,0.12 6.11,-0.26 5.52,-0.62 7.7,-0.43 11,1 l 1.69,0.72 2.23,-2.23 v -4.64 c 0,-4.79 -0.64,-8.79 -1.85,-11.63 z' id='path36' style='fill:url(%23linear-gradient-2)' /%3E%3Cpath class='cls-4' d='m 223.41,398 c -1.51,-2.82 -4.42,-5.93 -6.11,-6.52 -1.69,-0.59 -19,-0.81 -23.61,-0.34 -1.63,0.18 -3.83,0.43 -4.87,0.58 l -1.9,0.27 -4,5.44 c -2.19,3 -4,5.57 -4,5.73 0,0.16 0.35,0.21 0.78,0.07 4.75,-1.41 7.57,-1.72 15.69,-1.73 14.24,0 17.91,1.27 20.73,7.31 a 23.2,23.2 0 0 1 2.18,9.7 c 0,1.72 0.09,3.1 0.13,3.1 0.04,0 2,-2.61 4.33,-5.82 l 4.27,-5.82 -0.23,-1.72 A 41.57,41.57 0 0 0 223.41,398 Z' id='path38' style='fill:url(%23linear-gradient-3)' /%3E%3Cpath class='cls-5' d='m 228.6,375.37 c -1.66,-0.8 -2.1,-0.84 -9.47,-0.91 -4.25,0 -8.51,0 -9.47,0.08 A 82.71,82.71 0 0 0 199,376.07 c -0.59,0.32 -4.33,5.14 -8.16,10.56 l -1.71,2.37 3.6,-0.22 c 2,-0.12 7.93,-0.21 13.24,-0.21 12,0 12.75,0.18 16,3.46 2.49,2.54 4.92,7.09 6.24,11.71 a 9.66,9.66 0 0 0 1.09,2.91 c 0.23,0 2.25,-2.73 8.67,-11.7 a 10.39,10.39 0 0 0 1.69,-3 c 0,-1.09 -2.65,-7 -4.3,-9.63 -2.12,-3.32 -4.59,-5.9 -6.76,-6.95 z' id='path40' style='fill:url(%23linear-gradient-4)' /%3E%3Cpath class='cls-6' d='m 242.38,360.43 a 6.23,6.23 0 0 0 -4.17,-2.2 97.38,97.38 0 0 0 -17,-0.38 c -5.43,0.45 -10.06,1.3 -11,2 -1.11,0.86 -9.26,12.85 -8.84,13 a 17.7,17.7 0 0 0 3.24,-0.26 c 7.45,-1 22,-0.81 25.05,0.35 a 22,22 0 0 1 3.73,3.22 32.51,32.51 0 0 1 7,10.92 l 1.15,2.64 4.8,-6.65 c 2.64,-3.65 4.88,-6.85 5,-7.12 a 8.3,8.3 0 0 0 -0.73,-2.9 33.54,33.54 0 0 0 -8.23,-12.62 z' id='path42' style='fill:url(%23linear-gradient-5)' /%3E%3Cpath class='cls-7' d='m 251.9,342.26 -2.28,-1.08 -7.54,-0.05 c -4.14,0 -8.16,0 -8.94,0.1 -2.37,0.23 -8.68,1.21 -10.21,1.58 -1.37,0.35 -1.66,0.68 -5.91,6.83 a 75,75 0 0 0 -4.31,6.64 23.39,23.39 0 0 0 3.8,-0.34 c 7.78,-1.05 19.11,-1 23.51,0.13 3.82,1 10.3,8.93 12.95,15.9 l 0.51,1.33 5.69,-8 5.69,-7.95 -1.57,-3 c -3.11,-5.97 -6.8,-9.9 -11.39,-12.09 z' id='path44' style='fill:url(%23linear-gradient-6)' /%3E%3Cpath class='cls-8' d='m 269.53,325.24 a 15,15 0 0 0 -7.61,-3.83 70.88,70.88 0 0 0 -12,-0.15 108,108 0 0 0 -12.1,1.91 l -3,0.73 -5.5,7.91 c -3,4.31 -5.38,7.88 -5.38,8 a 25.21,25.21 0 0 0 3.58,-0.43 c 1.91,-0.31 6.71,-0.64 10.66,-0.75 12.61,-0.38 15.36,0.43 21.32,6.29 a 31.39,31.39 0 0 1 5.88,8.08 l 1.1,2.06 3.83,-5.33 5.69,-7.73 1.79,-2.52 -0.44,-1.67 a 28.29,28.29 0 0 0 -7.82,-12.57 z' id='path46' style='fill:url(%23linear-gradient-7)' /%3E%3Cpath class='cls-9' d='m 283.68,309.58 c -5.23,-5.61 -7.29,-6.5 -15.47,-6.63 -3.09,-0.06 -6.17,0 -6.84,0.06 a 76,76 0 0 0 -9.94,1.78 c -3.64,0.88 -3.86,1 -4.87,2.35 -2,2.76 -9.25,13.22 -9.25,13.42 0,0 1.72,-0.21 3.74,-0.58 8.67,-1.55 18.59,-1.78 23.27,-0.54 5.24,1.38 11.09,7.22 14,14 a 9.25,9.25 0 0 0 1.43,2.59 72.41,72.41 0 0 0 5.83,-7.55 l 5.48,-7.65 -0.51,-1.23 a 43.11,43.11 0 0 0 -6.87,-10.02 z' id='path48' style='fill:url(%23linear-gradient-8)' /%3E%3Cpath class='cls-10' d='m 300.93,296.58 a 40.9,40.9 0 0 0 -8.65,-9.28 c -3.17,-2.54 -4.2,-3.09 -6.89,-3.68 -2.69,-0.59 -12,-0.55 -15.87,0.06 -4.77,0.75 -7.65,1.76 -8.67,3.07 -1.6,2 -10.86,15.35 -10.86,15.62 a 23.32,23.32 0 0 0 3.37,-0.59 c 6.49,-1.39 15.3,-1.87 20.28,-1.09 a 19.38,19.38 0 0 1 10.08,5.41 46.89,46.89 0 0 1 8,10.45 4.9,4.9 0 0 0 1.1,1.65 c 0.29,0 10.23,-14 10.74,-15.08 0.51,-1.08 -0.47,-3.22 -2.63,-6.54 z' id='path50' style='fill:url(%23linear-gradient-9)' /%3E%3Cpath class='cls-11' d='m 264.31,282 a 15.47,15.47 0 0 0 3.07,-0.44 c 3.76,-0.75 14.14,-1.08 17.18,-0.55 3.94,0.7 4.83,1.09 8.32,3.72 A 40.08,40.08 0 0 1 304.6,298 l 1.15,2.29 5.42,-7.61 c 3.44,-4.86 5.4,-7.92 5.36,-8.42 -0.06,-1.22 -2.74,-5.66 -5.43,-9 -2.89,-3.6 -7.74,-7.93 -10.22,-9.12 -3,-1.46 -8.46,-1.88 -15.39,-1.22 -3.91,0.38 -9.66,1.58 -10.63,2.22 -0.81,0.56 -10.81,14.6 -10.55,14.86 z' id='path52' style='fill:url(%23linear-gradient-10)' /%3E%3Cpath class='cls-12' d='m 277.52,263.75 c 5,-1.39 17.47,-1.86 21.67,-0.83 3.61,0.88 8.4,4.51 12.85,9.7 2.57,3 6.13,8.27 6.13,9.06 0,0.79 0.69,0.16 3.83,-4.26 7,-9.87 7.44,-10.8 7.49,-16.19 0,-5.65 -1.78,-9.93 -6.06,-14.2 a 23.57,23.57 0 0 0 -9.81,-6 c -1.8,-0.61 -3.29,-0.81 -7,-0.9 a 42.07,42.07 0 0 0 -6.13,0.18 31.54,31.54 0 0 0 -7.88,3.17 c -2.91,1.86 -4,3.29 -13.52,17 -2.09,3.04 -2.31,3.52 -1.57,3.27 z' id='path54' style='fill:url(%23linear-gradient-11)' /%3E%3Cpath class='cls-13' d='m 379.77,252.16 c -7.13,-9 -9.8,-12.41 -25.31,-32 l -20.12,-25.38 c -2.37,-3 -4.59,-5.5 -4.9,-5.53 a 81.64,81.64 0 0 0 -8.81,4.76 c -4.53,2.66 -18.74,10.9 -31.55,18.33 -22.8,13.22 -33,19.14 -54,31.34 -6.51,3.79 -10.3,6.19 -10.3,6.53 0,0.57 1.53,2.76 17.19,25.41 5.79,8.37 10.67,15.18 10.86,15.18 0.19,0 2.32,-2.8 22.33,-30.8 6.55,-9.15 12.32,-17.1 12.82,-17.65 1.13,-1.23 7.12,-4.18 10.2,-5 1.71,-0.47 3.61,-0.63 7.55,-0.64 4.56,0 5.61,0.11 7.89,0.82 7.83,2.45 13.65,7 17,13.34 2.3,4.41 2.9,9.44 1.8,15.18 -0.47,2.49 -0.75,3 -3.79,7.36 -3.78,5.4 -11.39,16.32 -21.81,31.32 -4,5.79 -8.08,11.6 -9,12.92 a 13.54,13.54 0 0 0 -1.6,2.51 24.25,24.25 0 0 0 3.62,-1.4 c 1.93,-0.83 10.12,-4.31 18.23,-7.72 l 22.44,-9.47 17,-7.18 c 40.2,-17 40.51,-17.1 41,-17.7 0.3,-0.36 -1.37,-2.68 -7.38,-10.24 -4.31,-5.38 -9.39,-11.81 -11.36,-14.29 z' id='path56' style='fill:url(%23linear-gradient-12)' /%3E%3Cpath class='cls-14' d='m 227.24,244.71 c 1.51,-0.9 17.27,-10.15 35,-20.57 l 44,-25.85 c 6.46,-3.81 13,-7.65 14.55,-8.54 l 2.81,-1.63 5.7,-11.12 c 3.13,-6.12 5.7,-11.32 5.7,-11.57 0,-0.51 -0.76,-0.58 -1.24,-0.1 -0.48,0.48 -3.76,2.24 -24.53,13.67 -6.56,3.62 -26.13,14.46 -43.48,24.09 -17.35,9.63 -32.93,18.26 -34.63,19.18 a 14.71,14.71 0 0 0 -3.38,2.25 49.68,49.68 0 0 0 -1.24,5.5 c -0.5,2.7 -1.07,5.62 -1.24,6.48 -0.3,1.53 -1.26,6.85 -1.58,8.85 -0.22,1.37 0.32,1.26 3.56,-0.64 z' id='path58' style='fill:url(%23linear-gradient-13)' /%3E%3Cpath class='cls-15' d='m 234.36,216.53 c 0.21,0 6.27,-3.18 13.44,-7.05 l 19.71,-10.67 24.37,-13.15 c 9.74,-5.25 20.23,-10.91 23.31,-12.59 l 12.39,-6.7 6.77,-3.67 15.34,-13.15 19.4,-16.65 c 3.8,-3.26 4.78,-4.42 3.7,-4.36 -0.24,0 -7.15,3.69 -15.34,8.16 -8.19,4.47 -23,12.56 -32.79,17.92 -9.79,5.36 -21.66,11.87 -26.36,14.45 -4.7,2.58 -8.86,4.83 -9.31,5 -0.45,0.17 -3.16,2.15 -6.06,4.38 -2.9,2.23 -7.62,5.88 -10.52,8.09 -31.52,24.17 -38.23,29.36 -38.33,29.64 -0.1,0.28 0.06,0.35 0.28,0.35 z' id='path60' style='fill:url(%23linear-gradient-14)' /%3E%3Cpath class='cls-16' d='m 342.73,160.58 c 0,0.21 3.19,1.7 7.09,3.33 7.56,3.15 8.71,3.63 12,5.09 l 2.1,0.93 3.34,-3.44 c 22,-22.69 33.48,-34.79 33.6,-35.48 0.09,-0.54 -0.23,-0.67 -2.11,-0.86 -1.21,-0.13 -3.39,-0.39 -4.84,-0.6 -1.45,-0.21 -4.45,-0.59 -6.66,-0.86 l -5.79,-0.72 -1.75,-0.22 -16.14,14.15 c -21.57,18.86 -20.86,18.24 -20.84,18.68 z' id='path62' style='fill:url(%23linear-gradient-15)' /%3E%3Cpath class='cls-17' d='m 343,164.15 -2.7,-1.23 -4.92,9 c -2.71,4.95 -4.93,9.21 -4.93,9.49 0,0.28 0.64,0.47 3.77,0.3 14.39,-0.81 18,-1 22.16,-1.21 l 4.72,-0.24 0.25,-1.23 a 31,31 0 0 0 0.34,-3.82 l 0.08,-2.59 -6.11,-2.78 c -3.36,-1.52 -7,-3.14 -8,-3.6 -1,-0.46 -3.18,-1.41 -4.66,-2.09 z' id='path64' style='fill:url(%23linear-gradient-16)' /%3E%3Cpath class='cls-18' d='m 363.58,184.8 -4.2,-0.05 c -2.32,0 -8.95,0.1 -14.72,0.28 a 96.54,96.54 0 0 0 -10.83,0.63 c -0.21,0.21 -0.08,0.7 0.31,1.31 0.39,0.61 8.47,11 18,23.24 9.53,12.24 21.36,27.32 26.17,33.49 19.54,25 23.73,30.34 24,30.34 0.27,0 15.54,-16 15.7,-16.45 0,-0.16 -12.2,-16.57 -27.18,-36.5 z' id='path66' style='fill:url(%23linear-gradient-17)' /%3E%3Cpath class='cls-19' d='m 447.28,194.67 c -0.38,-0.42 -5,-6.91 -10.26,-14.43 -5.26,-7.52 -11.75,-16.76 -14.4,-20.52 -2.65,-3.76 -6.93,-9.81 -9.49,-13.45 -6.85,-9.73 -8.82,-12.31 -9.4,-12.39 -0.29,0 -1.13,0.59 -1.88,1.4 -0.75,0.81 -9.22,9.37 -18.84,19 l -17.52,17.54 -0.52,4.9 c -0.28,2.7 -0.51,5.06 -0.51,5.24 0,0.35 2.07,3.18 7,9.65 1.27,1.64 3.93,5.11 5.93,7.72 2,2.61 9.4,12.23 16.43,21.38 l 19.47,25.34 c 3.67,4.77 6.84,8.67 7,8.67 0.44,0 0.59,-0.26 5.89,-10.16 4.59,-8.61 4.57,-8.58 14.11,-26.65 3.62,-6.85 6.7,-12.61 6.84,-12.8 a 31,31 0 0 0 0.51,-5 c 0.36,-4.36 0.29,-4.74 -0.36,-5.44 z' id='path68' style='fill:url(%23linear-gradient-18)' /%3E%3C/g%3E%3C/svg%3E";
assert(typeof THOR_MOE_IMAGE === 'string', 'missing THOR_MOE_IMAGE env variable');
const LOKI_MOE_IMAGE = process.env.LOKI_MOE_IMAGE ?? "data:image/svg+xml,%3Csvg viewBox='0 0 480 480' id='svg49' width='480' height='480' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svg='http://www.w3.org/2000/svg'%3E%3Cdefs id='defs29'%3E%3Cstyle id='style2'%3E.cls-1%7Bfill:%2322262a;%7D.cls-2,.cls-3,.cls-4,.cls-5,.cls-6,.cls-7,.cls-8%7Bstroke:%2317492c;stroke-miterlimit:10;fill-rule:evenodd;%7D.cls-2%7Bfill:url(%23linear-gradient);%7D.cls-3%7Bfill:url(%23linear-gradient-2);%7D.cls-4%7Bfill:url(%23linear-gradient-3);%7D.cls-5%7Bfill:url(%23linear-gradient-4);%7D.cls-6%7Bfill:url(%23linear-gradient-5);%7D.cls-7%7Bfill:url(%23linear-gradient-6);%7D.cls-8%7Bfill:url(%23linear-gradient-7);%7D%3C/style%3E%3ClinearGradient id='linear-gradient' x1='193.78' y1='443.70999' x2='229.10001' y2='443.70999' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='lime' id='stop4' /%3E%3Cstop offset='0.43' stop-color='%2300fd00' id='stop6' /%3E%3Cstop offset='0.58' stop-color='%2300f600' id='stop8' /%3E%3Cstop offset='0.69' stop-color='%2300eb00' id='stop10' /%3E%3Cstop offset='0.78' stop-color='%2300da00' id='stop12' /%3E%3Cstop offset='0.86' stop-color='%2300c400' id='stop14' /%3E%3Cstop offset='0.93' stop-color='%2300a800' id='stop16' /%3E%3Cstop offset='0.99' stop-color='%23008900' id='stop18' /%3E%3Cstop offset='1' stop-color='green' id='stop20' /%3E%3C/linearGradient%3E%3ClinearGradient id='linear-gradient-2' x1='195.17999' y1='440.20999' x2='352.32999' y2='440.20999' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-3' x1='197.17999' y1='426.32999' x2='353.60999' y2='426.32999' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-4' x1='194.44' y1='370.32999' x2='379.09' y2='370.32999' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-5' x1='254.82001' y1='237.95' x2='347.35001' y2='237.95' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-6' x1='244.61' y1='223.39999' x2='365.23999' y2='223.39999' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-7' x1='196.46001' y1='253.25999' x2='406.22' y2='253.25999' xlink:href='%23linear-gradient' /%3E%3ClinearGradient xlink:href='%23linear-gradient' id='linearGradient870' gradientUnits='userSpaceOnUse' x1='193.78' y1='443.70999' x2='229.10001' y2='443.70999' /%3E%3C/defs%3E%3Crect class='cls-1' width='480' height='480' id='rect31' x='0' y='0' style='stroke-width:0.8' /%3E%3Cg id='g896' transform='translate(-59.796875,-60.132812)'%3E%3Cpath class='cls-2' d='m 224.75,464.38 c -2.85,-9.22 -2.87,-21.08 0,-32.87 0.42,-1.77 0.77,-3.35 0.77,-3.51 0,-0.43 -2.34,-1.07 -6.46,-1.75 -9.11,-1.52 -14.87,-4.43 -20.37,-10.34 -3,-3.25 -3.08,-3.29 -3.46,-2.29 -1.2,3.16 -1.42,4.92 -1.42,11.22 0,5.87 0.12,7.19 1.07,11 4,15.94 14.3,30.18 26.17,36.16 3.63,1.82 7.24,2.87 7.84,2.26 0.34,-0.33 0.33,-0.63 0,-1.15 a 42.11,42.11 0 0 1 -4.14,-8.73 z' id='path33' style='fill:url(%23linearGradient870)' /%3E%3Cpath class='cls-3' d='m 319.73,435.27 a 65.52,65.52 0 0 0 -25.61,-6.37 68.45,68.45 0 0 1 -18.26,-3.29 c -4,-1.24 -4.79,-1.62 -13.36,-6.37 a 48.64,48.64 0 0 0 -14.14,-5.53 c -6.09,-1.42 -17.34,-2.69 -21.13,-2.39 a 26.38,26.38 0 0 1 -13.46,-2.51 c -3,-1.66 -4.56,-2.82 -9.12,-6.86 a 42.65,42.65 0 0 0 -4.11,-3.34 5.69,5.69 0 0 0 -4,-0.16 c -0.51,0.37 -1.41,4.66 -1.38,6.6 0.03,1.94 0.46,2.55 4,6.45 a 34.46,34.46 0 0 0 9.91,7.78 c 4.09,2 12.3,4.07 19,4.75 a 136.68,136.68 0 0 1 18.18,3.29 98.77,98.77 0 0 1 10.51,4.62 c 10.91,5.38 18.53,7.48 35.8,9.9 19.11,2.66 26.79,5.64 34.38,13.32 4.41,4.46 7,8.54 9.9,15.53 1,2.48 2.59,6 3.48,7.82 1.48,3.08 1.71,3.36 3.05,3.6 a 17.76,17.76 0 0 0 7.68,-0.71 c 1.09,-0.52 1.16,-0.72 1.2,-3 0.09,-5.07 -2.61,-13.48 -6.27,-19.55 a 59.51,59.51 0 0 0 -26.25,-23.58 z' id='path35' style='fill:url(%23linear-gradient-2)' /%3E%3Cpath class='cls-4' d='m 325.41,429.15 c -11,-5.82 -24.45,-9.55 -34.46,-9.58 -4,0 -7,-0.59 -13.28,-2.62 a 55,55 0 0 1 -14.44,-6.7 c -8.45,-5.48 -12,-6.38 -28.24,-7.24 -10.74,-0.57 -18.14,-2.7 -26.05,-7.46 -3,-1.84 -7.77,-3.32 -9.13,-2.87 -0.22,0.07 -0.9,0.25 -1.51,0.38 -0.84,0.18 -1.12,0.48 -1.12,1.21 0,1.07 0.67,1.45 2.61,1.45 1.94,0 4.26,0.91 8.25,3.22 8.79,5.07 16.23,7.08 28.3,7.69 8.12,0.41 11.86,0.85 15.56,1.82 2.94,0.77 4.53,1.58 9.56,4.89 5.71,3.73 9.93,5.56 19,8.26 3.56,1 5.34,1.31 10.92,1.62 a 67.25,67.25 0 0 1 19.81,3.78 c 6.22,2.06 16.65,7.2 20.47,10.09 4.71,3.54 11.36,10.29 16.5,16.72 l 5,6.24 c 0.08,0.09 0.25,0.06 0.39,-0.07 0.41,-0.41 -1.35,-3.88 -4.12,-8.12 -7.22,-11.09 -13.84,-17.33 -24.02,-22.71 z' id='path37' style='fill:url(%23linear-gradient-3)' /%3E%3Cpath class='cls-5' d='m 377.87,327.2 a 10.46,10.46 0 0 0 -0.52,2 c -1.23,6.57 -6.42,13.29 -11.54,15 -2.43,0.8 -5.92,0.61 -7.48,-0.41 -0.53,-0.35 -3.39,-1.75 -6.34,-3.09 -31.53,-14.46 -63.38,-16.84 -85.85,-6.46 -9.77,4.52 -18.25,12.93 -22,21.85 -2.33,5.53 -2.94,8.53 -3.16,15.6 a 48.56,48.56 0 0 0 1.75,15.82 c 0.39,1.44 -1.87,3.57 -5,4.74 -7.56,2.83 -10.14,2.59 -19.59,-1.79 -10,-4.61 -14.2,-5.41 -18.65,-3.53 -2,0.85 -5.27,2.77 -5,3 a 19.87,19.87 0 0 0 2.84,-0.32 q 7.52,-1.16 20,6.53 c 5.09,3.14 8.84,3.78 20.1,3.44 12.41,-0.36 19.35,0.81 25.69,4.4 2.78,1.57 4.57,2.92 8.81,6.66 3.8,3.34 4.93,3.65 6.72,1.87 2,-2 1.91,-3.8 -0.35,-6.64 -1.79,-2.24 -3.7,-7.08 -4.3,-11 -0.88,-5.56 0.38,-19.87 2.33,-26.62 4.19,-14.46 13.76,-23.48 26.12,-24.64 7.75,-0.73 15.8,1 24.28,5.26 a 51.86,51.86 0 0 1 9.34,5.75 c 3.32,2.73 5.86,3.17 7.84,1.36 1.36,-1.21 1.24,-3.94 -0.27,-6.57 -1.51,-2.63 -5.26,-6.1 -8.82,-8.24 -3.17,-1.9 -2.67,-2.11 1.12,-0.5 7.43,3.18 13.11,9.16 13.59,14.34 0.24,2.45 -0.52,4 -2.81,5.72 -3.08,2.35 -5.62,1.8 -12.41,-2.71 a 67.34,67.34 0 0 0 -19.93,-9.28 29.72,29.72 0 0 0 -8.38,-0.86 c -4.45,0 -5.42,0.12 -8,1 -8.74,3.14 -14.15,9.5 -16.93,19.93 -1,3.72 -1.08,4.71 -1.1,12.14 0,8.27 0.54,13.64 1.63,15.06 0.46,0.6 0.54,-0.29 0.55,-5.71 0,-10.18 1.53,-17.93 4.54,-23.31 5.34,-9.54 14.39,-14.23 24.94,-12.92 7.07,0.87 14.2,4 21.47,9.5 a 87.28,87.28 0 0 1 14.39,14.59 c 4,5.4 4.52,5.82 6.7,5.82 a 3.16,3.16 0 0 0 3.14,-1.4 19.34,19.34 0 0 0 4.13,-7.89 c 1.18,-4.24 2.56,-6.85 10.17,-19.22 5.53,-9 6.73,-12.35 7.27,-20.26 0.35,-5.16 0.32,-6.32 -0.17,-7.26 -0.36,-0.6 -0.73,-0.95 -0.86,-0.75 z' id='path39' style='fill:url(%23linear-gradient-4)' /%3E%3Cpath class='cls-6' d='m 260.49,281.41 c -4.52,0.36 -5.67,0.57 -5.67,1 0,1 3.54,1.32 9.91,0.85 a 82.46,82.46 0 0 0 31.59,-9 c 19.56,-9.79 35.53,-25.28 44.19,-42.9 A 62.15,62.15 0 0 0 347.22,208 c 0.51,-6.52 -0.5,-15.12 -1.83,-15.56 -0.22,-0.07 -0.37,3.67 -0.37,9.08 0,9.06 0,9.27 -1.29,14.06 -4.73,17.64 -16.53,34.42 -32.94,46.65 -15.48,11.56 -31.46,17.66 -50.3,19.18 z' id='path41' style='fill:url(%23linear-gradient-5)' /%3E%3Cpath class='cls-7' d='M 344.94,237.16 A 95.35,95.35 0 0 1 302.33,279 c -11.12,5.52 -21.29,8.19 -32.74,8.6 a 57.49,57.49 0 0 1 -19.12,-2 c -2.83,-0.7 -5.27,-1.15 -5.41,-1 -0.6,0.59 -0.6,4.65 0,7.47 0.8,3.75 3.77,10 5.56,11.66 1.57,1.45 5.77,3 11.75,4.19 22.43,4.67 45.86,-0.88 65.45,-15.49 a 111.87,111.87 0 0 0 17.28,-17.32 c 10.17,-13.64 16.17,-27.8 19.19,-45.24 0.82,-4.76 0.95,-6.78 0.95,-15.78 0,-10.44 -0.22,-12.71 -1.88,-20.79 a 97.07,97.07 0 0 0 -12.11,-30.67 c -8,-12.92 -20.27,-22.24 -32.56,-24.77 -2.8,-0.59 -6.24,-0.83 -6.24,-0.44 a 23.52,23.52 0 0 0 3.33,1.44 54,54 0 0 1 19.48,12.71 58,58 0 0 1 11.59,16.61 c 5.55,11.39 7.44,19.76 7.41,33 0,8.7 -0.52,12.5 -2.62,19.79 a 76.5,76.5 0 0 1 -6.7,16.19 z' id='path43' style='fill:url(%23linear-gradient-6)' /%3E%3Cpath class='cls-8' d='m 209.72,379.74 c 0.56,0.16 4,1.63 7.68,3.25 11.73,5.16 16.94,6.59 19.6,5.39 1.45,-0.67 1.58,-1.55 0.66,-4.32 -2.37,-7 -2.69,-18.85 -0.72,-26.41 4.13,-15.81 16.12,-26.24 36.49,-31.73 24.33,-6.58 52.66,-3.29 79.41,9.23 2,0.92 3.33,1.32 4.05,1.19 2.09,-0.4 13,-11.79 19.32,-20.1 20.91,-27.68 32,-64.66 29.7,-98.69 -1,-14.8 -3.54,-26.52 -8.39,-38.83 -11.92,-30.25 -34.53,-51.44 -62.36,-58.44 a 85.39,85.39 0 0 0 -26.55,-2.37 c -10.93,0.59 -20.47,3 -32.81,8.18 -7.54,3.18 -20.37,11.14 -20.37,12.62 0,0.91 0.74,0.68 4,-1.22 19.41,-11.38 39.67,-14.23 58.68,-8.25 a 78.36,78.36 0 0 1 18,9 c 18.12,13.06 30.27,34.34 35.46,62.1 0.82,4.45 0.93,6.26 0.92,14.78 0,10.54 -0.39,13.72 -2.61,22.52 A 104.79,104.79 0 0 1 355,270.91 c -12.16,18.29 -29.77,32.88 -48.38,40.06 -18.91,7.29 -37.15,7 -54.17,-1 -5.36,-2.49 -11.44,-7.17 -13.67,-10.51 -1.21,-1.82 -1.25,-2 -1.12,-5.72 0.1,-3 0.33,-4.25 1.05,-5.69 3.58,-7.29 14.13,-12.89 25.38,-13.51 2.22,-0.12 6.49,-0.5 9.5,-0.82 3.01,-0.32 6.82,-0.72 8.5,-0.84 5.51,-0.4 5.8,-0.68 2.49,-2.36 -6.81,-3.44 -19.4,-5.6 -32.63,-5.6 a 104.37,104.37 0 0 0 -22.66,2.13 c -8.33,1.68 -11.59,2.8 -12.27,4.2 -2,4.24 -3,16.56 -1.89,24 a 40.9,40.9 0 0 1 0.54,4.67 c -3.62,2.16 -6,4.75 -9.32,10 -11.71,18.64 -13.39,52.42 -3.28,65.79 0.98,1.29 4.34,3.34 6.65,4.03 z' id='path45' style='fill:url(%23linear-gradient-7)' /%3E%3C/g%3E%3C/svg%3E";
assert(typeof LOKI_MOE_IMAGE === 'string', 'missing LOKI_MOE_IMAGE env variable');
const ODIN_MOE_IMAGE = process.env.ODIN_MOE_IMAGE ?? "data:image/svg+xml,%3Csvg viewBox='0 0 480 480' id='svg27' width='480' height='480' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svg='http://www.w3.org/2000/svg'%3E%3Cdefs id='defs19'%3E%3Cstyle id='style2'%3E.cls-1%7Bfill:%2322262a;%7D.cls-2%7Bstroke:%23174547;stroke-miterlimit:10;fill-rule:evenodd;fill:url(%23linear-gradient);%7D%3C/style%3E%3ClinearGradient id='linear-gradient' x1='300' y1='109.87' x2='300' y2='490.13' gradientUnits='userSpaceOnUse' gradientTransform='translate(-60.114272,-60.093146)'%3E%3Cstop offset='0' stop-color='%2300fffe' id='stop4' /%3E%3Cstop offset='0.18' stop-color='%2300fbfa' id='stop6' /%3E%3Cstop offset='0.36' stop-color='%2300efee' id='stop8' /%3E%3Cstop offset='0.53' stop-color='%2300dcdb' id='stop10' /%3E%3Cstop offset='0.71' stop-color='%2300c1c0' id='stop12' /%3E%3Cstop offset='0.88' stop-color='%23009e9d' id='stop14' /%3E%3Cstop offset='1' stop-color='%2300807f' id='stop16' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect class='cls-1' width='480' height='480' id='rect21' x='0' y='0' style='stroke-width:0.8' /%3E%3Cpath class='cls-2' d='m 172.54573,49.906853 c -26,2.83 -45.68,22.920001 -49,50.139997 a 85.72,85.72 0 0 0 0.72,20.54 74.33,74.33 0 0 0 11.31,26.68 c 4.71,6.56 12.4,13.8 17.78,16.73 l 1.8,1 2.48,-2.51 c 7.6,-7.71 14.81,-20.54 17.51,-31.18 0.61,-2.41 0.78,-3.71 0.54,-4.15 a 11.26,11.26 0 0 0 -2.8,-2.08 32.8,32.8 0 0 1 -12.27,-13.56 c -4.31,-9 -4.65,-19.639997 -1,-30.459997 a 48.57,48.57 0 0 1 10.66,-17.34 43.2,43.2 0 0 1 13.09,-9.54 c 5.1,-2.45 5.47,-3.06 2.27,-3.7 a 79.44,79.44 0 0 0 -13.09,-0.57 z m 125.69,0 c -0.71,0.08 -2.4,0.33 -3.76,0.55 -3.66,0.6 -3.36,1.19 1.9,3.72 a 46.41,46.41 0 0 1 21.37,21.290001 c 6,12.06 6.54,25.319996 1.42,35.999996 a 32.8,32.8 0 0 1 -12.28,13.57 11.26,11.26 0 0 0 -2.8,2.08 c -0.24,0.44 -0.07,1.74 0.54,4.15 2.7,10.64 9.91,23.47 17.51,31.18 l 2.48,2.51 1.8,-1 c 5.38,-2.93 13.07,-10.17 17.78,-16.73 a 74.33,74.33 0 0 0 11.31,-26.68 85.72,85.72 0 0 0 0.72,-20.54 c -3.11,-25.439996 -20.69,-44.999996 -44.42,-49.449996 a 75.37,75.37 0 0 0 -13.57,-0.650001 z m -59.57,45.900001 c -3.82,5.539996 -7.22,18.099996 -5.68,20.999996 a 12.15,12.15 0 0 0 3.69,2.57 l 3.21,1.68 3.21,-1.68 a 12.15,12.15 0 0 0 3.69,-2.57 c 1.13,-2.11 -0.57,-10.7 -3.25,-16.45 -1.51,-3.219996 -3.17,-5.909996 -3.65,-5.909996 a 4.5,4.5 0 0 0 -1.22,1.36 z m -20.78,21.569996 a 11.61,11.61 0 0 0 -3.26,1.53 l -1.27,1 1.93,0.5 a 25,25 0 0 1 11.24,6.89 c 7.77,7.74 9.89,15.43 8.58,31.2 -0.88,10.62 -3.13,17.72 -6.43,20.23 -1.07,0.82 -1.81,1 -5.3,1.3 a 38.84,38.84 0 0 0 -28,15.68 41.77,41.77 0 0 0 -6.41,13.64 25.62,25.62 0 0 0 -0.82,8.87 c 0.11,4.13 0.24,5.15 0.75,5.66 0.51,0.51 0.71,0.42 2.07,-2.53 a 37,37 0 0 1 7.92,-11.46 24.5,24.5 0 0 1 10.39,-6.53 c 2.91,-1 3.65,-1.12 7.62,-1.12 3.97,0 4.8,0.14 7.34,1 a 29.12,29.12 0 0 1 13.77,10.09 c 0.7,1 1.53,1.85 1.83,1.85 0.3,0 1.13,-0.83 1.83,-1.85 a 29.12,29.12 0 0 1 13.77,-10.09 c 2.54,-0.86 3.51,-1 7.34,-1 3.83,0 4.71,0.11 7.62,1.12 a 24.5,24.5 0 0 1 10.49,6.49 37,37 0 0 1 7.92,11.46 c 1.36,3 1.49,3.11 2.07,2.53 0.58,-0.58 0.64,-1.53 0.75,-5.66 a 25.62,25.62 0 0 0 -0.82,-8.87 39,39 0 0 0 -34.36,-29.32 c -3.49,-0.3 -4.23,-0.48 -5.3,-1.3 -3.3,-2.51 -5.55,-9.61 -6.43,-20.23 -1.31,-15.77 0.81,-23.46 8.58,-31.2 a 25,25 0 0 1 11.24,-6.89 l 1.93,-0.5 -1.27,-1 a 12.48,12.48 0 0 0 -3.63,-1.58 c -5.11,-1.31 -14.33,0.42 -20,3.76 l -1.6,0.94 -1.6,-0.94 c -5.77,-3.29 -15.48,-5.07 -20.48,-3.67 z m -10.29,6 a 17.59,17.59 0 0 0 -8,4.67 c -2.55,2.36 -3.9,5.19 -5.4,11.28 a 81.92,81.92 0 0 1 -17,32.83 31,31 0 0 1 -3.26,3.4 10.16,10.16 0 0 0 -1.93,1.56 c -1.46,1.35 -1.84,2 -2.82,5 -2.07,6.4 -3.22,13.72 -2.91,18.65 0.11,1.75 0.5,5.75 0.86,8.88 0.84,7.21 1,35.53 0.2,42.93 -1.32,12.75 -3,21.73 -5.08,27.89 -1.73,5 -3.27,7.53 -5.14,8.31 -1.87,0.78 -1.57,1.37 0.51,1.07 3.23,-0.46 6.18,-2.16 9.46,-5.44 6.67,-6.67 11.67,-16.9 15.59,-31.83 2.63,-10 3.62,-18.22 4,-33.21 0.26,-9.94 0.42,-12.15 1.05,-14.42 2.44,-8.95 9,-17.21 17.86,-22.39 5.42,-3.18 12.39,-5.51 16.79,-5.61 4,-0.1 4.82,-0.44 6.17,-2.63 1.46,-2.37 2,-3.8 3.29,-9.12 2.52,-10.19 2.37,-19.71 -0.41,-26.85 -2.24,-5.73 -7,-11.27 -11.71,-13.54 -4.71,-2.27 -7.83,-2.58 -12.12,-1.45 z m 56.59,-0.14 c -6.52,1.58 -12.93,7.72 -15.83,15.15 -2.78,7.14 -2.93,16.66 -0.41,26.85 1.32,5.32 1.83,6.75 3.29,9.12 1.35,2.19 2.15,2.53 6.17,2.63 4.4,0.1 11.37,2.43 16.79,5.61 8.82,5.18 15.42,13.44 17.86,22.39 0.63,2.27 0.79,4.48 1.05,14.42 0.41,15 1.4,23.18 4,33.21 3.92,14.93 8.92,25.16 15.59,31.83 3.28,3.28 6.23,5 9.46,5.44 2.08,0.3 2.36,-0.3 0.51,-1.07 -4.37,-1.83 -8,-14.6 -10.22,-36.2 -0.77,-7.4 -0.64,-35.72 0.2,-42.93 0.36,-3.13 0.75,-7.13 0.86,-8.88 0.31,-4.93 -0.84,-12.25 -2.91,-18.65 -1,-3 -1.36,-3.69 -2.82,-5 a 10.16,10.16 0 0 0 -1.93,-1.56 31,31 0 0 1 -3.26,-3.4 81.92,81.92 0 0 1 -17,-32.83 c -1.51,-6.11 -2.85,-8.91 -5.42,-11.3 -4.87,-4.59 -10.28,-6.22 -15.98,-4.85 z m -85.81,5.62 a 8.13,8.13 0 0 0 -0.87,2.84 53.93,53.93 0 0 1 -5.11,14.32 c -3.77,7.57 -8.83,14.73 -13.06,18.45 l -1.61,1.44 0.66,1.09 c 0.69,1.13 4.3,4.14 6.73,5.61 a 20,20 0 0 0 5.81,2.23 c 1.65,0 9.55,-10.5 14.06,-18.67 3.59,-6.53 7.07,-15.35 7.44,-18.94 l 0.2,-1.84 -2.33,-1.88 a 40.66,40.66 0 0 0 -3.62,-2.64 c -2.11,-1.26 -7.5,-2.55 -8.3,-2.03 z m 119.61,0.27 a 17,17 0 0 0 -8.14,4.07 l -2.7,2.16 0.19,1.84 c 0.39,3.6 3.86,12.42 7.45,18.95 4.51,8.17 12.41,18.67 14.06,18.67 a 20,20 0 0 0 5.81,-2.23 c 2.43,-1.47 6,-4.48 6.73,-5.61 l 0.66,-1.09 -1.61,-1.42 c -7.63,-6.71 -16.27,-22.31 -18.17,-32.77 -0.62,-3.41 -0.58,-3.39 -4.28,-2.59 z m -56.48,52.69 c 1.53,1.82 2.23,4.75 2.23,9.33 0,4.32 -0.42,6.32 -1.74,8.26 -1.12,1.65 -1.93,2.12 -2.75,1.62 a 9.34,9.34 0 0 1 -2.76,-4.34 c -0.69,-2.29 -0.58,-9.15 0.19,-11.66 0.73,-2.34 2.2,-4.34 3.21,-4.34 a 3.1,3.1 0 0 1 1.62,1.11 z m -34.95,29.67 a 10.09,10.09 0 0 0 -3.59,2.27 c -3.06,3 -6.75,11.56 -6.86,15.93 -0.06,2.15 0.06,2.45 5.56,13.39 a 141.08,141.08 0 0 0 7,12.85 c 2.91,3.45 7.54,4.66 10.94,2.84 6.49,-3.49 13.91,-15.3 16.26,-25.9 1.16,-5.25 0.85,-8.27 -1,-10.06 -1,-1 -12.09,-7.06 -18.63,-10.23 -4.22,-2.06 -6.27,-2.29 -9.68,-1.11 z m -18.6,49.66 c -0.56,1.06 -1.49,2.77 -2,3.79 -2.89,5.29 -7.28,16.06 -9.94,24.38 a 175.29,175.29 0 0 0 -5.81,25 c -0.35,2.12 -0.91,8.32 -1.29,14.49 a 91.05,91.05 0 0 0 2.07,22.53 c 1.72,7.19 3.38,10.58 9.9,20.29 13.85,20.65 22.82,41.87 21.81,51.66 l -0.25,2.4 0.81,-0.79 c 1.52,-1.48 1.92,-4.06 2.09,-13.39 a 87.44,87.44 0 0 0 -0.46,-13.6 c -1.37,-10.84 -2.87,-16.68 -6.06,-23.43 -4.18,-8.87 -6.18,-18.68 -6.84,-33.53 a 133.57,133.57 0 0 1 3,-31.79 53.66,53.66 0 0 1 4.56,-13 24.56,24.56 0 0 0 2.71,-8.09 c 1,-5.84 0.88,-6.48 -1,-8.84 -3.17,-3.89 -9.13,-14.48 -10.45,-18.58 -0.71,-2.04 -1.59,-1.87 -2.85,0.48 z m 101.09,-0.55 c -1.32,4.1 -7.28,14.69 -10.45,18.58 -1.92,2.36 -2,3 -1,8.84 a 24.56,24.56 0 0 0 2.71,8.09 53.66,53.66 0 0 1 4.56,13 133.57,133.57 0 0 1 3,31.79 c -0.66,14.85 -2.66,24.66 -6.84,33.53 -3.19,6.75 -4.69,12.59 -6.06,23.43 a 87.44,87.44 0 0 0 -0.45,13.58 c 0.17,9.33 0.57,11.91 2.09,13.39 l 0.81,0.79 -0.25,-2.4 c -1,-9.79 8,-31 21.81,-51.66 6.52,-9.71 8.18,-13.1 9.9,-20.29 a 91.05,91.05 0 0 0 2.01,-22.52 c -0.38,-6.17 -0.94,-12.37 -1.29,-14.49 a 175.29,175.29 0 0 0 -5.81,-25 c -2.66,-8.32 -7.05,-19.09 -9.94,-24.38 -0.56,-1 -1.49,-2.73 -2.05,-3.79 -1.24,-2.31 -2.12,-2.48 -2.75,-0.51 z m -61.29,7.65 c -1.12,2.09 -10,9 -16.35,12.73 a 24.35,24.35 0 0 0 -3.59,2.43 c -0.46,0.5 -0.77,2.13 -1.18,6.09 -0.47,4.43 -0.8,6 -1.85,8.76 a 101.59,101.59 0 0 0 -5.26,21 c -0.69,4.25 -1,14.93 -0.68,22 0.82,17.42 5.77,34.3 14,47.83 4.65,7.63 8.1,18.41 9.41,29.37 a 21.44,21.44 0 0 1 -0.6,9.71 6.38,6.38 0 0 0 -0.45,1.89 3.81,3.81 0 0 0 1.41,-0.49 c 1.62,-0.76 3.07,-3.52 3.89,-7.39 0.91,-4.32 1.1,-18.45 0.36,-26.42 a 182.48,182.48 0 0 0 -5.9,-32.75 c -0.92,-3.46 -1.92,-8 -2.21,-10.14 -1.58,-11.23 0.34,-26.15 4.95,-38.4 3.2,-8.52 7,-14.23 11.39,-17 1.11,-0.7 2.64,-1.76 3.39,-2.36 l 1.4,-1.1 1.38,1.07 c 0.75,0.6 2.28,1.66 3.39,2.36 10.84,6.89 19.18,35.16 16.34,55.4 -0.29,2.11 -1.29,6.68 -2.21,10.14 a 182.48,182.48 0 0 0 -5.9,32.75 c -0.74,8 -0.55,22.1 0.36,26.42 0.82,3.87 2.27,6.63 3.89,7.39 a 3.81,3.81 0 0 0 1.41,0.49 6.38,6.38 0 0 0 -0.45,-1.89 21.44,21.44 0 0 1 -0.6,-9.71 c 1.31,-11 4.76,-21.74 9.41,-29.37 8.25,-13.53 13.2,-30.41 14,-47.83 0.33,-7.06 0,-17.74 -0.68,-22 a 101.59,101.59 0 0 0 -5.26,-21 c -1.05,-2.74 -1.38,-4.33 -1.85,-8.76 -0.4,-3.91 -0.73,-5.6 -1.17,-6.08 a 20.79,20.79 0 0 0 -3.22,-2.21 c -6.39,-3.75 -15.35,-10.66 -16.61,-12.79 -0.8,-1.34 -1.8,-1.43 -4.12,-0.38 a 28.59,28.59 0 0 0 -7.21,5.62 l -0.92,1.16 -0.92,-1.16 a 28.59,28.59 0 0 0 -7.21,-5.62 c -2.21,-1 -3.35,-0.94 -3.98,0.22 z m 9.64,34.61 c -1.89,1.81 -6.35,8.22 -8.05,11.57 -4,7.83 -6.34,19.46 -6.34,31.14 a 67,67 0 0 0 3.85,22.1 c 2.42,6.16 3.37,8.79 4.48,12.48 5.13,16.94 7.58,27.78 7.91,35 0.07,1.5 0.23,2 0.64,2 0.41,0 0.57,-0.51 0.64,-2 0.33,-7.27 2.78,-18.11 7.91,-35 1.11,-3.69 2.06,-6.32 4.48,-12.48 5.22,-13.29 5.09,-33 -0.3,-47.91 a 42.35,42.35 0 0 0 -5.73,-11.14 c -2.71,-4.12 -5.91,-7.58 -7,-7.58 a 7.38,7.38 0 0 0 -2.49,1.8 z' id='path23' style='fill:url(%23linear-gradient)' /%3E%3C/svg%3E";
assert(typeof ODIN_MOE_IMAGE === 'string', 'missing ODIN_MOE_IMAGE env variable');
// NFT contract addresses
const THOR_NFT_V2a = process.env.THOR_NFT_V2a ?? '0x367905eE54817631DbF1d7a1aA15228426CB10Ba';
assert(THOR_NFT_V2a, 'missing THOR_NFT_V2a env variable');
const LOKI_NFT_V2a = process.env.LOKI_NFT_V2a ?? '0x92E332cc5E9772f18e15B9ab72E2Dc86F5336d2b';
assert(LOKI_NFT_V2a, 'missing LOKI_NFT_V2a env variable');
const ODIN_NFT_V2a = process.env.ODIN_NFT_V2a ?? '0xa64d15809D0F74bb26B85597885292899d7a6695';
assert(ODIN_NFT_V2a, 'missing ODIN_NFT_V2a env variable');
const THOR_NFT_V2b = process.env.THOR_NFT_V2b ?? '0x87F12786400277199c30D70BC459e9BBBCe139A2';
assert(THOR_NFT_V2b, 'missing THOR_NFT_V2b env variable');
const LOKI_NFT_V2b = process.env.LOKI_NFT_V2b ?? '0x430A941564D6f9cDFb171d59Dc359F01035E7537';
assert(LOKI_NFT_V2b, 'missing LOKI_NFT_V2b env variable');
const ODIN_NFT_V2b = process.env.ODIN_NFT_V2b ?? '0x9754515BaF8D8C24bF2079D0d7B7cf4c38E9982B';
assert(ODIN_NFT_V2b, 'missing ODIN_NFT_V2b env variable');
const THOR_NFT_V2c = process.env.THOR_NFT_V2c ?? '0x8c6122CA798C39137c340951E69969ce78aD5788';
assert(THOR_NFT_V2c, 'missing THOR_NFT_V2c env variable');
const LOKI_NFT_V2c = process.env.LOKI_NFT_V2c ?? '0x3049AF79770b127814B08aE80b69F3Cf62433a74';
assert(LOKI_NFT_V2c, 'missing LOKI_NFT_V2c env variable');
const ODIN_NFT_V2c = process.env.ODIN_NFT_V2c ?? '0x1ebD373c55E194a2448DEaD7B355d744F55FdD20';
assert(ODIN_NFT_V2c, 'missing ODIN_NFT_V2c env variable');
const THOR_NFT_V3a = process.env.THOR_NFT_V3a ?? '0xf00814a5C3a87D3630F9c6615043bB3DBA7Ec61D';
assert(THOR_NFT_V3a, 'missing THOR_NFT_V3a env variable');
const LOKI_NFT_V3a = process.env.LOKI_NFT_V3a ?? '0x3e56F51369a4652095b9e45541BA4373526D5722';
assert(LOKI_NFT_V3a, 'missing LOKI_NFT_V3a env variable');
const ODIN_NFT_V3a = process.env.ODIN_NFT_V3a ?? '0x74A40A7fb92FaB6f73A8D5EdAA44550e1db54778';
assert(ODIN_NFT_V3a, 'missing ODIN_NFT_V3a env variable');
const THOR_NFT_V3b = process.env.THOR_NFT_V3b ?? '0xaF2e30449f9e7165257a9608f8dCc24E05CA4406';
assert(THOR_NFT_V3b, 'missing THOR_NFT_V3b env variable');
const LOKI_NFT_V3b = process.env.LOKI_NFT_V3b ?? '0x8De2e43282fE87C8f04387b6511615EDf86Af5e4';
assert(LOKI_NFT_V3b, 'missing LOKI_NFT_V3b env variable');
const ODIN_NFT_V3b = process.env.ODIN_NFT_V3b ?? '0xa4B204720B49C2F60E837435ed6Eca97c6bd6552';
assert(ODIN_NFT_V3b, 'missing ODIN_NFT_V3b env variable');
const THOR_NFT_V4a = process.env.THOR_NFT_V4a ?? '0xf765f11b8016e537d0E60CCA87e005352FAbC95B';
assert(THOR_NFT_V4a, 'missing THOR_NFT_V4a env variable');
const LOKI_NFT_V4a = process.env.LOKI_NFT_V4a ?? '0x74aF5454E7A3b2A8D0F452b20b770d7d547e6A11';
assert(LOKI_NFT_V4a, 'missing LOKI_NFT_V4a env variable');
const ODIN_NFT_V4a = process.env.ODIN_NFT_V4a ?? '0x6b43AD7890CFB4810D5e0D2d74dbf02186203555';
assert(ODIN_NFT_V4a, 'missing ODIN_NFT_V4a env variable');
const THOR_NFT_V5a = process.env.THOR_NFT_V5a ?? '0x994a67830523098FbA053743ed6baE194273A7e3';
assert(THOR_NFT_V5a, 'missing THOR_NFT_V5a env variable');
const LOKI_NFT_V5a = process.env.LOKI_NFT_V5a ?? '0x8D558f21e745e84a818A6E0879294AE98423717a';
assert(LOKI_NFT_V5a, 'missing LOKI_NFT_V5a env variable');
const ODIN_NFT_V5a = process.env.ODIN_NFT_V5a ?? '0x2f49A05b709A42451CA6F702b6f5d420788b002b';
assert(ODIN_NFT_V5a, 'missing ODIN_NFT_V5a env variable');
const THOR_NFT_V5b = process.env.THOR_NFT_V5b ?? '0x14410621Cc662da31B9473f04d47b43a70219D64';
assert(THOR_NFT_V5b, 'missing THOR_NFT_V5b env variable');
const LOKI_NFT_V5b = process.env.LOKI_NFT_V5b ?? '0x7fD7c89Caa8C0A071ab16f0e3fb95F9FE30dC3de';
assert(LOKI_NFT_V5b, 'missing LOKI_NFT_V5b env variable');
const ODIN_NFT_V5b = process.env.ODIN_NFT_V5b ?? '0xfDe190C5d6073aCc6E9A5E2D913a51630cB8BB50';
assert(ODIN_NFT_V5b, 'missing ODIN_NFT_V5b env variable');
const THOR_NFT_V5c = process.env.THOR_NFT_V5c ?? '0xA0e054262b4f812D6750e6220Ceedfd74EFA6323';
assert(THOR_NFT_V5c, 'missing THOR_NFT_V5c env variable');
const LOKI_NFT_V5c = process.env.LOKI_NFT_V5c ?? '0x67F6a112300455f00d174C0EF31083A5e0AD3cB3';
assert(LOKI_NFT_V5c, 'missing LOKI_NFT_V5c env variable');
const ODIN_NFT_V5c = process.env.ODIN_NFT_V5c ?? '0xCdE807b08fBa39f8CDBA59c00259181221eaC427';
assert(ODIN_NFT_V5c, 'missing ODIN_NFT_V5c env variable');
const XPOW_NFT_V6a = process.env.XPOW_NFT_V6a ?? '0x26569E92c82b474A5E492d8b47A3aA4CeEB36BCc';
assert(XPOW_NFT_V6a, 'missing XPOW_NFT_V6a env variable');
const XPOW_NFT_V6b = process.env.XPOW_NFT_V6b ?? '0xF96E6A076c7C4F5F61843Bf5bE2C75D58567806A';
assert(XPOW_NFT_V6b, 'missing XPOW_NFT_V6b env variable');
const XPOW_NFT_V6c = process.env.XPOW_NFT_V6c ?? '0x566533a903732dB0Af1DF53eFA388d340DD042FE';
assert(XPOW_NFT_V6c, 'missing XPOW_NFT_V6c env variable');
const XPOW_NFT_V7a = process.env.XPOW_NFT_V7a ?? '0x985Ec408b076F8baC5a4D07FdC741a00c09B12c8';
assert(XPOW_NFT_V7a, 'missing XPOW_NFT_V7a env variable');
// PPT contract addresses
const THOR_PPT_V4a = process.env.THOR_PPT_V4a ?? '0x881a061a35e8a0031171bF1b41f9DC76A614c34C';
assert(THOR_PPT_V4a, 'missing THOR_PPT_V4a env variable');
const LOKI_PPT_V4a = process.env.LOKI_PPT_V4a ?? '0xd4385Fbe9A8334162742254947858381EdcefdCe';
assert(LOKI_PPT_V4a, 'missing LOKI_PPT_V4a env variable');
const ODIN_PPT_V4a = process.env.ODIN_PPT_V4a ?? '0xbdd1A503d211b8Bea904dCE9d27CD03ab9d1626F';
assert(ODIN_PPT_V4a, 'missing ODIN_PPT_V4a env variable');
const THOR_PPT_V5a = process.env.THOR_PPT_V5a ?? '0x37063EB3A923F31DC7093c9537941C3A6674FF1f';
assert(THOR_PPT_V5a, 'missing THOR_PPT_V5a env variable');
const LOKI_PPT_V5a = process.env.LOKI_PPT_V5a ?? '0x8FDE6D6bAb0D6557E6Ff923091A0767016631378';
assert(LOKI_PPT_V5a, 'missing LOKI_PPT_V5a env variable');
const ODIN_PPT_V5a = process.env.ODIN_PPT_V5a ?? '0x3467B334B8FB00B5a26314E207CB713a5D378061';
assert(ODIN_PPT_V5a, 'missing ODIN_PPT_V5a env variable');
const THOR_PPT_V5b = process.env.THOR_PPT_V5b ?? '0xF32152F21C7A0A998a82431Ba250344FcB00FC34';
assert(THOR_PPT_V5b, 'missing THOR_PPT_V5b env variable');
const LOKI_PPT_V5b = process.env.LOKI_PPT_V5b ?? '0x807cE552003C2b2358C6bE2656Cc5234EC538d46';
assert(LOKI_PPT_V5b, 'missing LOKI_PPT_V5b env variable');
const ODIN_PPT_V5b = process.env.ODIN_PPT_V5b ?? '0x0Fc32b39013fc63E5Db4c84c389Da8d7c01F4C56';
assert(ODIN_PPT_V5b, 'missing ODIN_PPT_V5b env variable');
const THOR_PPT_V5c = process.env.THOR_PPT_V5c ?? '0x4D27F60e5C23c9B56d1Be135548503DB5F89F0e5';
assert(THOR_PPT_V5c, 'missing THOR_PPT_V5c env variable');
const LOKI_PPT_V5c = process.env.LOKI_PPT_V5c ?? '0x098E7BEc9Aea1938Ee769b111Ab8BB56d22CFf02';
assert(LOKI_PPT_V5c, 'missing LOKI_PPT_V5c env variable');
const ODIN_PPT_V5c = process.env.ODIN_PPT_V5c ?? '0x47F24e97A38a75e9593033f8B39A0B154Dc48be8';
assert(ODIN_PPT_V5c, 'missing ODIN_PPT_V5c env variable');
const XPOW_PPT_V6a = process.env.XPOW_PPT_V6a ?? '0x72290cbd47988be1546362C7D57EACDcdd01F052';
assert(XPOW_PPT_V6a, 'missing XPOW_PPT_V6a env variable');
const XPOW_PPT_V6b = process.env.XPOW_PPT_V6b ?? '0xB8aD9099a232E142A5E3Cc2DdaEcD8781d55D456';
assert(XPOW_PPT_V6b, 'missing XPOW_PPT_V6b env variable');
const XPOW_PPT_V6c = process.env.XPOW_PPT_V6c ?? '0x93a0929477187271C38cC991F5E355e2BEcd09a6';
assert(XPOW_PPT_V6c, 'missing XPOW_PPT_V6c env variable');
const XPOW_PPT_V7a = process.env.XPOW_PPT_V7a ?? '0x68dB5e6Bf3f5C6041C3135eE18B27E07C12A9bba';
assert(XPOW_PPT_V7a, 'missing XPOW_PPT_V7a env variable');
// PPT treasury contract addresses
const THOR_PTY_V4a = process.env.THOR_PTY_V4a ?? '0xD7B2568cE0f91fcB0A8AeFC60DaE64E3350656c3';
assert(THOR_PTY_V4a, 'missing THOR_PTY_V4a env variable');
const LOKI_PTY_V4a = process.env.LOKI_PTY_V4a ?? '0xEe231E251b5A422cCF9514fAc1362A0a06463CeD';
assert(LOKI_PTY_V4a, 'missing LOKI_PTY_V4a env variable');
const ODIN_PTY_V4a = process.env.ODIN_PTY_V4a ?? '0x2610862b07B2998C6CBb8C56FbFCEA8C94Bb8ffe';
assert(ODIN_PTY_V4a, 'missing ODIN_PTY_V4a env variable');
const THOR_PTY_V5a = process.env.THOR_PTY_V5a ?? '0x1c4CAd5744A9D652aDA6239a3D63153BD178e51C';
assert(THOR_PTY_V5a, 'missing THOR_PTY_V5a env variable');
const LOKI_PTY_V5a = process.env.LOKI_PTY_V5a ?? '0x67044183139Be9fB4E11f503F209FE08a26A96c1';
assert(LOKI_PTY_V5a, 'missing LOKI_PTY_V5a env variable');
const ODIN_PTY_V5a = process.env.ODIN_PTY_V5a ?? '0xfcC32553eF7F77937ADBA9c3C528a50A71c3593C';
assert(ODIN_PTY_V5a, 'missing ODIN_PTY_V5a env variable');
const THOR_PTY_V5b = process.env.THOR_PTY_V5b ?? '0x657e3bF162940CA6A26E041b244EB93D4980e2AE';
assert(THOR_PTY_V5b, 'missing THOR_PTY_V5b env variable');
const LOKI_PTY_V5b = process.env.LOKI_PTY_V5b ?? '0xA3eDfaAFA10b696356437223E17aee626Ddc4fBC';
assert(LOKI_PTY_V5b, 'missing LOKI_PTY_V5b env variable');
const ODIN_PTY_V5b = process.env.ODIN_PTY_V5b ?? '0xAe24DF43F4e78730a5d2614Fd47F232C38Ed0e10';
assert(ODIN_PTY_V5b, 'missing ODIN_PTY_V5b env variable');
const THOR_PTY_V5c = process.env.THOR_PTY_V5c ?? '0x01c1ab834822594B1c7636b544baAabd4Ccc0d2A';
assert(THOR_PTY_V5c, 'missing THOR_PTY_V5c env variable');
const LOKI_PTY_V5c = process.env.LOKI_PTY_V5c ?? '0x7A3bA387933A3D21382403905f896618d65B2aBf';
assert(LOKI_PTY_V5c, 'missing LOKI_PTY_V5c env variable');
const ODIN_PTY_V5c = process.env.ODIN_PTY_V5c ?? '0x89f78236CD41d045ad9A7210DF50aF201748532d';
assert(ODIN_PTY_V5c, 'missing ODIN_PTY_V5c env variable');
const XPOW_PTY_V6a = process.env.XPOW_PTY_V6a ?? '0x953f16B53D8268CC09783ca76dBbf9Aa8708EDeA';
assert(XPOW_PTY_V6a, 'missing XPOW_PTY_V6a env variable');
const XPOW_PTY_V6b = process.env.XPOW_PTY_V6b ?? '0x3df9124f68bCDcB340CB2d5F5b12500daC458c11';
assert(XPOW_PTY_V6b, 'missing XPOW_PTY_V6b env variable');
const XPOW_PTY_V6c = process.env.XPOW_PTY_V6c ?? '0x8a27C6222F875786cC49aab437A29Fce2b1F1B89';
assert(XPOW_PTY_V6c, 'missing XPOW_PTY_V6c env variable');
const XPOW_PTY_V7a = process.env.XPOW_PTY_V7a ?? '0xc8c54156f8E3872Bee13CC4B0Ba1EBe8775B6034';
assert(XPOW_PTY_V7a, 'missing XPOW_PTY_V7a env variable');
// MOE treasury contract addresses
const THOR_MTY_V4a = process.env.THOR_MTY_V4a ?? '0xA2433ff916457694af1Edfe499Bd61d67312Ac8a';
assert(THOR_MTY_V4a, 'missing THOR_MTY_V4a env variable');
const LOKI_MTY_V4a = process.env.LOKI_MTY_V4a ?? '0x5823605b4d9548124E3a01f011d0834982D2b4fc';
assert(LOKI_MTY_V4a, 'missing LOKI_MTY_V4a env variable');
const ODIN_MTY_V4a = process.env.ODIN_MTY_V4a ?? '0x8C1568BeE37C650fbee29A53BB36a9CE34e7ff73';
assert(ODIN_MTY_V4a, 'missing ODIN_MTY_V4a env variable');
const THOR_MTY_V5a = process.env.THOR_MTY_V5a ?? '0x035E35B4F5D76bBEB74BA737A36eE080811769FE';
assert(THOR_MTY_V5a, 'missing THOR_MTY_V5a env variable');
const LOKI_MTY_V5a = process.env.LOKI_MTY_V5a ?? '0x1dd061234744088C36B26E81eC4c9c729507fF28';
assert(LOKI_MTY_V5a, 'missing LOKI_MTY_V5a env variable');
const ODIN_MTY_V5a = process.env.ODIN_MTY_V5a ?? '0xe30371f7266ea7840C238e9c9F26E795e649e540';
assert(ODIN_MTY_V5a, 'missing ODIN_MTY_V5a env variable');
const THOR_MTY_V5b = process.env.THOR_MTY_V5b ?? '0x98B25c7411Bf9F1132cC7f32F704d09f1d37B302';
assert(THOR_MTY_V5b, 'missing THOR_MTY_V5b env variable');
const LOKI_MTY_V5b = process.env.LOKI_MTY_V5b ?? '0x442d629dd3028edF4eFCC2aaFfF00F9D7d1a7470';
assert(LOKI_MTY_V5b, 'missing LOKI_MTY_V5b env variable');
const ODIN_MTY_V5b = process.env.ODIN_MTY_V5b ?? '0x12cbb4F199B82Da9C8Df1D35A8ed42f681f64337';
assert(ODIN_MTY_V5b, 'missing ODIN_MTY_V5b env variable');
const THOR_MTY_V5c = process.env.THOR_MTY_V5c ?? '0x523968b09d045FaCDE0971798C1c275f2417AE0e';
assert(THOR_MTY_V5c, 'missing THOR_MTY_V5c env variable');
const LOKI_MTY_V5c = process.env.LOKI_MTY_V5c ?? '0x10a9AC9Ab982F79572Cd186eBeE64148f2B268A7';
assert(LOKI_MTY_V5c, 'missing LOKI_MTY_V5c env variable');
const ODIN_MTY_V5c = process.env.ODIN_MTY_V5c ?? '0xb2BA3c84Aca679A1c14ccD15902EC80D711BAcd4';
assert(ODIN_MTY_V5c, 'missing ODIN_MTY_V5c env variable');
const THOR_MTY_V6a = process.env.THOR_MTY_V6a ?? '0x11Bb07a0C9b0B25133E7c197F648D6b2139478e7';
assert(THOR_MTY_V6a, 'missing THOR_MTY_V6a env variable');
const LOKI_MTY_V6a = process.env.LOKI_MTY_V6a ?? '0xFCCDb91E5f6940A621a90aF65cA1d34F277f079B';
assert(LOKI_MTY_V6a, 'missing LOKI_MTY_V6a env variable');
const ODIN_MTY_V6a = process.env.ODIN_MTY_V6a ?? '0xc7DCC1A76B67f73EECe16fB4aAe7cB37A04bd776';
assert(ODIN_MTY_V6a, 'missing ODIN_MTY_V6a env variable');
const XPOW_MTY_V6b = process.env.XPOW_MTY_V6b ?? '0x84277728d467f8E162eDdEd872070e19c40a475a';
assert(XPOW_MTY_V6b, 'missing XPOW_MTY_V6b env variable');
const XPOW_MTY_V6c = process.env.XPOW_MTY_V6c ?? '0x46cDD46139d488a4185Dd69cf78FEE18E5eaAc48';
assert(XPOW_MTY_V6c, 'missing XPOW_MTY_V6c env variable');
const XPOW_MTY_V7a = process.env.XPOW_MTY_V7a ?? '0xa4842F0050495542b86cF04528f7C98e11be4Bea';
assert(XPOW_MTY_V7a, 'missing XPOW_MTY_V7a env variable');
// SOV contract addresses
const THOR_SOV_V5a = process.env.THOR_SOV_V5a ?? '0x114D214f7e814b87BCbB1a109Ef1706e061a8CA8';
assert(THOR_SOV_V5a, 'missing THOR_SOV_V5a env variable');
const LOKI_SOV_V5a = process.env.LOKI_SOV_V5a ?? '0x411c1aB1e4CcD16A0b6556C625CAF5F556580995';
assert(LOKI_SOV_V5a, 'missing LOKI_SOV_V5a env variable');
const ODIN_SOV_V5a = process.env.ODIN_SOV_V5a ?? '0xb904580Ae6d4cDA38A2743817873231642aF5C2f';
assert(ODIN_SOV_V5a, 'missing ODIN_SOV_V5a env variable');
const THOR_SOV_V5b = process.env.THOR_SOV_V5b ?? '0xe31255e7D8781Fb5590822F30bdcfD56A9F98583';
assert(THOR_SOV_V5b, 'missing THOR_SOV_V5b env variable');
const LOKI_SOV_V5b = process.env.LOKI_SOV_V5b ?? '0x961359B67142D4Fc86b65A50FdC2B006a0439ca6';
assert(LOKI_SOV_V5b, 'missing LOKI_SOV_V5b env variable');
const ODIN_SOV_V5b = process.env.ODIN_SOV_V5b ?? '0x9AcEC802A2b2Fb2d7C89c50cC1D993F1AAD0a345';
assert(ODIN_SOV_V5b, 'missing ODIN_SOV_V5b env variable');
const THOR_SOV_V5c = process.env.THOR_SOV_V5c ?? '0xA0F0173c24de8147b7fFb8700252D647281Fb977';
assert(THOR_SOV_V5c, 'missing THOR_SOV_V5c env variable');
const LOKI_SOV_V5c = process.env.LOKI_SOV_V5c ?? '0x42Fa90Abba2Acd3b064Dd3F29F99123Fc68fDDE3';
assert(LOKI_SOV_V5c, 'missing LOKI_SOV_V5c env variable');
const ODIN_SOV_V5c = process.env.ODIN_SOV_V5c ?? '0x1A4488Df88f87F773a32265769568056A7E85C01';
assert(ODIN_SOV_V5c, 'missing ODIN_SOV_V5c env variable');
const THOR_SOV_V6a = process.env.THOR_SOV_V6a ?? '0x2b6fC350e234D4d8fFAC43F3A473237F32105396';
assert(THOR_SOV_V6a, 'missing THOR_SOV_V6a env variable');
const LOKI_SOV_V6a = process.env.LOKI_SOV_V6a ?? '0xa63fba872931588e70a2CB4Aaf94C34b78E17922';
assert(LOKI_SOV_V6a, 'missing LOKI_SOV_V6a env variable');
const ODIN_SOV_V6a = process.env.ODIN_SOV_V6a ?? '0xaAE4491b9284292700242B35CC5CCA94965DD56B';
assert(ODIN_SOV_V6a, 'missing ODIN_SOV_V6a env variable');
const THOR_SOV_V6b = process.env.THOR_SOV_V6b ?? '0x2EdEc7C66526a5016561704Ea108800439739311';
assert(THOR_SOV_V6b, 'missing THOR_SOV_V6b env variable');
const LOKI_SOV_V6b = process.env.LOKI_SOV_V6b ?? '0xB57Ef0D6D4765CEBD70222c9c92F0a789174b5E4';
assert(LOKI_SOV_V6b, 'missing LOKI_SOV_V6b env variable');
const ODIN_SOV_V6b = process.env.ODIN_SOV_V6b ?? '0x2C2F98E5aEA6e865d224c2Db20312805A1e643bF';
assert(ODIN_SOV_V6b, 'missing ODIN_SOV_V6b env variable');
const THOR_SOV_V6c = process.env.THOR_SOV_V6c ?? '0x0cFFBF9d94eDb71D9dC0300b9Bb988fb6e7F5bbc';
assert(THOR_SOV_V6c, 'missing THOR_SOV_V6c env variable');
const LOKI_SOV_V6c = process.env.LOKI_SOV_V6c ?? '0xBF2f5179E3159E6860ddBFc6d6Ce83c3c586cF50';
assert(LOKI_SOV_V6c, 'missing LOKI_SOV_V6c env variable');
const ODIN_SOV_V6c = process.env.ODIN_SOV_V6c ?? '0x1d613303A5e5F9077F9Eb6dcEE5adb10130f5B0F';
assert(ODIN_SOV_V6c, 'missing ODIN_SOV_V6c env variable');
const THOR_SOV_V7a = process.env.THOR_SOV_V7a ?? '0xb913d8C50e2f444F81b3c135Ae5283E2C332AC5d';
assert(THOR_SOV_V7a, 'missing THOR_SOV_V7a env variable');
const LOKI_SOV_V7a = process.env.LOKI_SOV_V7a ?? '0x7a5F2225a501039Cedd5CaD2EF5E528ab00B6790';
assert(LOKI_SOV_V7a, 'missing LOKI_SOV_V7a env variable');
const ODIN_SOV_V7a = process.env.ODIN_SOV_V7a ?? '0x782D0767d507c105d275D426400289b313ae167C';
assert(ODIN_SOV_V7a, 'missing ODIN_SOV_V7a env variable');
// SOV contract images
const THOR_SOV_IMAGE = process.env.THOR_SOV_IMAGE ?? "data:image/svg+xml,%3Csvg style='filter:invert(1)' viewBox='0 0 480 480' id='svg72' width='480' height='480' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svg='http://www.w3.org/2000/svg'%3E%3Cdefs id='defs30'%3E%3Cstyle id='style2'%3E.cls-1%7Bfill:%2322262a;%7D.cls-10,.cls-11,.cls-12,.cls-13,.cls-14,.cls-15,.cls-16,.cls-17,.cls-18,.cls-19,.cls-2,.cls-3,.cls-4,.cls-5,.cls-6,.cls-7,.cls-8,.cls-9%7Bstroke:%2322262a;stroke-miterlimit:10;fill-rule:evenodd;%7D.cls-2%7Bfill:url(%23linear-gradient);%7D.cls-3%7Bfill:url(%23linear-gradient-2);%7D.cls-4%7Bfill:url(%23linear-gradient-3);%7D.cls-5%7Bfill:url(%23linear-gradient-4);%7D.cls-6%7Bfill:url(%23linear-gradient-5);%7D.cls-7%7Bfill:url(%23linear-gradient-6);%7D.cls-8%7Bfill:url(%23linear-gradient-7);%7D.cls-9%7Bfill:url(%23linear-gradient-8);%7D.cls-10%7Bfill:url(%23linear-gradient-9);%7D.cls-11%7Bfill:url(%23linear-gradient-10);%7D.cls-12%7Bfill:url(%23linear-gradient-11);%7D.cls-13%7Bfill:url(%23linear-gradient-12);%7D.cls-14%7Bfill:url(%23linear-gradient-13);%7D.cls-15%7Bfill:url(%23linear-gradient-14);%7D.cls-16%7Bfill:url(%23linear-gradient-15);%7D.cls-17%7Bfill:url(%23linear-gradient-16);%7D.cls-18%7Bfill:url(%23linear-gradient-17);%7D.cls-19%7Bfill:url(%23linear-gradient-18);%7D%3C/style%3E%3ClinearGradient id='linear-gradient' x1='166.59' y1='418.81' x2='197.08' y2='471.63' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23ff0' id='stop4' /%3E%3Cstop offset='0.27' stop-color='%23fbf801' id='stop6' /%3E%3Cstop offset='0.65' stop-color='%23f1e603' id='stop8' /%3E%3Cstop offset='1' stop-color='%23e4cf06' id='stop10' /%3E%3C/linearGradient%3E%3ClinearGradient id='linear-gradient-2' x1='189.23' y1='401.69' x2='207.67' y2='433.62' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-3' x1='193.89999' y1='387.98999' x2='214.62' y2='423.88' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-4' x1='204.77' y1='372.70999' x2='225.58' y2='408.75' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-5' x1='216.63' y1='356.17001' x2='237.41' y2='392.16' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-6' x1='228.75999' y1='339.26999' x2='249.67' y2='375.5' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-7' x1='240.58' y1='320.60999' x2='262' y2='357.70999' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-8' x1='253.82001' y1='302.42001' x2='274.87' y2='338.88' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-9' x1='266.20001' y1='283.38' x2='287.94' y2='321.03' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-10' x1='279.76999' y1='264.32999' x2='301.84' y2='302.56' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-11' x1='293.59' y1='242.92999' x2='316.72' y2='282.98999' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-12' x1='283.85999' y1='215.28' x2='339.14001' y2='311.01999' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-13' x1='274.45999' y1='197.24001' x2='283.20999' y2='212.39999' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-14' x1='300.64999' y1='167.35001' x2='307.06' y2='178.46001' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-15' x1='366.01999' y1='135.64999' x2='380.34' y2='160.45' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-16' x1='338.54999' y1='163.94' x2='351.23999' y2='185.92999' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-17' x1='349.64999' y1='176.52' x2='405.04999' y2='272.45999' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-18' x1='381.73001' y1='146.48' x2='438.29999' y2='244.46001' xlink:href='%23linear-gradient' /%3E%3ClinearGradient xlink:href='%23linear-gradient' id='linearGradient893' gradientUnits='userSpaceOnUse' x1='166.59' y1='418.81' x2='197.08' y2='471.63' /%3E%3C/defs%3E%3Crect class='cls-1' width='480' height='480' id='rect32' x='0' y='0' style='stroke-width:0.8' /%3E%3Cg id='g952' transform='translate(-59.156252,-59.91375)'%3E%3Cpath class='cls-2' d='m 198.3,432.52 c -5.58,0.56 -7.53,0.14 -9.92,-2.19 -1.76,-1.71 -2.53,-3.17 -3.49,-6.65 -0.89,-3.19 -1.44,-4.22 -3.42,-6.34 -1.98,-2.12 -3.83,-3 -6,-3 -1.56,0 -2,0.25 -12.32,8 -5.9,4.44 -10.8,8.19 -10.91,8.36 -0.11,0.17 0,3.08 0.82,10.43 0.58,5.47 1.42,13.72 1.72,17.1 a 19.35,19.35 0 0 0 0.46,3.26 c 0.17,0.16 20.64,8.23 25.53,10.06 l 1.92,0.72 8.94,-2.55 c 4.92,-1.41 10.9,-3.07 13.29,-3.72 a 23,23 0 0 0 4.57,-1.51 11.55,11.55 0 0 0 0.31,-2.75 c 0,-1.31 0.31,-5.69 0.58,-9.74 0.27,-4.05 0.68,-9.71 0.89,-12.58 0.25,-3.63 0.25,-5.35 0,-5.66 -1.09,-1.26 -7.12,-1.84 -12.97,-1.24 z' id='path34' style='fill:url(%23linearGradient893)' /%3E%3Cpath class='cls-3' d='m 213.34,412 c -1.48,-3.45 -5.2,-5.64 -10.45,-6.15 a 101.14,101.14 0 0 0 -15,0 c -6.37,0.52 -10.42,1.86 -11.43,3.74 -0.64,1.21 -0.17,1.76 2,2.4 3,0.86 4.44,1.71 5.9,3.4 a 18.67,18.67 0 0 1 3.7,7.26 c 1.1,3.61 2.85,5.45 6.1,6.39 0.7,0.2 2.84,0.12 6.11,-0.26 5.52,-0.62 7.7,-0.43 11,1 l 1.69,0.72 2.23,-2.23 v -4.64 c 0,-4.79 -0.64,-8.79 -1.85,-11.63 z' id='path36' style='fill:url(%23linear-gradient-2)' /%3E%3Cpath class='cls-4' d='m 223.41,398 c -1.51,-2.82 -4.42,-5.93 -6.11,-6.52 -1.69,-0.59 -19,-0.81 -23.61,-0.34 -1.63,0.18 -3.83,0.43 -4.87,0.58 l -1.9,0.27 -4,5.44 c -2.19,3 -4,5.57 -4,5.73 0,0.16 0.35,0.21 0.78,0.07 4.75,-1.41 7.57,-1.72 15.69,-1.73 14.24,0 17.91,1.27 20.73,7.31 a 23.2,23.2 0 0 1 2.18,9.7 c 0,1.72 0.09,3.1 0.13,3.1 0.04,0 2,-2.61 4.33,-5.82 l 4.27,-5.82 -0.23,-1.72 A 41.57,41.57 0 0 0 223.41,398 Z' id='path38' style='fill:url(%23linear-gradient-3)' /%3E%3Cpath class='cls-5' d='m 228.6,375.37 c -1.66,-0.8 -2.1,-0.84 -9.47,-0.91 -4.25,0 -8.51,0 -9.47,0.08 A 82.71,82.71 0 0 0 199,376.07 c -0.59,0.32 -4.33,5.14 -8.16,10.56 l -1.71,2.37 3.6,-0.22 c 2,-0.12 7.93,-0.21 13.24,-0.21 12,0 12.75,0.18 16,3.46 2.49,2.54 4.92,7.09 6.24,11.71 a 9.66,9.66 0 0 0 1.09,2.91 c 0.23,0 2.25,-2.73 8.67,-11.7 a 10.39,10.39 0 0 0 1.69,-3 c 0,-1.09 -2.65,-7 -4.3,-9.63 -2.12,-3.32 -4.59,-5.9 -6.76,-6.95 z' id='path40' style='fill:url(%23linear-gradient-4)' /%3E%3Cpath class='cls-6' d='m 242.38,360.43 a 6.23,6.23 0 0 0 -4.17,-2.2 97.38,97.38 0 0 0 -17,-0.38 c -5.43,0.45 -10.06,1.3 -11,2 -1.11,0.86 -9.26,12.85 -8.84,13 a 17.7,17.7 0 0 0 3.24,-0.26 c 7.45,-1 22,-0.81 25.05,0.35 a 22,22 0 0 1 3.73,3.22 32.51,32.51 0 0 1 7,10.92 l 1.15,2.64 4.8,-6.65 c 2.64,-3.65 4.88,-6.85 5,-7.12 a 8.3,8.3 0 0 0 -0.73,-2.9 33.54,33.54 0 0 0 -8.23,-12.62 z' id='path42' style='fill:url(%23linear-gradient-5)' /%3E%3Cpath class='cls-7' d='m 251.9,342.26 -2.28,-1.08 -7.54,-0.05 c -4.14,0 -8.16,0 -8.94,0.1 -2.37,0.23 -8.68,1.21 -10.21,1.58 -1.37,0.35 -1.66,0.68 -5.91,6.83 a 75,75 0 0 0 -4.31,6.64 23.39,23.39 0 0 0 3.8,-0.34 c 7.78,-1.05 19.11,-1 23.51,0.13 3.82,1 10.3,8.93 12.95,15.9 l 0.51,1.33 5.69,-8 5.69,-7.95 -1.57,-3 c -3.11,-5.97 -6.8,-9.9 -11.39,-12.09 z' id='path44' style='fill:url(%23linear-gradient-6)' /%3E%3Cpath class='cls-8' d='m 269.53,325.24 a 15,15 0 0 0 -7.61,-3.83 70.88,70.88 0 0 0 -12,-0.15 108,108 0 0 0 -12.1,1.91 l -3,0.73 -5.5,7.91 c -3,4.31 -5.38,7.88 -5.38,8 a 25.21,25.21 0 0 0 3.58,-0.43 c 1.91,-0.31 6.71,-0.64 10.66,-0.75 12.61,-0.38 15.36,0.43 21.32,6.29 a 31.39,31.39 0 0 1 5.88,8.08 l 1.1,2.06 3.83,-5.33 5.69,-7.73 1.79,-2.52 -0.44,-1.67 a 28.29,28.29 0 0 0 -7.82,-12.57 z' id='path46' style='fill:url(%23linear-gradient-7)' /%3E%3Cpath class='cls-9' d='m 283.68,309.58 c -5.23,-5.61 -7.29,-6.5 -15.47,-6.63 -3.09,-0.06 -6.17,0 -6.84,0.06 a 76,76 0 0 0 -9.94,1.78 c -3.64,0.88 -3.86,1 -4.87,2.35 -2,2.76 -9.25,13.22 -9.25,13.42 0,0 1.72,-0.21 3.74,-0.58 8.67,-1.55 18.59,-1.78 23.27,-0.54 5.24,1.38 11.09,7.22 14,14 a 9.25,9.25 0 0 0 1.43,2.59 72.41,72.41 0 0 0 5.83,-7.55 l 5.48,-7.65 -0.51,-1.23 a 43.11,43.11 0 0 0 -6.87,-10.02 z' id='path48' style='fill:url(%23linear-gradient-8)' /%3E%3Cpath class='cls-10' d='m 300.93,296.58 a 40.9,40.9 0 0 0 -8.65,-9.28 c -3.17,-2.54 -4.2,-3.09 -6.89,-3.68 -2.69,-0.59 -12,-0.55 -15.87,0.06 -4.77,0.75 -7.65,1.76 -8.67,3.07 -1.6,2 -10.86,15.35 -10.86,15.62 a 23.32,23.32 0 0 0 3.37,-0.59 c 6.49,-1.39 15.3,-1.87 20.28,-1.09 a 19.38,19.38 0 0 1 10.08,5.41 46.89,46.89 0 0 1 8,10.45 4.9,4.9 0 0 0 1.1,1.65 c 0.29,0 10.23,-14 10.74,-15.08 0.51,-1.08 -0.47,-3.22 -2.63,-6.54 z' id='path50' style='fill:url(%23linear-gradient-9)' /%3E%3Cpath class='cls-11' d='m 264.31,282 a 15.47,15.47 0 0 0 3.07,-0.44 c 3.76,-0.75 14.14,-1.08 17.18,-0.55 3.94,0.7 4.83,1.09 8.32,3.72 A 40.08,40.08 0 0 1 304.6,298 l 1.15,2.29 5.42,-7.61 c 3.44,-4.86 5.4,-7.92 5.36,-8.42 -0.06,-1.22 -2.74,-5.66 -5.43,-9 -2.89,-3.6 -7.74,-7.93 -10.22,-9.12 -3,-1.46 -8.46,-1.88 -15.39,-1.22 -3.91,0.38 -9.66,1.58 -10.63,2.22 -0.81,0.56 -10.81,14.6 -10.55,14.86 z' id='path52' style='fill:url(%23linear-gradient-10)' /%3E%3Cpath class='cls-12' d='m 277.52,263.75 c 5,-1.39 17.47,-1.86 21.67,-0.83 3.61,0.88 8.4,4.51 12.85,9.7 2.57,3 6.13,8.27 6.13,9.06 0,0.79 0.69,0.16 3.83,-4.26 7,-9.87 7.44,-10.8 7.49,-16.19 0,-5.65 -1.78,-9.93 -6.06,-14.2 a 23.57,23.57 0 0 0 -9.81,-6 c -1.8,-0.61 -3.29,-0.81 -7,-0.9 a 42.07,42.07 0 0 0 -6.13,0.18 31.54,31.54 0 0 0 -7.88,3.17 c -2.91,1.86 -4,3.29 -13.52,17 -2.09,3.04 -2.31,3.52 -1.57,3.27 z' id='path54' style='fill:url(%23linear-gradient-11)' /%3E%3Cpath class='cls-13' d='m 379.77,252.16 c -7.13,-9 -9.8,-12.41 -25.31,-32 l -20.12,-25.38 c -2.37,-3 -4.59,-5.5 -4.9,-5.53 a 81.64,81.64 0 0 0 -8.81,4.76 c -4.53,2.66 -18.74,10.9 -31.55,18.33 -22.8,13.22 -33,19.14 -54,31.34 -6.51,3.79 -10.3,6.19 -10.3,6.53 0,0.57 1.53,2.76 17.19,25.41 5.79,8.37 10.67,15.18 10.86,15.18 0.19,0 2.32,-2.8 22.33,-30.8 6.55,-9.15 12.32,-17.1 12.82,-17.65 1.13,-1.23 7.12,-4.18 10.2,-5 1.71,-0.47 3.61,-0.63 7.55,-0.64 4.56,0 5.61,0.11 7.89,0.82 7.83,2.45 13.65,7 17,13.34 2.3,4.41 2.9,9.44 1.8,15.18 -0.47,2.49 -0.75,3 -3.79,7.36 -3.78,5.4 -11.39,16.32 -21.81,31.32 -4,5.79 -8.08,11.6 -9,12.92 a 13.54,13.54 0 0 0 -1.6,2.51 24.25,24.25 0 0 0 3.62,-1.4 c 1.93,-0.83 10.12,-4.31 18.23,-7.72 l 22.44,-9.47 17,-7.18 c 40.2,-17 40.51,-17.1 41,-17.7 0.3,-0.36 -1.37,-2.68 -7.38,-10.24 -4.31,-5.38 -9.39,-11.81 -11.36,-14.29 z' id='path56' style='fill:url(%23linear-gradient-12)' /%3E%3Cpath class='cls-14' d='m 227.24,244.71 c 1.51,-0.9 17.27,-10.15 35,-20.57 l 44,-25.85 c 6.46,-3.81 13,-7.65 14.55,-8.54 l 2.81,-1.63 5.7,-11.12 c 3.13,-6.12 5.7,-11.32 5.7,-11.57 0,-0.51 -0.76,-0.58 -1.24,-0.1 -0.48,0.48 -3.76,2.24 -24.53,13.67 -6.56,3.62 -26.13,14.46 -43.48,24.09 -17.35,9.63 -32.93,18.26 -34.63,19.18 a 14.71,14.71 0 0 0 -3.38,2.25 49.68,49.68 0 0 0 -1.24,5.5 c -0.5,2.7 -1.07,5.62 -1.24,6.48 -0.3,1.53 -1.26,6.85 -1.58,8.85 -0.22,1.37 0.32,1.26 3.56,-0.64 z' id='path58' style='fill:url(%23linear-gradient-13)' /%3E%3Cpath class='cls-15' d='m 234.36,216.53 c 0.21,0 6.27,-3.18 13.44,-7.05 l 19.71,-10.67 24.37,-13.15 c 9.74,-5.25 20.23,-10.91 23.31,-12.59 l 12.39,-6.7 6.77,-3.67 15.34,-13.15 19.4,-16.65 c 3.8,-3.26 4.78,-4.42 3.7,-4.36 -0.24,0 -7.15,3.69 -15.34,8.16 -8.19,4.47 -23,12.56 -32.79,17.92 -9.79,5.36 -21.66,11.87 -26.36,14.45 -4.7,2.58 -8.86,4.83 -9.31,5 -0.45,0.17 -3.16,2.15 -6.06,4.38 -2.9,2.23 -7.62,5.88 -10.52,8.09 -31.52,24.17 -38.23,29.36 -38.33,29.64 -0.1,0.28 0.06,0.35 0.28,0.35 z' id='path60' style='fill:url(%23linear-gradient-14)' /%3E%3Cpath class='cls-16' d='m 342.73,160.58 c 0,0.21 3.19,1.7 7.09,3.33 7.56,3.15 8.71,3.63 12,5.09 l 2.1,0.93 3.34,-3.44 c 22,-22.69 33.48,-34.79 33.6,-35.48 0.09,-0.54 -0.23,-0.67 -2.11,-0.86 -1.21,-0.13 -3.39,-0.39 -4.84,-0.6 -1.45,-0.21 -4.45,-0.59 -6.66,-0.86 l -5.79,-0.72 -1.75,-0.22 -16.14,14.15 c -21.57,18.86 -20.86,18.24 -20.84,18.68 z' id='path62' style='fill:url(%23linear-gradient-15)' /%3E%3Cpath class='cls-17' d='m 343,164.15 -2.7,-1.23 -4.92,9 c -2.71,4.95 -4.93,9.21 -4.93,9.49 0,0.28 0.64,0.47 3.77,0.3 14.39,-0.81 18,-1 22.16,-1.21 l 4.72,-0.24 0.25,-1.23 a 31,31 0 0 0 0.34,-3.82 l 0.08,-2.59 -6.11,-2.78 c -3.36,-1.52 -7,-3.14 -8,-3.6 -1,-0.46 -3.18,-1.41 -4.66,-2.09 z' id='path64' style='fill:url(%23linear-gradient-16)' /%3E%3Cpath class='cls-18' d='m 363.58,184.8 -4.2,-0.05 c -2.32,0 -8.95,0.1 -14.72,0.28 a 96.54,96.54 0 0 0 -10.83,0.63 c -0.21,0.21 -0.08,0.7 0.31,1.31 0.39,0.61 8.47,11 18,23.24 9.53,12.24 21.36,27.32 26.17,33.49 19.54,25 23.73,30.34 24,30.34 0.27,0 15.54,-16 15.7,-16.45 0,-0.16 -12.2,-16.57 -27.18,-36.5 z' id='path66' style='fill:url(%23linear-gradient-17)' /%3E%3Cpath class='cls-19' d='m 447.28,194.67 c -0.38,-0.42 -5,-6.91 -10.26,-14.43 -5.26,-7.52 -11.75,-16.76 -14.4,-20.52 -2.65,-3.76 -6.93,-9.81 -9.49,-13.45 -6.85,-9.73 -8.82,-12.31 -9.4,-12.39 -0.29,0 -1.13,0.59 -1.88,1.4 -0.75,0.81 -9.22,9.37 -18.84,19 l -17.52,17.54 -0.52,4.9 c -0.28,2.7 -0.51,5.06 -0.51,5.24 0,0.35 2.07,3.18 7,9.65 1.27,1.64 3.93,5.11 5.93,7.72 2,2.61 9.4,12.23 16.43,21.38 l 19.47,25.34 c 3.67,4.77 6.84,8.67 7,8.67 0.44,0 0.59,-0.26 5.89,-10.16 4.59,-8.61 4.57,-8.58 14.11,-26.65 3.62,-6.85 6.7,-12.61 6.84,-12.8 a 31,31 0 0 0 0.51,-5 c 0.36,-4.36 0.29,-4.74 -0.36,-5.44 z' id='path68' style='fill:url(%23linear-gradient-18)' /%3E%3C/g%3E%3C/svg%3E";
assert(typeof THOR_SOV_IMAGE === 'string', 'missing THOR_SOV_IMAGE env variable');
const LOKI_SOV_IMAGE = process.env.LOKI_SOV_IMAGE ?? "data:image/svg+xml,%3Csvg style='filter:invert(1)' viewBox='0 0 480 480' id='svg49' width='480' height='480' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svg='http://www.w3.org/2000/svg'%3E%3Cdefs id='defs29'%3E%3Cstyle id='style2'%3E.cls-1%7Bfill:%2322262a;%7D.cls-2,.cls-3,.cls-4,.cls-5,.cls-6,.cls-7,.cls-8%7Bstroke:%2317492c;stroke-miterlimit:10;fill-rule:evenodd;%7D.cls-2%7Bfill:url(%23linear-gradient);%7D.cls-3%7Bfill:url(%23linear-gradient-2);%7D.cls-4%7Bfill:url(%23linear-gradient-3);%7D.cls-5%7Bfill:url(%23linear-gradient-4);%7D.cls-6%7Bfill:url(%23linear-gradient-5);%7D.cls-7%7Bfill:url(%23linear-gradient-6);%7D.cls-8%7Bfill:url(%23linear-gradient-7);%7D%3C/style%3E%3ClinearGradient id='linear-gradient' x1='193.78' y1='443.70999' x2='229.10001' y2='443.70999' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='lime' id='stop4' /%3E%3Cstop offset='0.43' stop-color='%2300fd00' id='stop6' /%3E%3Cstop offset='0.58' stop-color='%2300f600' id='stop8' /%3E%3Cstop offset='0.69' stop-color='%2300eb00' id='stop10' /%3E%3Cstop offset='0.78' stop-color='%2300da00' id='stop12' /%3E%3Cstop offset='0.86' stop-color='%2300c400' id='stop14' /%3E%3Cstop offset='0.93' stop-color='%2300a800' id='stop16' /%3E%3Cstop offset='0.99' stop-color='%23008900' id='stop18' /%3E%3Cstop offset='1' stop-color='green' id='stop20' /%3E%3C/linearGradient%3E%3ClinearGradient id='linear-gradient-2' x1='195.17999' y1='440.20999' x2='352.32999' y2='440.20999' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-3' x1='197.17999' y1='426.32999' x2='353.60999' y2='426.32999' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-4' x1='194.44' y1='370.32999' x2='379.09' y2='370.32999' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-5' x1='254.82001' y1='237.95' x2='347.35001' y2='237.95' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-6' x1='244.61' y1='223.39999' x2='365.23999' y2='223.39999' xlink:href='%23linear-gradient' /%3E%3ClinearGradient id='linear-gradient-7' x1='196.46001' y1='253.25999' x2='406.22' y2='253.25999' xlink:href='%23linear-gradient' /%3E%3ClinearGradient xlink:href='%23linear-gradient' id='linearGradient870' gradientUnits='userSpaceOnUse' x1='193.78' y1='443.70999' x2='229.10001' y2='443.70999' /%3E%3C/defs%3E%3Crect class='cls-1' width='480' height='480' id='rect31' x='0' y='0' style='stroke-width:0.8' /%3E%3Cg id='g896' transform='translate(-59.796875,-60.132812)'%3E%3Cpath class='cls-2' d='m 224.75,464.38 c -2.85,-9.22 -2.87,-21.08 0,-32.87 0.42,-1.77 0.77,-3.35 0.77,-3.51 0,-0.43 -2.34,-1.07 -6.46,-1.75 -9.11,-1.52 -14.87,-4.43 -20.37,-10.34 -3,-3.25 -3.08,-3.29 -3.46,-2.29 -1.2,3.16 -1.42,4.92 -1.42,11.22 0,5.87 0.12,7.19 1.07,11 4,15.94 14.3,30.18 26.17,36.16 3.63,1.82 7.24,2.87 7.84,2.26 0.34,-0.33 0.33,-0.63 0,-1.15 a 42.11,42.11 0 0 1 -4.14,-8.73 z' id='path33' style='fill:url(%23linearGradient870)' /%3E%3Cpath class='cls-3' d='m 319.73,435.27 a 65.52,65.52 0 0 0 -25.61,-6.37 68.45,68.45 0 0 1 -18.26,-3.29 c -4,-1.24 -4.79,-1.62 -13.36,-6.37 a 48.64,48.64 0 0 0 -14.14,-5.53 c -6.09,-1.42 -17.34,-2.69 -21.13,-2.39 a 26.38,26.38 0 0 1 -13.46,-2.51 c -3,-1.66 -4.56,-2.82 -9.12,-6.86 a 42.65,42.65 0 0 0 -4.11,-3.34 5.69,5.69 0 0 0 -4,-0.16 c -0.51,0.37 -1.41,4.66 -1.38,6.6 0.03,1.94 0.46,2.55 4,6.45 a 34.46,34.46 0 0 0 9.91,7.78 c 4.09,2 12.3,4.07 19,4.75 a 136.68,136.68 0 0 1 18.18,3.29 98.77,98.77 0 0 1 10.51,4.62 c 10.91,5.38 18.53,7.48 35.8,9.9 19.11,2.66 26.79,5.64 34.38,13.32 4.41,4.46 7,8.54 9.9,15.53 1,2.48 2.59,6 3.48,7.82 1.48,3.08 1.71,3.36 3.05,3.6 a 17.76,17.76 0 0 0 7.68,-0.71 c 1.09,-0.52 1.16,-0.72 1.2,-3 0.09,-5.07 -2.61,-13.48 -6.27,-19.55 a 59.51,59.51 0 0 0 -26.25,-23.58 z' id='path35' style='fill:url(%23linear-gradient-2)' /%3E%3Cpath class='cls-4' d='m 325.41,429.15 c -11,-5.82 -24.45,-9.55 -34.46,-9.58 -4,0 -7,-0.59 -13.28,-2.62 a 55,55 0 0 1 -14.44,-6.7 c -8.45,-5.48 -12,-6.38 -28.24,-7.24 -10.74,-0.57 -18.14,-2.7 -26.05,-7.46 -3,-1.84 -7.77,-3.32 -9.13,-2.87 -0.22,0.07 -0.9,0.25 -1.51,0.38 -0.84,0.18 -1.12,0.48 -1.12,1.21 0,1.07 0.67,1.45 2.61,1.45 1.94,0 4.26,0.91 8.25,3.22 8.79,5.07 16.23,7.08 28.3,7.69 8.12,0.41 11.86,0.85 15.56,1.82 2.94,0.77 4.53,1.58 9.56,4.89 5.71,3.73 9.93,5.56 19,8.26 3.56,1 5.34,1.31 10.92,1.62 a 67.25,67.25 0 0 1 19.81,3.78 c 6.22,2.06 16.65,7.2 20.47,10.09 4.71,3.54 11.36,10.29 16.5,16.72 l 5,6.24 c 0.08,0.09 0.25,0.06 0.39,-0.07 0.41,-0.41 -1.35,-3.88 -4.12,-8.12 -7.22,-11.09 -13.84,-17.33 -24.02,-22.71 z' id='path37' style='fill:url(%23linear-gradient-3)' /%3E%3Cpath class='cls-5' d='m 377.87,327.2 a 10.46,10.46 0 0 0 -0.52,2 c -1.23,6.57 -6.42,13.29 -11.54,15 -2.43,0.8 -5.92,0.61 -7.48,-0.41 -0.53,-0.35 -3.39,-1.75 -6.34,-3.09 -31.53,-14.46 -63.38,-16.84 -85.85,-6.46 -9.77,4.52 -18.25,12.93 -22,21.85 -2.33,5.53 -2.94,8.53 -3.16,15.6 a 48.56,48.56 0 0 0 1.75,15.82 c 0.39,1.44 -1.87,3.57 -5,4.74 -7.56,2.83 -10.14,2.59 -19.59,-1.79 -10,-4.61 -14.2,-5.41 -18.65,-3.53 -2,0.85 -5.27,2.77 -5,3 a 19.87,19.87 0 0 0 2.84,-0.32 q 7.52,-1.16 20,6.53 c 5.09,3.14 8.84,3.78 20.1,3.44 12.41,-0.36 19.35,0.81 25.69,4.4 2.78,1.57 4.57,2.92 8.81,6.66 3.8,3.34 4.93,3.65 6.72,1.87 2,-2 1.91,-3.8 -0.35,-6.64 -1.79,-2.24 -3.7,-7.08 -4.3,-11 -0.88,-5.56 0.38,-19.87 2.33,-26.62 4.19,-14.46 13.76,-23.48 26.12,-24.64 7.75,-0.73 15.8,1 24.28,5.26 a 51.86,51.86 0 0 1 9.34,5.75 c 3.32,2.73 5.86,3.17 7.84,1.36 1.36,-1.21 1.24,-3.94 -0.27,-6.57 -1.51,-2.63 -5.26,-6.1 -8.82,-8.24 -3.17,-1.9 -2.67,-2.11 1.12,-0.5 7.43,3.18 13.11,9.16 13.59,14.34 0.24,2.45 -0.52,4 -2.81,5.72 -3.08,2.35 -5.62,1.8 -12.41,-2.71 a 67.34,67.34 0 0 0 -19.93,-9.28 29.72,29.72 0 0 0 -8.38,-0.86 c -4.45,0 -5.42,0.12 -8,1 -8.74,3.14 -14.15,9.5 -16.93,19.93 -1,3.72 -1.08,4.71 -1.1,12.14 0,8.27 0.54,13.64 1.63,15.06 0.46,0.6 0.54,-0.29 0.55,-5.71 0,-10.18 1.53,-17.93 4.54,-23.31 5.34,-9.54 14.39,-14.23 24.94,-12.92 7.07,0.87 14.2,4 21.47,9.5 a 87.28,87.28 0 0 1 14.39,14.59 c 4,5.4 4.52,5.82 6.7,5.82 a 3.16,3.16 0 0 0 3.14,-1.4 19.34,19.34 0 0 0 4.13,-7.89 c 1.18,-4.24 2.56,-6.85 10.17,-19.22 5.53,-9 6.73,-12.35 7.27,-20.26 0.35,-5.16 0.32,-6.32 -0.17,-7.26 -0.36,-0.6 -0.73,-0.95 -0.86,-0.75 z' id='path39' style='fill:url(%23linear-gradient-4)' /%3E%3Cpath class='cls-6' d='m 260.49,281.41 c -4.52,0.36 -5.67,0.57 -5.67,1 0,1 3.54,1.32 9.91,0.85 a 82.46,82.46 0 0 0 31.59,-9 c 19.56,-9.79 35.53,-25.28 44.19,-42.9 A 62.15,62.15 0 0 0 347.22,208 c 0.51,-6.52 -0.5,-15.12 -1.83,-15.56 -0.22,-0.07 -0.37,3.67 -0.37,9.08 0,9.06 0,9.27 -1.29,14.06 -4.73,17.64 -16.53,34.42 -32.94,46.65 -15.48,11.56 -31.46,17.66 -50.3,19.18 z' id='path41' style='fill:url(%23linear-gradient-5)' /%3E%3Cpath class='cls-7' d='M 344.94,237.16 A 95.35,95.35 0 0 1 302.33,279 c -11.12,5.52 -21.29,8.19 -32.74,8.6 a 57.49,57.49 0 0 1 -19.12,-2 c -2.83,-0.7 -5.27,-1.15 -5.41,-1 -0.6,0.59 -0.6,4.65 0,7.47 0.8,3.75 3.77,10 5.56,11.66 1.57,1.45 5.77,3 11.75,4.19 22.43,4.67 45.86,-0.88 65.45,-15.49 a 111.87,111.87 0 0 0 17.28,-17.32 c 10.17,-13.64 16.17,-27.8 19.19,-45.24 0.82,-4.76 0.95,-6.78 0.95,-15.78 0,-10.44 -0.22,-12.71 -1.88,-20.79 a 97.07,97.07 0 0 0 -12.11,-30.67 c -8,-12.92 -20.27,-22.24 -32.56,-24.77 -2.8,-0.59 -6.24,-0.83 -6.24,-0.44 a 23.52,23.52 0 0 0 3.33,1.44 54,54 0 0 1 19.48,12.71 58,58 0 0 1 11.59,16.61 c 5.55,11.39 7.44,19.76 7.41,33 0,8.7 -0.52,12.5 -2.62,19.79 a 76.5,76.5 0 0 1 -6.7,16.19 z' id='path43' style='fill:url(%23linear-gradient-6)' /%3E%3Cpath class='cls-8' d='m 209.72,379.74 c 0.56,0.16 4,1.63 7.68,3.25 11.73,5.16 16.94,6.59 19.6,5.39 1.45,-0.67 1.58,-1.55 0.66,-4.32 -2.37,-7 -2.69,-18.85 -0.72,-26.41 4.13,-15.81 16.12,-26.24 36.49,-31.73 24.33,-6.58 52.66,-3.29 79.41,9.23 2,0.92 3.33,1.32 4.05,1.19 2.09,-0.4 13,-11.79 19.32,-20.1 20.91,-27.68 32,-64.66 29.7,-98.69 -1,-14.8 -3.54,-26.52 -8.39,-38.83 -11.92,-30.25 -34.53,-51.44 -62.36,-58.44 a 85.39,85.39 0 0 0 -26.55,-2.37 c -10.93,0.59 -20.47,3 -32.81,8.18 -7.54,3.18 -20.37,11.14 -20.37,12.62 0,0.91 0.74,0.68 4,-1.22 19.41,-11.38 39.67,-14.23 58.68,-8.25 a 78.36,78.36 0 0 1 18,9 c 18.12,13.06 30.27,34.34 35.46,62.1 0.82,4.45 0.93,6.26 0.92,14.78 0,10.54 -0.39,13.72 -2.61,22.52 A 104.79,104.79 0 0 1 355,270.91 c -12.16,18.29 -29.77,32.88 -48.38,40.06 -18.91,7.29 -37.15,7 -54.17,-1 -5.36,-2.49 -11.44,-7.17 -13.67,-10.51 -1.21,-1.82 -1.25,-2 -1.12,-5.72 0.1,-3 0.33,-4.25 1.05,-5.69 3.58,-7.29 14.13,-12.89 25.38,-13.51 2.22,-0.12 6.49,-0.5 9.5,-0.82 3.01,-0.32 6.82,-0.72 8.5,-0.84 5.51,-0.4 5.8,-0.68 2.49,-2.36 -6.81,-3.44 -19.4,-5.6 -32.63,-5.6 a 104.37,104.37 0 0 0 -22.66,2.13 c -8.33,1.68 -11.59,2.8 -12.27,4.2 -2,4.24 -3,16.56 -1.89,24 a 40.9,40.9 0 0 1 0.54,4.67 c -3.62,2.16 -6,4.75 -9.32,10 -11.71,18.64 -13.39,52.42 -3.28,65.79 0.98,1.29 4.34,3.34 6.65,4.03 z' id='path45' style='fill:url(%23linear-gradient-7)' /%3E%3C/g%3E%3C/svg%3E";
assert(typeof LOKI_SOV_IMAGE === 'string', 'missing LOKI_SOV_IMAGE env variable');
const ODIN_SOV_IMAGE = process.env.ODIN_SOV_IMAGE ?? "data:image/svg+xml,%3Csvg style='filter:invert(1)' viewBox='0 0 480 480' id='svg27' width='480' height='480' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svg='http://www.w3.org/2000/svg'%3E%3Cdefs id='defs19'%3E%3Cstyle id='style2'%3E.cls-1%7Bfill:%2322262a;%7D.cls-2%7Bstroke:%23174547;stroke-miterlimit:10;fill-rule:evenodd;fill:url(%23linear-gradient);%7D%3C/style%3E%3ClinearGradient id='linear-gradient' x1='300' y1='109.87' x2='300' y2='490.13' gradientUnits='userSpaceOnUse' gradientTransform='translate(-60.114272,-60.093146)'%3E%3Cstop offset='0' stop-color='%2300fffe' id='stop4' /%3E%3Cstop offset='0.18' stop-color='%2300fbfa' id='stop6' /%3E%3Cstop offset='0.36' stop-color='%2300efee' id='stop8' /%3E%3Cstop offset='0.53' stop-color='%2300dcdb' id='stop10' /%3E%3Cstop offset='0.71' stop-color='%2300c1c0' id='stop12' /%3E%3Cstop offset='0.88' stop-color='%23009e9d' id='stop14' /%3E%3Cstop offset='1' stop-color='%2300807f' id='stop16' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect class='cls-1' width='480' height='480' id='rect21' x='0' y='0' style='stroke-width:0.8' /%3E%3Cpath class='cls-2' d='m 172.54573,49.906853 c -26,2.83 -45.68,22.920001 -49,50.139997 a 85.72,85.72 0 0 0 0.72,20.54 74.33,74.33 0 0 0 11.31,26.68 c 4.71,6.56 12.4,13.8 17.78,16.73 l 1.8,1 2.48,-2.51 c 7.6,-7.71 14.81,-20.54 17.51,-31.18 0.61,-2.41 0.78,-3.71 0.54,-4.15 a 11.26,11.26 0 0 0 -2.8,-2.08 32.8,32.8 0 0 1 -12.27,-13.56 c -4.31,-9 -4.65,-19.639997 -1,-30.459997 a 48.57,48.57 0 0 1 10.66,-17.34 43.2,43.2 0 0 1 13.09,-9.54 c 5.1,-2.45 5.47,-3.06 2.27,-3.7 a 79.44,79.44 0 0 0 -13.09,-0.57 z m 125.69,0 c -0.71,0.08 -2.4,0.33 -3.76,0.55 -3.66,0.6 -3.36,1.19 1.9,3.72 a 46.41,46.41 0 0 1 21.37,21.290001 c 6,12.06 6.54,25.319996 1.42,35.999996 a 32.8,32.8 0 0 1 -12.28,13.57 11.26,11.26 0 0 0 -2.8,2.08 c -0.24,0.44 -0.07,1.74 0.54,4.15 2.7,10.64 9.91,23.47 17.51,31.18 l 2.48,2.51 1.8,-1 c 5.38,-2.93 13.07,-10.17 17.78,-16.73 a 74.33,74.33 0 0 0 11.31,-26.68 85.72,85.72 0 0 0 0.72,-20.54 c -3.11,-25.439996 -20.69,-44.999996 -44.42,-49.449996 a 75.37,75.37 0 0 0 -13.57,-0.650001 z m -59.57,45.900001 c -3.82,5.539996 -7.22,18.099996 -5.68,20.999996 a 12.15,12.15 0 0 0 3.69,2.57 l 3.21,1.68 3.21,-1.68 a 12.15,12.15 0 0 0 3.69,-2.57 c 1.13,-2.11 -0.57,-10.7 -3.25,-16.45 -1.51,-3.219996 -3.17,-5.909996 -3.65,-5.909996 a 4.5,4.5 0 0 0 -1.22,1.36 z m -20.78,21.569996 a 11.61,11.61 0 0 0 -3.26,1.53 l -1.27,1 1.93,0.5 a 25,25 0 0 1 11.24,6.89 c 7.77,7.74 9.89,15.43 8.58,31.2 -0.88,10.62 -3.13,17.72 -6.43,20.23 -1.07,0.82 -1.81,1 -5.3,1.3 a 38.84,38.84 0 0 0 -28,15.68 41.77,41.77 0 0 0 -6.41,13.64 25.62,25.62 0 0 0 -0.82,8.87 c 0.11,4.13 0.24,5.15 0.75,5.66 0.51,0.51 0.71,0.42 2.07,-2.53 a 37,37 0 0 1 7.92,-11.46 24.5,24.5 0 0 1 10.39,-6.53 c 2.91,-1 3.65,-1.12 7.62,-1.12 3.97,0 4.8,0.14 7.34,1 a 29.12,29.12 0 0 1 13.77,10.09 c 0.7,1 1.53,1.85 1.83,1.85 0.3,0 1.13,-0.83 1.83,-1.85 a 29.12,29.12 0 0 1 13.77,-10.09 c 2.54,-0.86 3.51,-1 7.34,-1 3.83,0 4.71,0.11 7.62,1.12 a 24.5,24.5 0 0 1 10.49,6.49 37,37 0 0 1 7.92,11.46 c 1.36,3 1.49,3.11 2.07,2.53 0.58,-0.58 0.64,-1.53 0.75,-5.66 a 25.62,25.62 0 0 0 -0.82,-8.87 39,39 0 0 0 -34.36,-29.32 c -3.49,-0.3 -4.23,-0.48 -5.3,-1.3 -3.3,-2.51 -5.55,-9.61 -6.43,-20.23 -1.31,-15.77 0.81,-23.46 8.58,-31.2 a 25,25 0 0 1 11.24,-6.89 l 1.93,-0.5 -1.27,-1 a 12.48,12.48 0 0 0 -3.63,-1.58 c -5.11,-1.31 -14.33,0.42 -20,3.76 l -1.6,0.94 -1.6,-0.94 c -5.77,-3.29 -15.48,-5.07 -20.48,-3.67 z m -10.29,6 a 17.59,17.59 0 0 0 -8,4.67 c -2.55,2.36 -3.9,5.19 -5.4,11.28 a 81.92,81.92 0 0 1 -17,32.83 31,31 0 0 1 -3.26,3.4 10.16,10.16 0 0 0 -1.93,1.56 c -1.46,1.35 -1.84,2 -2.82,5 -2.07,6.4 -3.22,13.72 -2.91,18.65 0.11,1.75 0.5,5.75 0.86,8.88 0.84,7.21 1,35.53 0.2,42.93 -1.32,12.75 -3,21.73 -5.08,27.89 -1.73,5 -3.27,7.53 -5.14,8.31 -1.87,0.78 -1.57,1.37 0.51,1.07 3.23,-0.46 6.18,-2.16 9.46,-5.44 6.67,-6.67 11.67,-16.9 15.59,-31.83 2.63,-10 3.62,-18.22 4,-33.21 0.26,-9.94 0.42,-12.15 1.05,-14.42 2.44,-8.95 9,-17.21 17.86,-22.39 5.42,-3.18 12.39,-5.51 16.79,-5.61 4,-0.1 4.82,-0.44 6.17,-2.63 1.46,-2.37 2,-3.8 3.29,-9.12 2.52,-10.19 2.37,-19.71 -0.41,-26.85 -2.24,-5.73 -7,-11.27 -11.71,-13.54 -4.71,-2.27 -7.83,-2.58 -12.12,-1.45 z m 56.59,-0.14 c -6.52,1.58 -12.93,7.72 -15.83,15.15 -2.78,7.14 -2.93,16.66 -0.41,26.85 1.32,5.32 1.83,6.75 3.29,9.12 1.35,2.19 2.15,2.53 6.17,2.63 4.4,0.1 11.37,2.43 16.79,5.61 8.82,5.18 15.42,13.44 17.86,22.39 0.63,2.27 0.79,4.48 1.05,14.42 0.41,15 1.4,23.18 4,33.21 3.92,14.93 8.92,25.16 15.59,31.83 3.28,3.28 6.23,5 9.46,5.44 2.08,0.3 2.36,-0.3 0.51,-1.07 -4.37,-1.83 -8,-14.6 -10.22,-36.2 -0.77,-7.4 -0.64,-35.72 0.2,-42.93 0.36,-3.13 0.75,-7.13 0.86,-8.88 0.31,-4.93 -0.84,-12.25 -2.91,-18.65 -1,-3 -1.36,-3.69 -2.82,-5 a 10.16,10.16 0 0 0 -1.93,-1.56 31,31 0 0 1 -3.26,-3.4 81.92,81.92 0 0 1 -17,-32.83 c -1.51,-6.11 -2.85,-8.91 -5.42,-11.3 -4.87,-4.59 -10.28,-6.22 -15.98,-4.85 z m -85.81,5.62 a 8.13,8.13 0 0 0 -0.87,2.84 53.93,53.93 0 0 1 -5.11,14.32 c -3.77,7.57 -8.83,14.73 -13.06,18.45 l -1.61,1.44 0.66,1.09 c 0.69,1.13 4.3,4.14 6.73,5.61 a 20,20 0 0 0 5.81,2.23 c 1.65,0 9.55,-10.5 14.06,-18.67 3.59,-6.53 7.07,-15.35 7.44,-18.94 l 0.2,-1.84 -2.33,-1.88 a 40.66,40.66 0 0 0 -3.62,-2.64 c -2.11,-1.26 -7.5,-2.55 -8.3,-2.03 z m 119.61,0.27 a 17,17 0 0 0 -8.14,4.07 l -2.7,2.16 0.19,1.84 c 0.39,3.6 3.86,12.42 7.45,18.95 4.51,8.17 12.41,18.67 14.06,18.67 a 20,20 0 0 0 5.81,-2.23 c 2.43,-1.47 6,-4.48 6.73,-5.61 l 0.66,-1.09 -1.61,-1.42 c -7.63,-6.71 -16.27,-22.31 -18.17,-32.77 -0.62,-3.41 -0.58,-3.39 -4.28,-2.59 z m -56.48,52.69 c 1.53,1.82 2.23,4.75 2.23,9.33 0,4.32 -0.42,6.32 -1.74,8.26 -1.12,1.65 -1.93,2.12 -2.75,1.62 a 9.34,9.34 0 0 1 -2.76,-4.34 c -0.69,-2.29 -0.58,-9.15 0.19,-11.66 0.73,-2.34 2.2,-4.34 3.21,-4.34 a 3.1,3.1 0 0 1 1.62,1.11 z m -34.95,29.67 a 10.09,10.09 0 0 0 -3.59,2.27 c -3.06,3 -6.75,11.56 -6.86,15.93 -0.06,2.15 0.06,2.45 5.56,13.39 a 141.08,141.08 0 0 0 7,12.85 c 2.91,3.45 7.54,4.66 10.94,2.84 6.49,-3.49 13.91,-15.3 16.26,-25.9 1.16,-5.25 0.85,-8.27 -1,-10.06 -1,-1 -12.09,-7.06 -18.63,-10.23 -4.22,-2.06 -6.27,-2.29 -9.68,-1.11 z m -18.6,49.66 c -0.56,1.06 -1.49,2.77 -2,3.79 -2.89,5.29 -7.28,16.06 -9.94,24.38 a 175.29,175.29 0 0 0 -5.81,25 c -0.35,2.12 -0.91,8.32 -1.29,14.49 a 91.05,91.05 0 0 0 2.07,22.53 c 1.72,7.19 3.38,10.58 9.9,20.29 13.85,20.65 22.82,41.87 21.81,51.66 l -0.25,2.4 0.81,-0.79 c 1.52,-1.48 1.92,-4.06 2.09,-13.39 a 87.44,87.44 0 0 0 -0.46,-13.6 c -1.37,-10.84 -2.87,-16.68 -6.06,-23.43 -4.18,-8.87 -6.18,-18.68 -6.84,-33.53 a 133.57,133.57 0 0 1 3,-31.79 53.66,53.66 0 0 1 4.56,-13 24.56,24.56 0 0 0 2.71,-8.09 c 1,-5.84 0.88,-6.48 -1,-8.84 -3.17,-3.89 -9.13,-14.48 -10.45,-18.58 -0.71,-2.04 -1.59,-1.87 -2.85,0.48 z m 101.09,-0.55 c -1.32,4.1 -7.28,14.69 -10.45,18.58 -1.92,2.36 -2,3 -1,8.84 a 24.56,24.56 0 0 0 2.71,8.09 53.66,53.66 0 0 1 4.56,13 133.57,133.57 0 0 1 3,31.79 c -0.66,14.85 -2.66,24.66 -6.84,33.53 -3.19,6.75 -4.69,12.59 -6.06,23.43 a 87.44,87.44 0 0 0 -0.45,13.58 c 0.17,9.33 0.57,11.91 2.09,13.39 l 0.81,0.79 -0.25,-2.4 c -1,-9.79 8,-31 21.81,-51.66 6.52,-9.71 8.18,-13.1 9.9,-20.29 a 91.05,91.05 0 0 0 2.01,-22.52 c -0.38,-6.17 -0.94,-12.37 -1.29,-14.49 a 175.29,175.29 0 0 0 -5.81,-25 c -2.66,-8.32 -7.05,-19.09 -9.94,-24.38 -0.56,-1 -1.49,-2.73 -2.05,-3.79 -1.24,-2.31 -2.12,-2.48 -2.75,-0.51 z m -61.29,7.65 c -1.12,2.09 -10,9 -16.35,12.73 a 24.35,24.35 0 0 0 -3.59,2.43 c -0.46,0.5 -0.77,2.13 -1.18,6.09 -0.47,4.43 -0.8,6 -1.85,8.76 a 101.59,101.59 0 0 0 -5.26,21 c -0.69,4.25 -1,14.93 -0.68,22 0.82,17.42 5.77,34.3 14,47.83 4.65,7.63 8.1,18.41 9.41,29.37 a 21.44,21.44 0 0 1 -0.6,9.71 6.38,6.38 0 0 0 -0.45,1.89 3.81,3.81 0 0 0 1.41,-0.49 c 1.62,-0.76 3.07,-3.52 3.89,-7.39 0.91,-4.32 1.1,-18.45 0.36,-26.42 a 182.48,182.48 0 0 0 -5.9,-32.75 c -0.92,-3.46 -1.92,-8 -2.21,-10.14 -1.58,-11.23 0.34,-26.15 4.95,-38.4 3.2,-8.52 7,-14.23 11.39,-17 1.11,-0.7 2.64,-1.76 3.39,-2.36 l 1.4,-1.1 1.38,1.07 c 0.75,0.6 2.28,1.66 3.39,2.36 10.84,6.89 19.18,35.16 16.34,55.4 -0.29,2.11 -1.29,6.68 -2.21,10.14 a 182.48,182.48 0 0 0 -5.9,32.75 c -0.74,8 -0.55,22.1 0.36,26.42 0.82,3.87 2.27,6.63 3.89,7.39 a 3.81,3.81 0 0 0 1.41,0.49 6.38,6.38 0 0 0 -0.45,-1.89 21.44,21.44 0 0 1 -0.6,-9.71 c 1.31,-11 4.76,-21.74 9.41,-29.37 8.25,-13.53 13.2,-30.41 14,-47.83 0.33,-7.06 0,-17.74 -0.68,-22 a 101.59,101.59 0 0 0 -5.26,-21 c -1.05,-2.74 -1.38,-4.33 -1.85,-8.76 -0.4,-3.91 -0.73,-5.6 -1.17,-6.08 a 20.79,20.79 0 0 0 -3.22,-2.21 c -6.39,-3.75 -15.35,-10.66 -16.61,-12.79 -0.8,-1.34 -1.8,-1.43 -4.12,-0.38 a 28.59,28.59 0 0 0 -7.21,5.62 l -0.92,1.16 -0.92,-1.16 a 28.59,28.59 0 0 0 -7.21,-5.62 c -2.21,-1 -3.35,-0.94 -3.98,0.22 z m 9.64,34.61 c -1.89,1.81 -6.35,8.22 -8.05,11.57 -4,7.83 -6.34,19.46 -6.34,31.14 a 67,67 0 0 0 3.85,22.1 c 2.42,6.16 3.37,8.79 4.48,12.48 5.13,16.94 7.58,27.78 7.91,35 0.07,1.5 0.23,2 0.64,2 0.41,0 0.57,-0.51 0.64,-2 0.33,-7.27 2.78,-18.11 7.91,-35 1.11,-3.69 2.06,-6.32 4.48,-12.48 5.22,-13.29 5.09,-33 -0.3,-47.91 a 42.35,42.35 0 0 0 -5.73,-11.14 c -2.71,-4.12 -5.91,-7.58 -7,-7.58 a 7.38,7.38 0 0 0 -2.49,1.8 z' id='path23' style='fill:url(%23linear-gradient)' /%3E%3C/svg%3E";
assert(typeof ODIN_SOV_IMAGE === 'string', 'missing ODIN_SOV_IMAGE env variable');

export default {
    ...{
        IPFS_GATEWAY,
        MD_ABOUT_URL,
        UI_PERSISTENCE,
        UI_MINING_SPEED,
    }, ...{
        THOR_MOE_V2a,
        LOKI_MOE_V2a,
        ODIN_MOE_V2a,
        THOR_MOE_V2b: THOR_MOE_V2a,
        LOKI_MOE_V2b: LOKI_MOE_V2a,
        ODIN_MOE_V2b: ODIN_MOE_V2a,
        THOR_MOE_V2c: THOR_MOE_V2a,
        LOKI_MOE_V2c: LOKI_MOE_V2a,
        ODIN_MOE_V2c: ODIN_MOE_V2a,
        THOR_MOE_V3a,
        LOKI_MOE_V3a,
        ODIN_MOE_V3a,
        THOR_MOE_V3b: THOR_MOE_V3a,
        LOKI_MOE_V3b: LOKI_MOE_V3a,
        ODIN_MOE_V3b: ODIN_MOE_V3a,
        THOR_MOE_V4a,
        LOKI_MOE_V4a,
        ODIN_MOE_V4a,
        THOR_MOE_V5a,
        LOKI_MOE_V5a,
        ODIN_MOE_V5a,
        THOR_MOE_V5b,
        LOKI_MOE_V5b,
        ODIN_MOE_V5b,
        THOR_MOE_V5c,
        LOKI_MOE_V5c,
        ODIN_MOE_V5c,
        THOR_MOE_V6a,
        LOKI_MOE_V6a,
        ODIN_MOE_V6a,
        THOR_MOE_V6b,
        LOKI_MOE_V6b,
        ODIN_MOE_V6b,
        THOR_MOE_V6c,
        LOKI_MOE_V6c,
        ODIN_MOE_V6c,
        THOR_MOE_V7a,
        LOKI_MOE_V7a,
        ODIN_MOE_V7a,
    }, ...{
        THOR_MOE_IMAGE,
        LOKI_MOE_IMAGE,
        ODIN_MOE_IMAGE,
    }, ...{
        THOR_NFT_V2a,
        LOKI_NFT_V2a,
        ODIN_NFT_V2a,
        THOR_NFT_V2b,
        LOKI_NFT_V2b,
        ODIN_NFT_V2b,
        THOR_NFT_V2c,
        LOKI_NFT_V2c,
        ODIN_NFT_V2c,
        THOR_NFT_V3a,
        LOKI_NFT_V3a,
        ODIN_NFT_V3a,
        THOR_NFT_V3b,
        LOKI_NFT_V3b,
        ODIN_NFT_V3b,
        THOR_NFT_V4a,
        LOKI_NFT_V4a,
        ODIN_NFT_V4a,
        THOR_NFT_V5a,
        LOKI_NFT_V5a,
        ODIN_NFT_V5a,
        THOR_NFT_V5b,
        LOKI_NFT_V5b,
        ODIN_NFT_V5b,
        THOR_NFT_V5c,
        LOKI_NFT_V5c,
        ODIN_NFT_V5c,
        XPOW_NFT_V6a,
        XPOW_NFT_V6b,
        XPOW_NFT_V6c,
        XPOW_NFT_V7a,
    }, ...{
        THOR_PPT_V4a,
        LOKI_PPT_V4a,
        ODIN_PPT_V4a,
        THOR_PPT_V5a,
        LOKI_PPT_V5a,
        ODIN_PPT_V5a,
        THOR_PPT_V5b,
        LOKI_PPT_V5b,
        ODIN_PPT_V5b,
        THOR_PPT_V5c,
        LOKI_PPT_V5c,
        ODIN_PPT_V5c,
        XPOW_PPT_V6a,
        XPOW_PPT_V6b,
        XPOW_PPT_V6c,
        XPOW_PPT_V7a,
    }, ...{
        THOR_PTY_V4a,
        LOKI_PTY_V4a,
        ODIN_PTY_V4a,
        THOR_PTY_V5a,
        LOKI_PTY_V5a,
        ODIN_PTY_V5a,
        THOR_PTY_V5b,
        LOKI_PTY_V5b,
        ODIN_PTY_V5b,
        THOR_PTY_V5c,
        LOKI_PTY_V5c,
        ODIN_PTY_V5c,
        XPOW_PTY_V6a,
        XPOW_PTY_V6b,
        XPOW_PTY_V6c,
        XPOW_PTY_V7a,
    }, ...{
        THOR_MTY_V4a,
        LOKI_MTY_V4a,
        ODIN_MTY_V4a,
        THOR_MTY_V5a,
        LOKI_MTY_V5a,
        ODIN_MTY_V5a,
        THOR_MTY_V5b,
        LOKI_MTY_V5b,
        ODIN_MTY_V5b,
        THOR_MTY_V5c,
        LOKI_MTY_V5c,
        ODIN_MTY_V5c,
        THOR_MTY_V6a,
        LOKI_MTY_V6a,
        ODIN_MTY_V6a,
        XPOW_MTY_V6b,
        XPOW_MTY_V6c,
        XPOW_MTY_V7a,
    }, ...{
        THOR_SOV_V5a,
        LOKI_SOV_V5a,
        ODIN_SOV_V5a,
        THOR_SOV_V5b,
        LOKI_SOV_V5b,
        ODIN_SOV_V5b,
        THOR_SOV_V5c,
        LOKI_SOV_V5c,
        ODIN_SOV_V5c,
        THOR_SOV_V6a,
        LOKI_SOV_V6a,
        ODIN_SOV_V6a,
        THOR_SOV_V6b,
        LOKI_SOV_V6b,
        ODIN_SOV_V6b,
        THOR_SOV_V6c,
        LOKI_SOV_V6c,
        ODIN_SOV_V6c,
        THOR_SOV_V7a,
        LOKI_SOV_V7a,
        ODIN_SOV_V7a,
    }, ...{
        THOR_SOV_IMAGE,
        LOKI_SOV_IMAGE,
        ODIN_SOV_IMAGE,
    }
};
