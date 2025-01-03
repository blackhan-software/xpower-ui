export enum ChainId {
    AVALANCHE_MAINNET = '0xa86a',   // 43114
    AVALANCHE_FUJI = '0xa869',      // 43113
    AVALANCHE_LOCAL = '0xa868',     // 43112
    HARDHAT = '0x7a69',             // 31337
}
export class Chain {
    public constructor(id: ChainId) {
        this._id = id;
    }
    public get name(): string {
        switch (this._id) {
            case ChainId.AVALANCHE_MAINNET:
                return 'Avalanche C-Chain';
            case ChainId.AVALANCHE_FUJI:
                return 'Avalanche Fuji Testnet';
            case ChainId.AVALANCHE_LOCAL:
                return 'Avalanche Localhost';
            case ChainId.HARDHAT:
                return 'Hardhat Localhost';
            default:
                return 'Unsupported Network';
        }
    }
    public get id(): ChainId {
        return this._id;
    }
    public get currency(): {
        name: string, symbol: string, decimals: number
    } {
        switch (this._id) {
            case ChainId.AVALANCHE_MAINNET:
            case ChainId.AVALANCHE_FUJI:
            case ChainId.AVALANCHE_LOCAL:
            case ChainId.HARDHAT:
                return {
                    name: 'AVAX',
                    symbol: 'AVAX',
                    decimals: 18
                };
            default:
                return {
                    name: 'N/A',
                    symbol: 'N/A',
                    decimals: 18
                };
        }
    }
    public get rpcUrls(): string[] {
        switch (this._id) {
            case ChainId.AVALANCHE_MAINNET:
                return ['https://api.avax.network/ext/bc/C/rpc'];
            case ChainId.AVALANCHE_FUJI:
                return ['https://api.avax-test.network/ext/bc/C/rpc'];
            case ChainId.AVALANCHE_LOCAL:
                return ['http://localhost:9650/ext/bc/C/rpc'];
            case ChainId.HARDHAT:
                return ['http://localhost:8545'];
            default:
                return [];
        }
    }
    public get explorerUrls(): string[] {
        switch (this._id) {
            case ChainId.AVALANCHE_MAINNET:
                return ['https://snowtrace.io', 'https://snowscan.xyz'];
            case ChainId.AVALANCHE_FUJI:
                return ['https://testnet.snowtrace.io', 'https://testnet.snowscan.xyz'];
            case ChainId.AVALANCHE_LOCAL:
            case ChainId.HARDHAT:
            default:
                return [];
        }
    }
    private _id: ChainId;
}
export default Chain;
