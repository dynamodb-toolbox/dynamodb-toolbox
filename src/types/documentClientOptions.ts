import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

/** Options accepted by a `DynamoDBDocumentClient` `send` call. */
export type DocumentClientOptions = Parameters<DynamoDBDocumentClient['send']>[1]
