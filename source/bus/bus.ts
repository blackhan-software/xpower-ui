import mitt from 'mitt';

export const Bus = mitt<{
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
export default Bus;
