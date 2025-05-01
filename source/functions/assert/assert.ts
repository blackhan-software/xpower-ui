export class AssertError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "AssertError";
    }
}
/**
 * Asserts that the given expression is truthy.
 *
 * @param expression of unknown type to evaluate
 * @param message to display if the assertion fails
 * @throws {AssertError} if the expression is falsy
 */
export function assert(
    expression: unknown, message?: string
): asserts expression {
    if (!expression) {
        throw new AssertError(message);
    }
}
export default assert;
