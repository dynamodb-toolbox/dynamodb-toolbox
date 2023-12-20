import type { EntityV2 } from 'v1/entity'
import type {
  Schema,
  AnyAttribute,
  ListAttribute,
  MapAttribute,
  RecordAttribute,
  AnyOfAttribute,
  Attribute,
  ResolvePrimitiveAttribute
} from 'v1/schema'

type AttributePath<ATTRIBUTE_PATH extends string, ATTRIBUTE extends Attribute> =
  | ATTRIBUTE_PATH
  | (ATTRIBUTE extends AnyAttribute ? `${ATTRIBUTE_PATH}${string}` : never)
  // TO VERIFY: Can you apply clauses to Set attributes like Contains ?
  | (ATTRIBUTE extends ListAttribute
      ? AttributePath<`${ATTRIBUTE_PATH}[${number}]`, ATTRIBUTE['elements']>
      : never)
  | (ATTRIBUTE extends MapAttribute
      ? {
          [KEY in keyof ATTRIBUTE['attributes']]: AttributePath<
            `${ATTRIBUTE_PATH}.${Extract<KEY, string>}`,
            ATTRIBUTE['attributes'][KEY]
          >
        }[keyof ATTRIBUTE['attributes']]
      : never)
  | (ATTRIBUTE extends RecordAttribute
      ? AttributePath<
          `${ATTRIBUTE_PATH}.${ResolvePrimitiveAttribute<ATTRIBUTE['keys']>}`,
          ATTRIBUTE['elements']
        >
      : never)
  | (ATTRIBUTE extends AnyOfAttribute
      ? ATTRIBUTE['elements'][number] extends infer ELEMENT
        ? ELEMENT extends Attribute
          ? AttributePath<ATTRIBUTE_PATH, ELEMENT>
          : never
        : never
      : never)

export type SchemaAttributePath<SCHEMA extends Schema = Schema> = Schema extends SCHEMA
  ? string
  : keyof SCHEMA['attributes'] extends infer ATTRIBUTE_PATH
    ? ATTRIBUTE_PATH extends string
      ? AttributePath<ATTRIBUTE_PATH, SCHEMA['attributes'][ATTRIBUTE_PATH]>
      : never
    : never

export type AnyAttributePath<ENTITY extends EntityV2 = EntityV2> = SchemaAttributePath<
  ENTITY['schema']
>

export type AnyCommonAttributePath<
  ENTITIES extends EntityV2[] = EntityV2[],
  RESULTS extends string = string
> = ENTITIES extends [infer ENTITIES_HEAD, ...infer ENTITIES_TAIL]
  ? ENTITIES_HEAD extends EntityV2
    ? ENTITIES_TAIL extends EntityV2[]
      ? AnyCommonAttributePath<ENTITIES_TAIL, RESULTS & AnyAttributePath<ENTITIES_HEAD>>
      : never
    : never
  : RESULTS
