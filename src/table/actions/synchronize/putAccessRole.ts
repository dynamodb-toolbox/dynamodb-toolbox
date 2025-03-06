import type { AWSConfig, FetchOpts } from './types.js'

export interface AccessRole {
  roleName: string
  description?: string
}

export const putAccessRole = async (
  accessRole: Pick<AWSConfig, 'awsAccountId'> & AccessRole,
  { apiUrl, fetch: _fetch = fetch, apiKey }: FetchOpts
): Promise<void> => {
  const { awsAccountId, roleName } = accessRole

  // We get the access-role first so as to not reissue the access token
  const getResponse = await _fetch([apiUrl, 'access-role', awsAccountId, roleName].join('/'), {
    headers: { Authorization: apiKey },
    signal: AbortSignal.timeout(30_000)
  })

  if (!getResponse.ok) {
    if (getResponse.status !== 404) {
      const { message, Message } = (await getResponse.json()) as
        | { message: string; Message?: undefined }
        | { message?: undefined; Message: string }
      throw new Error(message ?? Message)
    }

    const putResponse = await _fetch([apiUrl, 'access-role'].join('/'), {
      method: 'POST',
      headers: { Authorization: apiKey },
      body: JSON.stringify(accessRole),
      signal: AbortSignal.timeout(30_000)
    })

    if (!putResponse.ok) {
      const { message, Message } = (await putResponse.json()) as
        | { message: string; Message?: undefined }
        | { message?: undefined; Message: string }
      throw new Error(message ?? Message)
    }
  }
}

export const assignAccessRole = async (
  {
    awsAccountId,
    awsRegion,
    tableName,
    roleName
  }: AWSConfig & { tableName: string; roleName: string },
  { apiUrl, fetch: _fetch = fetch, apiKey }: FetchOpts
): Promise<void> => {
  const response = await _fetch(
    [apiUrl, 'table', awsAccountId, awsRegion, tableName, 'access-role'].join('/'),
    {
      method: 'POST',
      headers: { Authorization: apiKey },
      body: JSON.stringify({ awsAccountId, roleName }),
      signal: AbortSignal.timeout(30_000)
    }
  )

  if (!response.ok) {
    const { message, Message } = (await response.json()) as
      | { message: string; Message?: undefined }
      | { message?: undefined; Message: string }
    throw new Error(message ?? Message)
  }
}
