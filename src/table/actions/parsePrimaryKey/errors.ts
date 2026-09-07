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

/** Union of error blueprints raised by `PrimaryKeyParser`. */
export type PrimaryKeyParserErrorBlueprints = InvalidKeyPartErrorBlueprint
