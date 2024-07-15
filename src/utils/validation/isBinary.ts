export const isBinary = (candidate: unknown): candidate is Uint8Array =>
  candidate instanceof Uint8Array
