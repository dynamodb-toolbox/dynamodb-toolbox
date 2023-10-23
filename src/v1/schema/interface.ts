import type { NarrowObject } from 'v1/types'

import type { SchemaAttributes, RequiredOption, $SchemaAttributeStates } from './attributes'
import type { FreezeAttribute } from './attributes/freeze'

export interface Schema<ATTRIBUTES extends SchemaAttributes = SchemaAttributes> {
  type: 'schema'
  savedAttributeNames: Set<string>
  keyAttributeNames: Set<string>
  requiredAttributeNames: Record<RequiredOption, Set<string>>
  attributes: ATTRIBUTES
  and: <$ADDITIONAL_ATTRIBUTES extends $SchemaAttributeStates = $SchemaAttributeStates>(
    additionalAttributes:
      | NarrowObject<$ADDITIONAL_ATTRIBUTES>
      | ((schema: Schema<ATTRIBUTES>) => NarrowObject<$ADDITIONAL_ATTRIBUTES>)
  ) => Schema<
    {
      [KEY in
        | keyof ATTRIBUTES
        | keyof $ADDITIONAL_ATTRIBUTES]: KEY extends keyof $ADDITIONAL_ATTRIBUTES
        ? FreezeAttribute<$ADDITIONAL_ATTRIBUTES[KEY]>
        : KEY extends keyof ATTRIBUTES
        ? ATTRIBUTES[KEY]
        : never
    }
  >
}
