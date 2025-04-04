import type { A } from 'ts-toolbelt'

import { $get } from '~/entity/actions/update/symbols/get.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { StringSchema } from '~/schema/index.js'
import { item } from '~/schema/item/index.js'
import { string } from '~/schema/string/index.js'
import { Table } from '~/table/index.js'

import { buildEntitySchema } from './buildEntitySchema.js'

const entityAttributeSavedAs = '__et__'

const myTable = new Table({
  name: 'myTable',
  partitionKey: {
    name: 'partitionKey',
    type: 'string'
  },
  entityAttributeSavedAs
})

const mySchema = item({ str: string() })

describe('buildEntitySchema', () => {
  describe('adds default entity attribute', () => {
    const enrichedSchema = buildEntitySchema({
      schema: mySchema,
      table: myTable,
      entityAttribute: true,
      entityName: 'myEntity',
      timestamps: true
    })

    test('adds entity attribute', () => {
      const assertEntityAttribute: A.Contains<
        typeof enrichedSchema.attributes.entity,
        StringSchema<{
          savedAs: '__et__'
          enum: ['myEntity']
          putDefault: unknown
          updateDefault: unknown
        }>
      > = 1
      assertEntityAttribute

      expect(enrichedSchema.attributes.entity).toBeInstanceOf(StringSchema)
      expect(enrichedSchema.attributes.entity).toMatchObject({
        type: 'string',
        props: {
          savedAs: entityAttributeSavedAs,
          enum: ['myEntity'],
          putDefault: 'myEntity'
        }
      })

      expect(
        // @ts-expect-error defaults are not typed for the moment
        enrichedSchema.attributes.entity.props.updateDefault()
      ).toStrictEqual($get('entity', 'myEntity'))
    })

    test('does not mute original schema', () => {
      // @ts-expect-error
      expect(mySchema.attributes.id).toBeUndefined()
    })
  })

  describe('adds customized entity attribute', () => {
    const enrichedSchema = buildEntitySchema({
      schema: mySchema,
      table: myTable,
      entityAttribute: { name: 'id' as const, hidden: false },
      entityName: 'myEntity',
      timestamps: true
    })

    test('adds entity attribute', () => {
      const assertEntityAttribute: A.Contains<
        typeof enrichedSchema.attributes.id,
        StringSchema<{
          hidden: false
          savedAs: '__et__'
          enum: ['myEntity']
          putDefault: unknown
          updateDefault: unknown
        }>
      > = 1
      assertEntityAttribute

      expect(enrichedSchema.attributes.id).toBeInstanceOf(StringSchema)
      expect(enrichedSchema.attributes.id).toMatchObject({
        type: 'string',
        props: {
          hidden: false,
          savedAs: entityAttributeSavedAs,
          enum: ['myEntity'],
          putDefault: 'myEntity'
        }
      })

      expect(
        // @ts-expect-error defaults are not typed for the moment
        enrichedSchema.attributes.id.props.updateDefault()
      ).toStrictEqual($get('id', 'myEntity'))
    })

    test('does not mute original schema', () => {
      // @ts-expect-error
      expect(mySchema.attributes.id).toBeUndefined()
    })
  })

  test('does not add entity attribute', () => {
    const enrichedSchema = buildEntitySchema({
      schema: mySchema,
      table: myTable,
      entityAttribute: false,
      entityName: 'myEntity',
      timestamps: true
    })

    const assertEntityAttribute: A.Contains<typeof enrichedSchema.attributes, { entity: unknown }> =
      0
    assertEntityAttribute

    expect(enrichedSchema.attributes).not.toHaveProperty('entity')
  })

  describe('timestamp attributes', () => {
    test('adds default timestamps', () => {
      const enrichedSchema = buildEntitySchema({
        schema: mySchema,
        table: myTable,
        entityAttribute: true,
        entityName: 'myEntity',
        timestamps: true
      })

      const assertCreatedAttribute: A.Contains<
        typeof enrichedSchema.attributes.created,
        StringSchema<{
          hidden: false
          savedAs: '_ct'
          putDefault: unknown
          updateDefault: unknown
        }>
      > = 1
      assertCreatedAttribute

      expect(enrichedSchema.attributes.created).toBeInstanceOf(StringSchema)
      expect(enrichedSchema.attributes.created).toMatchObject({
        type: 'string',
        props: {
          savedAs: '_ct',
          putDefault: expect.any(Function),
          updateDefault: expect.any(Function)
        }
      })

      const assertModifiedAttribute: A.Contains<
        typeof enrichedSchema.attributes.modified,
        StringSchema<{
          hidden: false
          savedAs: '_md'
          putDefault: unknown
          updateDefault: unknown
        }>
      > = 1
      assertModifiedAttribute

      expect(enrichedSchema.attributes.modified).toBeInstanceOf(StringSchema)
      expect(enrichedSchema.attributes.modified).toMatchObject({
        type: 'string',
        props: {
          savedAs: '_md',
          putDefault: expect.any(Function),
          updateDefault: expect.any(Function)
        }
      })
    })

    test('does not add created attribute if timestamps are disabled', () => {
      const noTimestampSchema = buildEntitySchema({
        schema: mySchema,
        table: myTable,
        entityAttribute: true,
        entityName: 'myEntity',
        timestamps: false
      })

      // @ts-expect-error
      expect(noTimestampSchema.attributes.created).toBeUndefined()
      const assertNoCreated: A.Extends<typeof noTimestampSchema.attributes, { created: any }> = 0
      assertNoCreated
      // @ts-expect-error
      expect(noTimestampSchema.attributes.modified).toBeUndefined()
      const assertNoModified: A.Extends<typeof noTimestampSchema.attributes, { modified: any }> = 0
      assertNoModified

      const noCreatedTimestampSchema = buildEntitySchema({
        schema: mySchema,
        table: myTable,
        entityAttribute: true,
        entityName: 'myEntity',
        timestamps: {
          created: false,
          modified: true
        }
      })

      // @ts-expect-error
      expect(noCreatedTimestampSchema.attributes.created).toBeUndefined()
      const assertNoCreated2: A.Extends<
        typeof noCreatedTimestampSchema.attributes,
        { created: any }
      > = 0
      assertNoCreated2

      const noModifiedTimestampSchema = buildEntitySchema({
        schema: mySchema,
        table: myTable,
        entityAttribute: true,
        entityName: 'myEntity',
        timestamps: {
          created: true,
          modified: false
        }
      })

      // @ts-expect-error
      expect(noModifiedTimestampSchema.attributes.modified).toBeUndefined()
      const assertNoModified2: A.Extends<
        typeof noModifiedTimestampSchema.attributes,
        { modified: any }
      > = 0
      assertNoModified2
    })

    test('adds created field', () => {
      const enrichedSchema = buildEntitySchema({
        schema: mySchema,
        table: myTable,
        entityAttribute: true,
        entityName: 'myEntity',
        timestamps: {
          created: true,
          modified: false
        }
      })

      const assertCreatedAttribute: A.Contains<
        typeof enrichedSchema.attributes.created,
        StringSchema<{
          hidden: false
          savedAs: '_ct'
          putDefault: unknown
          updateDefault: unknown
        }>
      > = 1
      assertCreatedAttribute

      expect(enrichedSchema.attributes.created).toMatchObject({
        type: 'string',
        props: {
          savedAs: '_ct',
          putDefault: expect.any(Function),
          updateDefault: expect.any(Function)
        }
      })

      const partialCustomSchema = buildEntitySchema({
        schema: mySchema,
        table: myTable,
        entityAttribute: true,
        entityName: 'myEntity',
        timestamps: {
          created: {
            savedAs: 'c' as const
          },
          modified: false
        }
      })

      const assertPartialCustomCreatedAttribute: A.Contains<
        typeof partialCustomSchema.attributes.created,
        StringSchema<{
          hidden: false
          savedAs: 'c'
          putDefault: unknown
          updateDefault: unknown
        }>
      > = 1
      assertPartialCustomCreatedAttribute

      expect(partialCustomSchema.attributes.created).toMatchObject({
        type: 'string',
        props: {
          savedAs: 'c',
          putDefault: expect.any(Function),
          updateDefault: expect.any(Function)
        }
      })

      const customSchema = buildEntitySchema({
        schema: mySchema,
        table: myTable,
        entityAttribute: true,
        entityName: 'myEntity',
        timestamps: {
          created: {
            name: '__created__' as const,
            savedAs: 'c' as const,
            hidden: true
          },
          modified: false
        }
      })

      const assertCustomCreatedAttribute: A.Contains<
        (typeof customSchema.attributes)['__created__'],
        StringSchema<{
          hidden: true
          savedAs: 'c'
          putDefault: unknown
          updateDefault: unknown
        }>
      > = 1
      assertCustomCreatedAttribute

      expect(customSchema.attributes['__created__']).toMatchObject({
        type: 'string',
        props: {
          hidden: true,
          savedAs: 'c',
          putDefault: expect.any(Function),
          updateDefault: expect.any(Function)
        }
      })
    })

    test('adds modified field', () => {
      const enrichedSchema = buildEntitySchema({
        schema: mySchema,
        table: myTable,
        entityAttribute: true,
        entityName: 'myEntity',
        timestamps: {
          created: false,
          modified: true
        }
      })

      const assertModifiedAttribute: A.Contains<
        typeof enrichedSchema.attributes.modified,
        StringSchema<{
          hidden: false
          savedAs: '_md'
          putDefault: unknown
          updateDefault: unknown
        }>
      > = 1
      assertModifiedAttribute

      expect(enrichedSchema.attributes.modified).toMatchObject({
        type: 'string',
        props: {
          savedAs: '_md',
          putDefault: expect.any(Function),
          updateDefault: expect.any(Function)
        }
      })

      const partialCustomSchema = buildEntitySchema({
        schema: mySchema,
        table: myTable,
        entityAttribute: true,
        entityName: 'myEntity',
        timestamps: {
          created: false,
          modified: {
            savedAs: 'm' as const
          }
        }
      })

      const assertPartialCustomModifiedAttribute: A.Contains<
        typeof partialCustomSchema.attributes.modified,
        StringSchema<{
          hidden: false
          savedAs: 'm'
          putDefault: unknown
          updateDefault: unknown
        }>
      > = 1
      assertPartialCustomModifiedAttribute

      expect(partialCustomSchema.attributes.modified).toMatchObject({
        type: 'string',
        props: {
          savedAs: 'm',
          putDefault: expect.any(Function),
          updateDefault: expect.any(Function)
        }
      })

      const customSchema = buildEntitySchema({
        schema: mySchema,
        table: myTable,
        entityAttribute: true,
        entityName: 'myEntity',
        timestamps: {
          created: false,
          modified: {
            name: '__modified__' as const,
            savedAs: 'm' as const,
            hidden: true
          }
        }
      })

      const assertCustomModifiedAttribute: A.Contains<
        (typeof customSchema.attributes)['__modified__'],
        StringSchema<{
          hidden: true
          savedAs: 'm'
          putDefault: unknown
          updateDefault: unknown
        }>
      > = 1
      assertCustomModifiedAttribute

      expect(customSchema.attributes['__modified__']).toMatchObject({
        type: 'string',
        props: {
          savedAs: 'm',
          hidden: true,
          putDefault: expect.any(Function),
          updateDefault: expect.any(Function)
        }
      })
    })

    test('does not mute original schema', () => {
      // @ts-expect-error
      expect(mySchema.attributes.created).toBeUndefined()
      // @ts-expect-error
      expect(mySchema.attributes.modified).toBeUndefined()
    })
  })

  describe('reserved attribute names', () => {
    test('throws a "reservedAttributeName" error if entity attribute is enabled', () => {
      const invalidSchema = item({
        entity: string()
      })

      const invalidCall = () =>
        buildEntitySchema({
          schema: invalidSchema,
          table: myTable,
          entityAttribute: true,
          entityName: 'myEntity',
          timestamps: true
        })

      expect(invalidCall).toThrow(DynamoDBToolboxError)
      expect(invalidCall).toThrow(expect.objectContaining({ code: 'entity.reservedAttributeName' }))
    })

    test('throws a "reservedAttributeSavedAs" error if if entity attribute is enabled and savedAs existing prop', () => {
      const invalidSchema = item({
        ent: string().savedAs(entityAttributeSavedAs)
      })

      const invalidCall = () =>
        buildEntitySchema({
          schema: invalidSchema,
          table: myTable,
          entityAttribute: true,
          entityName: 'myEntity',
          timestamps: true
        })

      expect(invalidCall).toThrow(DynamoDBToolboxError)
      expect(invalidCall).toThrow(
        expect.objectContaining({ code: 'entity.reservedAttributeSavedAs' })
      )
    })
  })
})
