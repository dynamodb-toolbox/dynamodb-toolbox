/** Type guard checking that `input` is a `bigint`. */
export const isBigInt = (input: unknown): input is bigint => typeof input === 'bigint'
