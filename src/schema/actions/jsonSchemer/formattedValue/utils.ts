import type { ItemSchema, MapSchema, Never, Schema } from '~/schema/index.js'
import type { OmitKeys } from '~/types/omitKeys.js'

export type RequiredProperties<SCHEMA extends MapSchema | ItemSchema> = ItemSchema extends SCHEMA
  ? string
  : MapSchema extends SCHEMA
    ? string
    : {
        [KEY in OmitKeys<
          SCHEMA['attributes'],
          { props: { hidden: true } }
        >]: SCHEMA['attributes'][KEY]['props'] extends { required: Never } ? never : KEY
      }[OmitKeys<SCHEMA['attributes'], { props: { hidden: true } }>]

export type JSONSchemaMeta<SCHEMA extends Schema> = SCHEMA extends { props: { meta: infer META } }
  ? (META extends { title: infer TITLE } ? { title: TITLE } : unknown) &
      (META extends { description: infer DESCRIPTION } ? { description: DESCRIPTION } : unknown) &
      (META extends { examples: infer EXAMPLES } ? { examples: EXAMPLES } : unknown)
  : {}

export const getJSONSchemaMeta = <SCHEMA extends Schema>({
  props: { meta }
}: SCHEMA): JSONSchemaMeta<SCHEMA> => {
  if (meta === undefined) {
    return {} as JSONSchemaMeta<SCHEMA>
  }

  const metaJSONSchema: Record<string, unknown> = {}

  if (meta.title !== undefined) {
    metaJSONSchema.title = meta.title
  }

  if (meta.description !== undefined) {
    metaJSONSchema.description = meta.description
  }

  if (meta.examples !== undefined) {
    metaJSONSchema.examples = meta.examples
  }

  return metaJSONSchema as JSONSchemaMeta<SCHEMA>
}
