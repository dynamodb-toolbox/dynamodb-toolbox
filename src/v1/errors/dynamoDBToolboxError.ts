import type { IndexedErrors, ErrorCodes } from './allErrors'

type ErrorArgs<ERROR_CODE extends ErrorCodes> = (IndexedErrors[ERROR_CODE]['hasPath'] extends false
  ? { path?: string }
  : { path: string }) &
  (IndexedErrors[ERROR_CODE]['payload'] extends undefined
    ? { payload?: undefined }
    : { payload: IndexedErrors[ERROR_CODE]['payload'] }) & {
    message: string
  }

export class DynamoDBToolboxError<ERROR_CODE extends ErrorCodes = ErrorCodes> extends Error {
  static match = <PREFIX extends string>(
    error: unknown,
    prefix: PREFIX = '' as PREFIX
  ): error is DynamoDBToolboxError<Extract<ErrorCodes, `${PREFIX}${string}`>> =>
    error instanceof DynamoDBToolboxError && error.code.startsWith(prefix)

  code: ERROR_CODE
  path: IndexedErrors[ERROR_CODE]['hasPath'] extends false ? undefined : string
  payload: IndexedErrors[ERROR_CODE]['payload']

  constructor(code: ERROR_CODE, { message, path, payload }: ErrorArgs<ERROR_CODE>) {
    super(message)

    this.code = code
    this.path = path as IndexedErrors[ERROR_CODE]['hasPath'] extends false ? undefined : string
    this.payload = payload as IndexedErrors[ERROR_CODE]['payload']
  }
}
