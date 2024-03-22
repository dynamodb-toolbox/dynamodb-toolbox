import { GetItemCommand } from 'v1/operations/getItem'
import { mockEntity } from 'v1/test-tools'

import { UserEntity } from '../entity'

const mockedEntity = mockEntity(UserEntity)

mockedEntity.on(GetItemCommand).resolve({
  Item: {
    created: '2020-01-01T00:00:00.000Z',
    modified: '2021-01-01T00:00:00.000Z',
    userId: 'foo',
    age: 42,
    constant: 'toto',
    firstName: 'Thomus',
    lastName: 'Arbeit',
    completeName: 'Thomus Arbeit',
    parents: {
      father: 'yo',
      mother: 'ya'
    },
    castedStr: 'bar'
  }
})

const test = async () => {
  const test = await UserEntity.build(GetItemCommand).key({ userId: 'foo', age: 41 }).send()
  console.log('TEST', test)
}

const run = async () => {
  console.log(mockedEntity.received(GetItemCommand).count())
  console.log(mockedEntity.received(GetItemCommand).allArgs())
  console.log(mockedEntity.received(GetItemCommand).args(0) ?? '-')
  await test()
  console.log(mockedEntity.received(GetItemCommand).count())
  console.log(mockedEntity.received(GetItemCommand).allArgs())
  console.log(mockedEntity.received(GetItemCommand).args(0) ?? '-')
  mockedEntity.reset()
  console.log(mockedEntity.received(GetItemCommand).count())
  console.log(mockedEntity.received(GetItemCommand).allArgs())
  console.log(mockedEntity.received(GetItemCommand).args(0) ?? '-')
}

void run()
