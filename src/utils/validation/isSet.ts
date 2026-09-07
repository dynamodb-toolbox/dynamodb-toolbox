/** Type guard checking that `candidate` is a `Set`. */
export const isSet = (candidate: unknown): candidate is Set<unknown> => candidate instanceof Set
