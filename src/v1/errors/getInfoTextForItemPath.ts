export const getInfoTextForItemPath = (path?: string): string =>
  path !== undefined ? ` at path ${path}` : ''
