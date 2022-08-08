import { item, map, number, string } from './attributes'
import { Entity, SavedAs, Input, Output, KeyInputs } from './entity'
import { MyTable } from './table.playground'

const UserEntity = new Entity({
  name: 'User',
  table: MyTable,
  item: item({
    userId: string().required().key(),
    age: number().required().enum(41, 42).default(42).key(),
    firstName: string().required().savedAs('fn'),
    lastName: string().required().savedAs('ln'),
    parents: map({
      father: string().required(),
      mother: string().required()
    })
  }),
  partitionKey: 'userId',
  sortKey: 'age'
})

type UserInput = Input<typeof UserEntity>
type SavedUser = SavedAs<typeof UserEntity>
type UserOutput = Output<typeof UserEntity>
type UserInputKeys = KeyInputs<typeof UserEntity>
