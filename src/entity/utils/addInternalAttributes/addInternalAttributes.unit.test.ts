import type { A } from 'ts-toolbelt'

import type { AtLeastOnce } from '~/attributes/index.js'
import { string } from '~/attributes/string/index.js'
import { $get } from '~/entity/actions/update/utils.js'
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
      const assertEntityAttribute: A.Equals<
        typeof enrichedSchema.attributes.id,
        {
          path?: string | undefined
          type: 'string'
          required: AtLeastOnce
          hidden: false
          key: false
          savedAs: '__et__'
          enum: ['myEntity']
          defaults: {
            key: undefined
            put: unknown
            update: unknown
          }
          links: {
            key: undefined
            put: undefined
            update: undefined
          }
          transform: undefined
        }
      > = 1
      assertEntityAttribute

      expect(enrichedSchema.attributes.id).toMatchObject({
        path: 'id',
        type: 'string',
        required: 'atLeastOnce',
        hidden: false,
        key: false,
        savedAs: entityAttributeSavedAs,
        enum: ['myEntity'],
        defaults: {
          key: undefined,
          put: 'myEntity'
        },
        links: {
          key: undefined,
          put: undefined,
          update: undefined
        },
        transform: undefined
      })

      expect(
        // @ts-expect-error defaults are not tested for the moment
        enrichedSchema.attributes.id.defaults.update()
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

      const assertCreatedAttribute: A.Equals<
        typeof enrichedSchema.attributes.created,
        {
          path?: string | undefined
          type: 'string'
          required: AtLeastOnce
          hidden: false
          key: false
          savedAs: '_ct'
          enum: undefined
          defaults: {
            key: undefined
            put: unknown
            update: unknown
          }
          links: {
            key: undefined
            put: undefined
            update: undefined
          }
          transform: undefined
        }
      > = 1
      assertCreatedAttribute

      expect(enrichedSchema.attributes.created).toMatchObject({
        path: 'created',
        type: 'string',
        required: 'atLeastOnce',
        hidden: false,
        key: false,
        savedAs: '_ct',
        enum: undefined,
        defaults: {
          key: undefined,
          put: expect.any(Function),
          update: expect.any(Function)
        },
        links: {
          key: undefined,
          put: undefined,
          update: undefined
        },
        transform: undefined
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

      const assertPartialCustomCreatedAttribute: A.Equals<
        typeof partialCustomSchema.attributes.created,
        {
          path?: string | undefined
          type: 'string'
          required: AtLeastOnce
          hidden: false
          key: false
          savedAs: 'c'
          enum: undefined
          defaults: {
            key: undefined
            put: unknown
            update: unknown
          }
          links: {
            key: undefined
            put: undefined
            update: undefined
          }
          transform: undefined
        }
      > = 1
      assertPartialCustomCreatedAttribute

      expect(partialCustomSchema.attributes.created).toMatchObject({
        path: 'created',
        type: 'string',
        required: 'atLeastOnce',
        hidden: false,
        key: false,
        savedAs: 'c',
        enum: undefined,
        defaults: {
          key: undefined,
          put: expect.any(Function),
          update: expect.any(Function)
        },
        links: {
          key: undefined,
          put: undefined,
          update: undefined
        },
        transform: undefined
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

      const assertCustomCreatedAttribute: A.Equals<
        (typeof customSchema.attributes)['__created__'],
        {
          path?: string | undefined
          type: 'string'
          required: AtLeastOnce
          hidden: true
          key: false
          savedAs: 'c'
          enum: undefined
          defaults: {
            key: undefined
            put: unknown
            update: unknown
          }
          links: {
            key: undefined
            put: undefined
            update: undefined
          }
          transform: undefined
        }
      > = 1
      assertCustomCreatedAttribute

      expect(customSchema.attributes['__created__']).toMatchObject({
        path: '__created__',
        type: 'string',
        required: 'atLeastOnce',
        hidden: true,
        key: false,
        savedAs: 'c',
        enum: undefined,
        defaults: {
          key: undefined,
          put: expect.any(Function),
          update: expect.any(Function)
        },
        links: {
          key: undefined,
          put: undefined,
          update: undefined
        },
        transform: undefined
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

      const assertModifiedAttribute: A.Equals<
        typeof enrichedSchema.attributes.modified,
        {
          path?: string | undefined
          type: 'string'
          required: AtLeastOnce
          hidden: false
          key: false
          savedAs: '_md'
          enum: undefined
          defaults: {
            key: undefined
            put: unknown
            update: unknown
          }
          links: {
            key: undefined
            put: undefined
            update: undefined
          }
          transform: undefined
        }
      > = 1
      assertModifiedAttribute

      expect(enrichedSchema.attributes.modified).toMatchObject({
        path: 'modified',
        type: 'string',
        required: 'atLeastOnce',
        hidden: false,
        key: false,
        savedAs: '_md',
        enum: undefined,
        defaults: {
          key: undefined,
          put: expect.any(Function),
          update: expect.any(Function)
        },
        links: {
          key: undefined,
          put: undefined,
          update: undefined
        },
        transform: undefined
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

      const assertPartialCustomModifiedAttribute: A.Equals<
        typeof partialCustomSchema.attributes.modified,
        {
          path?: string | undefined
          type: 'string'
          required: AtLeastOnce
          hidden: false
          key: false
          savedAs: 'm'
          enum: undefined
          defaults: {
            key: undefined
            put: unknown
            update: unknown
          }
          links: {
            key: undefined
            put: undefined
            update: undefined
          }
          transform: undefined
        }
      > = 1
      assertPartialCustomModifiedAttribute

      expect(partialCustomSchema.attributes.modified).toMatchObject({
        path: 'modified',
        savedAs: 'm',
        type: 'string',
        enum: undefined,
        hidden: false,
        defaults: {
          key: undefined,
          put: expect.any(Function),
          update: expect.any(Function)
        },
        links: {
          key: undefined,
          put: undefined,
          update: undefined
        },
        transform: undefined
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

      const assertCustomModifiedAttribute: A.Equals<
        (typeof customSchema.attributes)['__modified__'],
        {
          path?: string | undefined
          type: 'string'
          required: AtLeastOnce
          hidden: true
          key: false
          savedAs: 'm'
          enum: undefined
          defaults: {
            key: undefined
            put: unknown
            update: unknown
          }
          links: {
            key: undefined
            put: undefined
            update: undefined
          }
          transform: undefined
        }
      > = 1
      assertCustomModifiedAttribute

      expect(customSchema.attributes['__modified__']).toMatchObject({
        path: '__modified__',
        savedAs: 'm',
        type: 'string',
        enum: undefined,
        hidden: true,
        defaults: {
          key: undefined,
          put: expect.any(Function),
          update: expect.any(Function)
        },
        links: {
          key: undefined,
          put: undefined,
          update: undefined
        },
        transform: undefined
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
