/** Type guard checking that `candidate` is a function. */
export const isFunction = (candidate: unknown): candidate is (...args: unknown[]) => unknown =>
  typeof candidate === 'function'
