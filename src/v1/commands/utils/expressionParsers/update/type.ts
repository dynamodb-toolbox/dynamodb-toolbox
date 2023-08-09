import type { UpdateCommandInput } from '@aws-sdk/lib-dynamodb'

export type ParsedUpdate = Pick<
  UpdateCommandInput,
  'UpdateExpression' | 'ExpressionAttributeNames' | 'ExpressionAttributeValues'
>
