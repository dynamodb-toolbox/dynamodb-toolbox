import type { AWSConfig, FetchOpts } from './types.js'

/**
 * Fetch the names of the tables registered for an AWS account and region.
 */
export const getTableNames = async (
  { awsAccountId, awsRegion }: AWSConfig,
  { apiUrl, fetch: _fetch = fetch, apiKey }: FetchOpts
): Promise<string[]> => {
  const response = await _fetch([apiUrl, 'aws-account'].join('/'), {
    headers: { Authorization: apiKey },
    signal: AbortSignal.timeout(30_000)
  })

  if (!response.ok) {
    const { message, Message } = (await response.json()) as
      | { message: string; Message?: undefined }
      | { message?: undefined; Message: string }
    throw new Error(message ?? Message)
  }

  const { awsAccounts } = (await response.json()) as {
    awsAccounts: {
      awsAccountId: string
      tables: { awsRegion: string; tableName: string }[]
    }[]
  }

  const awsAccount = awsAccounts.find(awsAccount => awsAccount.awsAccountId === awsAccountId)

  return (
    awsAccount?.tables
      .filter(table => table.awsRegion === awsRegion)
      .map(({ tableName }) => tableName) ?? []
  )
}
