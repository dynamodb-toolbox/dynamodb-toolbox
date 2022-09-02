import { ComputedDefault, map, number, string, item } from 'v1/item'
import { EntityV2, PutItemInput, SavedItem, FormattedItem, KeyInput, PutItem } from 'v1/entity'

import { MyTable } from './table'

export const UserEntity = new EntityV2({
  name: 'User',
  table: MyTable,
  item: item({
    userId: string().key().required('always'),
    age: number().key().required('always').enum(41, 42).default(42).savedAs('sk'),
    firstName: string().required().savedAs('fn'),
    lastName: string().required().savedAs('ln'),
    parents: map({
      father: string().required(),
      mother: string().required()
    }),
    somethingComputed: string().required().default(ComputedDefault)
  }),
  computeDefaults: item => ({ ...item, somethingComputed: 'something' })
})

type UserPutItemInput = PutItemInput<typeof UserEntity>
type SavedUser = SavedItem<typeof UserEntity>
type UserOutput = FormattedItem<typeof UserEntity>
type UserInputKeys = KeyInput<typeof UserEntity>
type UserPutItem = PutItem<typeof UserEntity['item']>
