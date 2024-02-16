import type { If, IsConstraint } from 'v1/types'
import type { Schema, Attribute, Extension, SchemaAction } from 'v1/schema'

import type { HasExtension, ParsingOptions } from './types'

import { schemaWorkflow, ValidSchemaValue } from './schema'
import { attrWorkflow, ValidAttrValue } from './attribute'

export type ValidValue<SCHEMA extends Schema | Attribute, EXTENSION extends Extension = never> = If<
  IsConstraint<SCHEMA, Schema | Attribute>,
  unknown,
  SCHEMA extends Schema
    ? ValidSchemaValue<SCHEMA, EXTENSION>
    : SCHEMA extends Attribute
    ? ValidAttrValue<SCHEMA, EXTENSION>
    : never
>

export class Parser<SCHEMA extends Schema | Attribute> implements SchemaAction<SCHEMA> {
  schema: SCHEMA

  constructor(schema: SCHEMA) {
    this.schema = schema
  }

  workflow<EXTENSION extends Extension = never>(
    inputValue: unknown,
    ...[options = {} as ParsingOptions<EXTENSION, EXTENSION>]: If<
      HasExtension<EXTENSION>,
      [options: ParsingOptions<EXTENSION, EXTENSION>],
      [options?: ParsingOptions<EXTENSION, EXTENSION>]
    >
  ): Generator<ValidValue<SCHEMA, EXTENSION>, ValidValue<SCHEMA, EXTENSION>> {
    if (this.schema.type === 'schema') {
      return schemaWorkflow<Schema, EXTENSION>(this.schema, inputValue, options) as any
    } else {
      return attrWorkflow<Attribute, EXTENSION>(this.schema, inputValue, options) as any
    }
  }

  parse<EXTENSION extends Extension = never>(
    inputValue: unknown,
    ...[options = {} as ParsingOptions<EXTENSION, EXTENSION>]: If<
      HasExtension<EXTENSION>,
      [options: ParsingOptions<EXTENSION, EXTENSION>],
      [options?: ParsingOptions<EXTENSION, EXTENSION>]
    >
  ): ValidValue<SCHEMA, EXTENSION> {
    const workflow = this.workflow(inputValue, options)

    let done = false
    let value: ValidValue<SCHEMA, EXTENSION>
    do {
      const nextState = workflow.next()
      done = Boolean(nextState.done)
      value = nextState.value
    } while (!done)

    return value
  }
}
