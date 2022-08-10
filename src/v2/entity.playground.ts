import { item, map, number, string } from './attributes'
import { Entity, SavedAs, Input, Output, KeyInputs, KeyOutputs } from './entity'
import { PrimaryKey } from './table'
import { MyTable } from './table.playground'

const UserEntity = new Entity({
  name: 'User',
  table: MyTable,
  item: item({
    userId: string().required().key(),
    age: number().enum(41, 42).default(42).key().savedAs('sk'),
    firstName: string().required().savedAs('fn'),
    lastName: string().required().savedAs('ln'),
    parents: map({
      father: string().required(),
      mother: string().required()
    })
  })
  // computeKey: ({ userId, userIndex }) => ({ userId, sk: userIndex })
})

type UserInput = Input<typeof UserEntity>
type SavedUser = SavedAs<typeof UserEntity>
type UserOutput = Output<typeof UserEntity>
type UserInputKeys = KeyInputs<typeof UserEntity>
type UserOutputKeys = KeyOutputs<typeof UserEntity>
type PK = PrimaryKey<typeof UserEntity['table']>
