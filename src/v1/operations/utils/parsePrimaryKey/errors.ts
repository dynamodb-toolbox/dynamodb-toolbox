import type { ErrorBlueprint } from 'v1/errors/blueprint'

type InvalidKeyPartErrorBlueprint = ErrorBlueprint<{
  code: 'commands.parsePrimaryKey.invalidKeyPart'
  hasPath: true
  payload: {
    expected: string
    received: unknown
    keyPart: string
  }
}>

export type ParsePrimaryKeyErrorBlueprints = InvalidKeyPartErrorBlueprint
