import AvvyDomains from "./avvy-domains";
import { Global } from '../../types';
declare const global: Global;

describe('AvvyDomains', () => {
    beforeAll(() => {
        global.localStorage = {
            setItem(key: string, value: string) {
                if (global.LOCAL_STORAGE === undefined) {
                    global.LOCAL_STORAGE = {};
                }
                global.LOCAL_STORAGE[key] = value;
            },
            getItem(key: string) {
                if (global.LOCAL_STORAGE === undefined) {
                    global.LOCAL_STORAGE = {};
                }
                return global.LOCAL_STORAGE[key] ?? null;
            }
        }
    });
    beforeAll(() => {
        global.MY_PROVIDER_URL = process.env.MY_PROVIDER_URL;
        if (global.MY_PROVIDER_URL === undefined) {
            global.MY_PROVIDER_URL = 'https://api.avax.network/ext/bc/C/rpc';
        }
        global.ADO = new AvvyDomains();
    });
    it('should be constructible', () => {
        const ado = global.ADO;
        expect(ado).toBeDefined();
    });
    it('should resolve coconaut.avax (slow)', async () => {
        const account = BigInt(
            '0xc6fed32f84fca103e946eb21ad16fd7887a3cec5'
        );
        const ado = global.ADO;
        const name = await ado.reverseResolveEVMToName(account);
        expect(name).toEqual('coconaut.avax');
    });
    it('should resolve coconaut.avax (fast)', async () => {
        const account = BigInt(
            '0xc6fed32f84fca103e946eb21ad16fd7887a3cec5'
        );
        const ado = global.ADO;
        const name = await ado.reverseResolveEVMToName(account);
        expect(name).toEqual('coconaut.avax');
    });
    it('should resolve coconaut.avax (fast)', async () => {
        const account = BigInt(
            '0xc6fED32F84fca103E946eB21Ad16fD7887a3CEc5'
        );
        const ado = global.ADO;
        const name = await ado.reverseResolveEVMToName(account);
        expect(name).toEqual('coconaut.avax');
    });
    it('should resolve to empty string', async () => {
        const account = BigInt(
            '0x0000000000000000000000000000000000000000'
        );
        const ado = global.ADO;
        const name = await ado.reverseResolveEVMToName(account);
        expect(name).toEqual('');
    });
});
