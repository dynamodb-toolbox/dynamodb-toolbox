export const Never = Symbol('Tag for optional properties')
export type Never = typeof Never

export const AtLeastOnce = Symbol('Tag for required at least once properties')
export type AtLeastOnce = typeof AtLeastOnce

export const OnlyOnce = Symbol('Tag for required only once properties')
export type OnlyOnce = typeof OnlyOnce

export const Always = Symbol('Tag for always required properties')
export type Always = typeof Always

export type RequiredOption = Never | AtLeastOnce | OnlyOnce | Always
