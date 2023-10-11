import type {
  MapAttributeAttributes,
  RequiredOption,
  $MapAttributeAttributes,
  $Narrow
} from './attributes'
import type { FreezeAttribute } from './attributes/freeze'

export interface Schema<ATTRIBUTES extends MapAttributeAttributes = MapAttributeAttributes> {
  type: 'schema'
  savedAttributeNames: Set<string>
  keyAttributeNames: Set<string>
  requiredAttributeNames: Record<RequiredOption, Set<string>>
  attributes: ATTRIBUTES
  and: <$ADDITIONAL_ATTRIBUTES extends $MapAttributeAttributes = $MapAttributeAttributes>(
    additionalAttributes: $Narrow<$ADDITIONAL_ATTRIBUTES>
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
