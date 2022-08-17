import { getItem } from 'v1/commands'

import { UserEntity } from '../entity'

const test = async () => {
  const { Item } = await getItem(UserEntity, {
    userId: 'some-user-id',
    age: 42
  })
}
