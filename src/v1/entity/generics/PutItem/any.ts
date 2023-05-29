import type { AnyAttribute } from 'v1/schema'

export type AnyAttributePutItem<ANY_ATTRIBUTE extends AnyAttribute> = ANY_ATTRIBUTE extends {
  required: 'never'
}
  ? undefined | unknown
  : unknown
