export const getPathMessage = (path?: string): string =>
  path !== undefined ? ` at path ${path}` : ''
