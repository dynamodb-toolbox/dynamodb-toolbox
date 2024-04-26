import { $get } from 'v1/entity/actions/commands/updateItem'
import { schema } from 'v1/schema'
import { string } from 'v1/schema/attributes'
import { TableV2 } from 'v1/table'

import { addInternalAttributes } from './addInternalAttributes'

const entityAttributeSavedAs = '__et__'

const myTable = new TableV2({
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

    it('adds entity attribute', () => {
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

    it('does not mute original schema', () => {
      // @ts-expect-error
      expect(mySchema.attributes.id).toBeUndefined()
    })
  })

  describe('timestamp attributes', () => {
    it('does not add created attribute if timestamps are disabled', () => {
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

    it('adds created field', () => {
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

    it('adds modified field', () => {
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

    it('does not mute original schema', () => {
      // @ts-expect-error
      expect(mySchema.attributes.created).toBeUndefined()
      // @ts-expect-error
      expect(mySchema.attributes.modified).toBeUndefined()
    })
  })
})
