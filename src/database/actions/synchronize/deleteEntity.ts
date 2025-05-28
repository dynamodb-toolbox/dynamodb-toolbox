import type { AWSConfig, FetchOpts } from './types.js'

export const deleteEntity = async (
  {
    awsAccountId,
    awsRegion,
    tableName,
    entityName
  }: AWSConfig & { tableName: string; entityName: string },
  { apiUrl, fetch: _fetch = fetch, apiKey }: FetchOpts
): Promise<void> => {
  const response = await _fetch(
    [apiUrl, 'table', awsAccountId, awsRegion, tableName, 'entity', entityName].join('/'),
    {
      method: 'DELETE',
      headers: { Authorization: apiKey },
      signal: AbortSignal.timeout(30_000)
    }
  )

  if (!response.ok && response.status !== 404) {
    const { message, Message } = (await response.json()) as
      | { message: string; Message?: undefined }
      | { message?: undefined; Message: string }
    throw new Error(message ?? Message)
  }
}
