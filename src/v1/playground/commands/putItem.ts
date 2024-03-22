/* eslint-disable @typescript-eslint/no-unused-vars */
import { PutItemCommand } from 'v1/operations/putItem'

import { UserEntity } from '../entity'

const test = async () => {
  const commandB = UserEntity.build(PutItemCommand)
    .item({
      userId: 'some-user-id',
      age: 42,
      firstName: 'john',
      lastName: 'dow',
      parents: {
        father: 'dark vador',
        mother: 'toto'
      },
      someSet: new Set(['foo', 'bar']),
      castedStr: 'foo'
    })
    .options({ returnValues: 'ALL_OLD' })
    .send()
}
