import { Global } from '../../types';
declare const global: Global;

import AvvyDomains from './avvy-domains';

export function AvvyDomainsFactory(): AvvyDomains {
    return global.ADO = new AvvyDomains();
}
export default AvvyDomainsFactory;
