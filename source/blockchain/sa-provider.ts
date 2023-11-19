import { SafeAppProvider as SAP } from '@safe-global/safe-apps-provider';
import SDK from '@safe-global/safe-apps-sdk';
import { ROParams } from '../params';

import { Global } from '../types';
declare const global: Global;

type SafeAppProvider = SAP & {
    isConnected: () => Promise<boolean>;
}
export function SAProviderDomains(): RegExp[] {
    return [/gnosis-safe.io$/i, /app.safe.global$/i];
}
export async function SAProvider(): Promise<
    SafeAppProvider | undefined
> {
    if (global.SA_PROVIDER === undefined) {
        const sa_domains = SAProviderDomains();
        const sdk = new SDK({
            allowedDomains: sa_domains,
            debug: ROParams.debug > 0,
        });
        const ex = (sap: SAP) => {
            const pro = sap as SafeAppProvider;
            pro.isConnected = () => sap
                .request({ method: 'eth_accounts' })
                .then((a) => Boolean(a?.length));
            return pro;
        };
        const safe = await sdk.safe.getInfo();
        const sa_provider = new SAP(safe, sdk);
        const ex_provider = ex(sa_provider);
        global.SA_PROVIDER = ex_provider;
        return ex_provider;
    }
    return global.SA_PROVIDER;
}
export default SAProvider;
