import { UserEntity } from 'v2/entity.playground'

import { getItem } from './getItem'

const test = async () => {
  const { Item } = await getItem(UserEntity, {
    userId: 'some-user-id',
    age: 42
  })
}
