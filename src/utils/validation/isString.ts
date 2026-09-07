/** Type guard checking that `candidate` is a string. */
export const isString = (candidate: unknown): candidate is string => typeof candidate === 'string'
