export const $REMOVE = Symbol('$REMOVE')
export type $REMOVE = typeof $REMOVE

export const $remove = (): $REMOVE => $REMOVE

export const isRemoval = (input: unknown): input is $REMOVE => input === $REMOVE
