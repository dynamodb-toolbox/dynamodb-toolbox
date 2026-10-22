import type { AWSConfig, FetchOpts } from './types.js'

/**
 * Delete a table's schema from the synchronization registry.
 */
export const deleteTable = async (
  { awsAccountId, awsRegion, tableName }: AWSConfig & { tableName: string },
  { apiUrl, fetch: _fetch = fetch, apiKey }: FetchOpts
): Promise<void> => {
  const response = await _fetch([apiUrl, 'table', awsAccountId, awsRegion, tableName].join('/'), {
    method: 'DELETE',
    headers: { Authorization: apiKey },
    signal: AbortSignal.timeout(30_000)
  })

  if (!response.ok && response.status !== 404) {
    const { message, Message } = (await response.json()) as
      | { message: string; Message?: undefined }
      | { message?: undefined; Message: string }
    throw new Error(message ?? Message)
  }
}
