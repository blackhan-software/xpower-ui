export function inEnum<T extends object>(enumObject: T, fieldValue: unknown): fieldValue is T[keyof T] {
    return Object.values(enumObject).includes(fieldValue);
}
export default inEnum;
