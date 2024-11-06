import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

export type DocumentClientOptions = Parameters<DynamoDBDocumentClient['send']>[1]
