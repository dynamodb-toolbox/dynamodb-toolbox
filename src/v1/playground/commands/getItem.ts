/* eslint-disable @typescript-eslint/no-unused-vars */
import { GetItemCommand } from 'v1/commands'
import { mockEntity } from 'v1/test-tools'

import { UserEntity } from '../entity'

const test = async () => {
  const test = await UserEntity.build(GetItemCommand).key({ userId: 'foo', age: 41 }).send()
  console.log('TEST', test)
}

const mockedEntity = mockEntity(UserEntity)
console.log(mockedEntity._receivedCommands.get)

mockedEntity.on(GetItemCommand).resolve({
  Item: {
    userId: 'foo',
    age: 42,
    constant: 'toto',
    firstName: 'Thomus',
    lastName: 'Arbeit',
    completeName: 'Thomus Arbeit',
    parents: {
      father: 'yo',
      mother: 'ya'
    }
  },
  // TODO: Omit $metadata
  $metadata: {}
})

test()
console.log(mockedEntity._receivedCommands.get)
