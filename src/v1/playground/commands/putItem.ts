import { putItem } from 'v1/commands'

import { UserEntity } from '../entity'

const test = async () => {
  const { Attributes } = await putItem(UserEntity, {
    userId: 'some-user-id',
    age: 42,
    firstName: 'john',
    lastName: 'dow',
    parents: {
      father: 'dark vador',
      mother: 'galadriel'
    }
  })
}
