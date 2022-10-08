import { Token } from './token';

export enum MinerStatus {
    initializing,
    initialized,
    starting,
    started,
    stopping,
    stopped,
    pausing,
    paused,
    resuming,
    resumed
}
export type Mining = {
    /** set on dispatching mining */
    status: MinerStatus | null;
    speed: Record<Token, number>;
};
