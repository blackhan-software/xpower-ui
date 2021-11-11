/**
 * @jest-environment jsdom
 */
import { IntervalManager } from './interval-manager';
import { Started, Stopped, Tick } from './interval-manager';

beforeEach(() => {
    jest.useFakeTimers();
});
afterEach(() => {
    jest.useRealTimers();
});
describe('IntervalManager', () => {
    it('should start & stop', async () => {
        const im = new IntervalManager({
            start: false
        });
        const started = new Promise<Started>((resolve) => {
            im.on('started', ({ running }: Started) => {
                resolve({ running });
            });
        });
        const stopped = new Promise<Stopped>((resolve) => {
            im.on('stopped', ({ running }: Stopped) => {
                resolve({ running });
            });
        });
        im.start();
        expect(await started).toEqual({ running: true });
        im.stop();
        expect(await stopped).toEqual({ running: false });
    });
    it('should tick', async () => {
        const im = new IntervalManager({
            start: false
        });
        const tick = new Promise<Tick>((resolve) => {
            im.on('tick', ({ current, previous }: Tick) => {
                resolve({ current, previous });
            });
        });
        im.start();
        jest.advanceTimersByTime(3_600_000);
        im.stop();
        const { current, previous } = await tick;
        expect(typeof current).toEqual('number');
        expect(typeof previous).toEqual('number');
        expect(current).toBeGreaterThan(previous);
    });
});
