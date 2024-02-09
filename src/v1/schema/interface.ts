import type { NarrowObject } from 'v1/types'

import type { SchemaAttributes, RequiredOption, $SchemaAttributeNestedStates } from './attributes'
import type { FreezeAttribute } from './attributes/types'
import type { ResolveSchema } from './resolve'

export interface Schema<ATTRIBUTES extends SchemaAttributes = SchemaAttributes> {
  type: 'schema'
  savedAttributeNames: Set<string>
  keyAttributeNames: Set<string>
  requiredAttributeNames: Record<RequiredOption, Set<string>>
  attributes: ATTRIBUTES
}

export interface MegaSchema<ATTRIBUTES extends SchemaAttributes = SchemaAttributes>
  extends Schema<ATTRIBUTES> {
  and: <$ADDITIONAL_ATTRIBUTES extends $SchemaAttributeNestedStates = $SchemaAttributeNestedStates>(
    additionalAttributes:
      | NarrowObject<$ADDITIONAL_ATTRIBUTES>
      | ((schema: Schema<ATTRIBUTES>) => NarrowObject<$ADDITIONAL_ATTRIBUTES>)
  ) => MegaSchema<
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
  parse: (input: unknown) => ResolveSchema<Schema<ATTRIBUTES>>
}
