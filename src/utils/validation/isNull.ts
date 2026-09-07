/** Type guard checking that `candidate` is `null`. */
export const isNull = (candidate: unknown): candidate is null => candidate === null
