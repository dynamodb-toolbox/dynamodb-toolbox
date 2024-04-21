import parseEntityAttributes from './parseEntityAttributes.js'
import type { TableDef } from '../classes/Table/types.js'
import type {
  AttributeDefinitions,
  EntityConstructor,
  PureAttributeDefinition,
  Readonly
} from '../classes/Entity/types.js'
import { error } from './utils.js'

export interface TrackingInfo {
  fields: string[]
  defaults: any
  required: any
  linked: Linked
  keys: any
}

export interface Linked {
  [key: string]: string[]
}

export interface TrackingInfoKeys {
  partitionKey?: string
  sortKey?: string
}

export type ParsedEntity<
  EntityTable extends TableDef | undefined = TableDef | undefined,
  Name extends string = string,
  AutoExecute extends boolean = boolean,
  AutoParse extends boolean = boolean,
  TypeAlias extends string = string,
  TypeHidden extends boolean = boolean
> = {
  name: Name
  schema: {
    keys: any
    attributes: Record<string, PureAttributeDefinition>
  }
  _etAlias: TypeAlias
  typeHidden: TypeHidden
  autoParse: AutoParse | undefined
  autoExecute: AutoExecute | undefined
  linked: Linked
  defaults: any
  required: any
  table?: EntityTable | undefined,
  setTable?: <NextTable extends EntityTable | undefined>(table: NextTable) => ParsedEntity<NextTable, Name, AutoExecute, AutoParse, TypeAlias, TypeHidden>
}

// Parse entity
export function parseEntity<
  EntityTable extends TableDef | undefined,
  Name extends string,
  AutoExecute extends boolean,
  AutoParse extends boolean,
  Timestamps extends boolean,
  CreatedAlias extends string,
  ModifiedAlias extends string,
  TypeAlias extends string,
  TypeHidden extends boolean,
  ReadonlyAttributeDefinitions extends Readonly<AttributeDefinitions> = Readonly<AttributeDefinitions>
>(
  entity: EntityConstructor<
    EntityTable,
    Name,
    AutoExecute,
    AutoParse,
    Timestamps,
    CreatedAlias,
    ModifiedAlias,
    TypeAlias,
    TypeHidden,
    ReadonlyAttributeDefinitions
  >
): ParsedEntity<EntityTable, Name, AutoExecute, AutoParse, TypeAlias> {
  let {
    name,
    timestamps,
    created,
    createdAlias,
    modified,
    modifiedAlias,
    typeAlias,
    typeHidden,
    attributes,
    // eslint-disable-next-line prefer-const
    autoExecute,
    // eslint-disable-next-line prefer-const
    autoParse,
    // eslint-disable-next-line prefer-const
    table,
    // eslint-disable-next-line prefer-const
    ...args // extraneous config
  } = entity

  // TODO: verify string types (e.g. created)

  // Error on extraneous arguments
  if (Object.keys(args).length > 0)
    error(`Invalid Entity configuration options: ${Object.keys(args).join(', ')}`)

  // 🔨 TOIMPROVE: Not triming would be better for type safety (no need to cast)
  // Entity name
  name = (typeof name === 'string' && name.trim().length > 0
    ? name.trim()
    : error(`'name' must be defined`)) as Name

  // 🔨 TOIMPROVE: Use default option & simply throw if type is incorrect
  // Enable created/modified timestamps on items
  timestamps = (typeof timestamps === 'boolean' ? timestamps : true) as Timestamps

  // Define 'created' attribute name
  created = typeof created === 'string' && created.trim().length > 0 ? created.trim() : '_ct'

  // 🔨 TOIMPROVE: Not triming would be better for type safety (no need to cast)
  // Define 'createdAlias'
  createdAlias = (typeof createdAlias === 'string' && createdAlias.trim().length > 0
    ? createdAlias.trim()
    : 'created') as CreatedAlias

  // Define 'modified' attribute anme
  modified = typeof modified === 'string' && modified.trim().length > 0 ? modified.trim() : '_md'

  // 🔨 TOIMPROVE: Not triming would be better for type safety (no need to cast)
  // Define 'modifiedAlias'
  modifiedAlias = (typeof modifiedAlias === 'string' && modifiedAlias.trim().length > 0
    ? modifiedAlias.trim()
    : 'modified') as ModifiedAlias

  // 🔨 TOIMPROVE: Not triming would be better for type safety (no need to cast)
  // Define 'entityAlias'
  typeAlias = (typeof typeAlias === 'string' && typeAlias.trim().length > 0
    ? typeAlias.trim()
    : 'entity') as TypeAlias

  typeHidden = (typeof typeHidden === 'boolean' ? typeHidden : false) as TypeHidden

  // Sanity check the attributes
  attributes =
    attributes?.constructor === Object
      ? attributes
      : error(`Please provide a valid 'attributes' object`)

  // Add timestamps
  if (timestamps) {
    (attributes as AttributeDefinitions)[created] = {
      type: 'string',
      alias: createdAlias,
      default: () => new Date().toISOString()
    }
    ;(attributes as AttributeDefinitions)[modified] = {
      type: 'string',
      alias: modifiedAlias,
      default: () => new Date().toISOString(),
      onUpdate: true
    }
  }

  // Tracking info
  const track: TrackingInfo = {
    fields: Object.keys(attributes), // attributes and alias list,
    defaults: {}, // tracks default attributes
    required: {},
    linked: {},
    keys: {} // tracks partition/sort/index keys
  }

  const schema = parseEntityAttributes<ReadonlyAttributeDefinitions>(attributes, track) // removed nested attribute?

  // Safety check for bigint users, to avoid losing precision
  if (table && table.DocumentClient) {
    Object.keys(schema.attributes).forEach((field) => {
      const config = schema.attributes[field]
      if (config.type && config.type === 'bigint' || config.setType && config.setType === 'bigint') {
        // Verify DocumentClient has wrapNumbers set to true
        if (table?.DocumentClient?.config?.translateConfig?.unmarshallOptions?.wrapNumbers !== true) {
          error('Please set `wrapNumbers: true` in your DocumentClient to avoid losing precision with bigint fields')
        }
      }
    })
  }

  return {
    name,
    schema,
    defaults: track.defaults,
    required: track.required,
    linked: track.linked,
    autoExecute,
    autoParse,
    typeHidden,
    _etAlias: typeAlias,
    ...(table ? { table } : {})
  }
}

export default parseEntity
