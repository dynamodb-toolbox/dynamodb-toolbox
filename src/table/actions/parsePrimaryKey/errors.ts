import type { ErrorBlueprint } from '~/errors/blueprint.js'

type InvalidKeyPartErrorBlueprint = ErrorBlueprint<{
  code: 'actions.parsePrimaryKey.invalidKeyPart'
  hasPath: true
  payload: {
    expected: string
    received: unknown
    keyPart: string
  }
}>

export type PrimaryKeyParserErrorBlueprints = InvalidKeyPartErrorBlueprint
