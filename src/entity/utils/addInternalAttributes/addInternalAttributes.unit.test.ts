import type { A } from 'ts-toolbelt'

import type { StringSchema } from '~/attributes/index.js'
import { string } from '~/attributes/string/index.js'
import { $get } from '~/entity/actions/update/symbols/get.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { schema } from '~/schema/index.js'
import { Table } from '~/table/index.js'

import { addInternalAttributes } from './addInternalAttributes.js'

const entityAttributeSavedAs = '__et__'

const myTable = new Table({
  name: 'myTable',
  partitionKey: {
    name: 'partitionKey',
    type: 'string'
  },
  entityAttributeSavedAs
})

const mySchema = schema({
  str: string()
})

describe('addInternalAttributes', () => {
  describe('entity attribute', () => {
    const enrichedSchema = addInternalAttributes({
      schema: mySchema,
      table: myTable,
      entityAttributeName: 'id',
      entityAttributeHidden: false,
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

  describe('timestamp attributes', () => {
    test('does not add created attribute if timestamps are disabled', () => {
      const noTimestampSchema = addInternalAttributes({
        schema: mySchema,
        table: myTable,
        entityAttributeName: 'id',
        entityAttributeHidden: true,
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

      const noCreatedTimestampSchema = addInternalAttributes({
        schema: mySchema,
        table: myTable,
        entityAttributeName: 'id',
        entityAttributeHidden: true,
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

      const noModifiedTimestampSchema = addInternalAttributes({
        schema: mySchema,
        table: myTable,
        entityAttributeName: 'id',
        entityAttributeHidden: true,
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
      const enrichedSchema = addInternalAttributes({
        schema: mySchema,
        table: myTable,
        entityAttributeName: 'entity',
        entityAttributeHidden: true,
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

      const partialCustomSchema = addInternalAttributes({
        schema: mySchema,
        table: myTable,
        entityAttributeName: 'entity',
        entityAttributeHidden: true,
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

      const customSchema = addInternalAttributes({
        schema: mySchema,
        table: myTable,
        entityAttributeName: 'entity',
        entityAttributeHidden: true,
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
      const enrichedSchema = addInternalAttributes({
        schema: mySchema,
        table: myTable,
        entityAttributeName: 'entity',
        entityAttributeHidden: true,
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

      const partialCustomSchema = addInternalAttributes({
        schema: mySchema,
        table: myTable,
        entityAttributeName: 'entity',
        entityAttributeHidden: true,
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

      const customSchema = addInternalAttributes({
        schema: mySchema,
        table: myTable,
        entityAttributeName: 'entity',
        entityAttributeHidden: true,
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
    test('throws a "reservedAttributeName" error if ', () => {
      const invalidSchema = schema({
        entity: string()
      })

      const invalidCall = () =>
        addInternalAttributes({
          schema: invalidSchema,
          table: myTable,
          entityAttributeName: 'entity',
          entityAttributeHidden: true,
          entityName: 'myEntity',
          timestamps: true
        })

      expect(invalidCall).toThrow(DynamoDBToolboxError)
      expect(invalidCall).toThrow(expect.objectContaining({ code: 'entity.reservedAttributeName' }))
    })

    test('throws a "reservedAttributeSavedAs" error if ', () => {
      const invalidSchema = schema({
        ent: string().savedAs(entityAttributeSavedAs)
      })

      const invalidCall = () =>
        addInternalAttributes({
          schema: invalidSchema,
          table: myTable,
          entityAttributeName: 'entity',
          entityAttributeHidden: true,
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
