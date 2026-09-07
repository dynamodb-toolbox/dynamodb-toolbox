/** Type guard checking that `input` is a `Uint8Array` (binary). */
export const isBinary = (input: unknown): input is Uint8Array => input instanceof Uint8Array
