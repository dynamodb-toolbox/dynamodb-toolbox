import type { EntityV2 } from 'v1/entity'
import type { KeyInput } from 'v1/commands'
import { GetItemCommand, GetItemOptions, GetItemResponse } from 'v1/commands/getItem'
import type { GetItemCommandClass } from 'v1/commands/getItem/command'
import { PutItemCommand, PutItemInput, PutItemOptions, PutItemResponse } from 'v1/commands/putItem'
import type { PutItemCommandClass } from 'v1/commands/putItem/command'

import type { CommandType } from './types'
import { GetItemCommandMock } from './getItemCommand'
import { PutItemCommandMock } from './putItemCommand'
import { CommandMocker } from './commandMocker'

export class MockedEntity<ENTITY extends EntityV2 = EntityV2> {
  // TODO: Use symbols for private properties
  entity: ENTITY

  _mockedImplementations: Partial<{
    get: (key: KeyInput<ENTITY>, options?: GetItemOptions<ENTITY>) => GetItemResponse<ENTITY>
    put: (item: PutItemInput<ENTITY>, options?: PutItemOptions<ENTITY>) => PutItemResponse<ENTITY>
  }>
  _receivedCommands: Record<CommandType, unknown[][]>
  reset: () => void

  constructor(entity: ENTITY) {
    this.entity = entity

    this._mockedImplementations = {}
    this._receivedCommands = { get: [], put: [] }

    this.reset = () => {
      this._mockedImplementations = {}
      this._receivedCommands = { get: [], put: [] }
    }

    entity.build = command => {
      switch (command) {
        // @ts-expect-error impossible to fix
        case GetItemCommand:
          return new GetItemCommandMock(this)
        // @ts-expect-error impossible to fix
        case PutItemCommand:
          return new PutItemCommandMock(this)
        default:
          throw new Error(`Unable to mock entity command: ${String(command)}`)
      }
    }
  }

  on = <COMMAND_CLASS extends GetItemCommandClass | PutItemCommandClass>(
    command: COMMAND_CLASS
  ): COMMAND_CLASS extends GetItemCommandClass
    ? CommandMocker<'get', KeyInput<ENTITY>, GetItemOptions<ENTITY>, GetItemResponse<ENTITY>>
    : COMMAND_CLASS extends PutItemCommandClass
    ? CommandMocker<'put', PutItemInput<ENTITY>, PutItemOptions<ENTITY>, PutItemResponse<ENTITY>>
    : never => {
    switch (command) {
      case GetItemCommand:
        return new CommandMocker<
          'get',
          KeyInput<ENTITY>,
          GetItemOptions<ENTITY>,
          GetItemResponse<ENTITY>
        >('get', this) as any
      case PutItemCommand:
        return new CommandMocker<
          'put',
          PutItemInput<ENTITY>,
          PutItemOptions<ENTITY>,
          PutItemResponse<ENTITY>
        >('put', this) as any
      default:
        throw new Error(`Unable to mock entity command: ${String(command)}`)
    }
  }
}
