export const isFunction = (candidate: unknown): candidate is (...args: unknown[]) => unknown =>
  typeof candidate === 'function'
