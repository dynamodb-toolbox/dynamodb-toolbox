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
      entityName: 'myEntity',
      timestamps: true
    })

    test('adds entity attribute', () => {
      expect(enrichedSchema.attributes.id).toMatchObject({
        path: 'id',
        savedAs: entityAttributeSavedAs,
        type: 'string',
        enum: ['myEntity'],
        hidden: true,
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
        entityName: 'myEntity',
        timestamps: false
      })

      // @ts-expect-error
      expect(noTimestampSchema.attributes.created).toBeUndefined()
      // @ts-expect-error
      expect(noTimestampSchema.attributes.modified).toBeUndefined()

      const createdTimestampSchema = addInternalAttributes({
        schema: mySchema,
        table: myTable,
        entityAttributeName: 'id',
        entityName: 'myEntity',
        timestamps: {
          created: false,
          modified: true
        }
      })

      // @ts-expect-error
      expect(createdTimestampSchema.attributes.created).toBeUndefined()

      const modifiedTimestampSchema = addInternalAttributes({
        schema: mySchema,
        table: myTable,
        entityAttributeName: 'id',
        entityName: 'myEntity',
        timestamps: {
          created: true,
          modified: false
        }
      })

      // @ts-expect-error
      expect(modifiedTimestampSchema.attributes.modified).toBeUndefined()
    })

    test('adds created field', () => {
      const enrichedSchema = addInternalAttributes({
        schema: mySchema,
        table: myTable,
        entityAttributeName: 'entity',
        entityName: 'myEntity',
        timestamps: {
          created: true,
          modified: false
        }
      })

      expect(enrichedSchema.attributes.created).toMatchObject({
        path: 'created',
        savedAs: '_ct',
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

      const partialCustomSchema = addInternalAttributes({
        schema: mySchema,
        table: myTable,
        entityAttributeName: 'entity',
        entityName: 'myEntity',
        timestamps: {
          created: {
            savedAs: 'c'
          },
          modified: false
        }
      })

      expect(partialCustomSchema.attributes.created).toMatchObject({
        path: 'created',
        savedAs: 'c',
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
        entityName: 'myEntity',
        timestamps: {
          created: {
            name: '__created__',
            savedAs: 'c',
            hidden: true
          },
          modified: false
        }
      })

      expect(customSchema.attributes['__created__']).toMatchObject({
        path: '__created__',
        savedAs: 'c',
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

    test('adds modified field', () => {
      const enrichedSchema = addInternalAttributes({
        schema: mySchema,
        table: myTable,
        entityAttributeName: 'entity',
        entityName: 'myEntity',
        timestamps: {
          created: false,
          modified: true
        }
      })

      expect(enrichedSchema.attributes.modified).toMatchObject({
        path: 'modified',
        savedAs: '_md',
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

      const partialCustomSchema = addInternalAttributes({
        schema: mySchema,
        table: myTable,
        entityAttributeName: 'entity',
        entityName: 'myEntity',
        timestamps: {
          created: false,
          modified: {
            savedAs: 'm'
          }
        }
      })

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
        entityName: 'myEntity',
        timestamps: {
          created: false,
          modified: {
            name: '__modified__',
            savedAs: 'm',
            hidden: true
          }
        }
      })

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
