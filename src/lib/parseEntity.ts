/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

// Import libraries & types
import parseEntityAttributes from './parseEntityAttributes'
import { TableDef } from '../classes/Table'
import {
  AttributeDefinitions,
  EntityConstructor,
  PureAttributeDefinition,
  Readonly,
} from "../classes/Entity";
import { error } from './utils'

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
  TypeHidden extends boolean = boolean,
> = {
  name: Name;
  schema: {
    keys: any;
    attributes: Record<string, PureAttributeDefinition>;
  };
  _etAlias: TypeAlias;
  typeHidden: TypeHidden;
  autoParse: AutoParse | undefined;
  autoExecute: AutoExecute | undefined;
  linked: Linked;
  defaults: any;
  required: any;
  table?: EntityTable | undefined;
};

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
    autoExecute,
    autoParse,
    table,
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

  // 🔨 TOIMPROVE: Use default option & simply throw if type is incorrect
  // Enable or type should be returned on parse
  typeHidden = (typeof typeHidden === 'boolean' ? typeHidden : false) as TypeHidden

  // Sanity check the attributes
  attributes =
    attributes?.constructor === Object
      ? attributes
      : error(`Please provide a valid 'attributes' object`)

  // Add timestamps
  if (timestamps) {
    ;(attributes as AttributeDefinitions)[created] = {
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
  let track: TrackingInfo = {
    fields: Object.keys(attributes), // attributes and alias list,
    defaults: {}, // tracks default attributes
    required: {},
    linked: {},
    keys: {} // tracks partition/sort/index keys
  }

  // Return the entity
  return Object.assign(
    {
      name,
      schema: parseEntityAttributes<ReadonlyAttributeDefinitions>(attributes, track), // removed nested attribute?
      defaults: track.defaults,
      required: track.required,
      linked: track.linked,
      autoExecute,
      autoParse,
      typeHidden,
      _etAlias: typeAlias
    },
    table ? { table } : {}
  ) // end mapping object
} // end parseEntity

export default parseEntity
