import { updateItem } from 'v1/commands'

import { UserEntity } from '../entity'

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
