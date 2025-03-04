import type { AWSConfig, FetchOpts } from './types.js'

export const getTableEntityNames = async (
  { awsAccountId, awsRegion, tableName }: AWSConfig & { tableName: string },
  { apiUrl, fetch: _fetch = fetch, apiKey }: FetchOpts
): Promise<string[]> => {
  const response = await _fetch(
    [apiUrl, 'table', awsAccountId, awsRegion, tableName, 'entity'].join('/'),
    { headers: { Authorization: apiKey }, signal: AbortSignal.timeout(30_000) }
  )

  if (!response.ok) {
    const { message, Message } = (await response.json()) as
      | { message: string; Message?: undefined }
      | { message?: undefined; Message: string }
    throw new Error(message ?? Message)
  }

  const { entities } = (await response.json()) as {
    entities: { entityName: string }[]
  }

  return entities.map(({ entityName }) => entityName)
}
