export const isFunction = (candidate: unknown): candidate is Function =>
  typeof candidate === 'function'
