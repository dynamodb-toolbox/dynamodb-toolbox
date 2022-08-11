import { UserEntity } from 'v2/entity.playground'

import { putItem } from './putItem'

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
