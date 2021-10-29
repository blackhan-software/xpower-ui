export type Refresh = {
    type: 'refresh', payload: {
        date: string
    }
};
export const refresh = (): Refresh => ({
    type: 'refresh', payload: {
        date: new Date().toISOString()
    }
});
export type Action = Refresh;
