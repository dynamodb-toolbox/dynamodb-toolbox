import type { ErrorBlueprint } from 'v1/errors/blueprint'

type InvalidExpressionAttributePathErrorBlueprint = ErrorBlueprint<{
  code: 'commands.invalidExpressionAttributePath'
  hasPath: false
  payload: {
    attributePath: string
  }
}>

export type CommandClassesErrorBlueprints = InvalidExpressionAttributePathErrorBlueprint
