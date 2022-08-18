import { Always, ComputedDefault, map, number, string, item, PostComputeDefaults } from 'v1/item'
import { EntityV2, SavedAs, Input, Output, KeyInput } from 'v1/entity'

import { MyTable } from './table'

export const UserEntity = new EntityV2({
  name: 'User',
  table: MyTable,
  item: item({
    userId: string().key().required(Always),
    age: number().key().required(Always).enum(41, 42).default(42).savedAs('sk'),
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

type UserInput = Input<typeof UserEntity>
type SavedUser = SavedAs<typeof UserEntity>
type UserOutput = Output<typeof UserEntity>
type UserInputKeys = KeyInput<typeof UserEntity>
type UserPostComputeDefault = PostComputeDefaults<typeof UserEntity['item']>
