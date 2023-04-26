/* eslint @typescript-eslint/no-explicit-any: [off] */
import { EventLog, EventPayload } from 'ethers';
export type TxEvent<T = any> = EventPayload<T> & {
    log: EventLog
}
