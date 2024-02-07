export type Prefixed<T, Prefix extends string> = {
    [K in keyof T as K extends `${Prefix}${infer _}` ? K : never]: T[K]
};
export default Prefixed;
