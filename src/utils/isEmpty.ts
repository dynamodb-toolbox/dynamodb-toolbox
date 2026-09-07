/** Return `true` if an object or array has no own enumerable keys. */
export const isEmpty = (input: object | unknown[]): boolean => Object.keys(input).length === 0
