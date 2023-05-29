/* eslint-disable @typescript-eslint/no-unused-vars */
import { GetItemCommand } from 'v1/commands'

import { UserEntity } from '../entity'

const test = async () => {
  const test = await UserEntity.build(GetItemCommand).key({ userId: 'foo', age: 41 }).send()
}
