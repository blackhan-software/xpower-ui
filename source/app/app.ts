import mitt from 'mitt';

export class App {
    public static get event() {
        return this._event;
    }
    private static _event = mitt<{
        'refresh-tips': undefined | {
            keep?: boolean;
        };
        'toggle-level': {
            level?: number; flag: boolean;
        };
        'toggle-issue': {
            level?: number; issue?: number; flag: boolean;
        };
    }>();
}
export default App;
