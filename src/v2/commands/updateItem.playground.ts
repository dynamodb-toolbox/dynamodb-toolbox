import { UserEntity } from 'v2/entity.playground'

import { updateItem } from './updateItem'

const test = async () => {
  const { Attributes } = await updateItem(UserEntity, {
    userId: 'some-user-id',
    age: 42,
    firstName: 'toto',
    lastName: 'tata',
    parents: {
      father: 'titi',
      mother: 'tutu'
    }
  })
}
