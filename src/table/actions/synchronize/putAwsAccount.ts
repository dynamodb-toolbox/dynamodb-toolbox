import type { AWSConfig, FetchOpts } from './types.js'

interface AWSAccount extends Pick<AWSConfig, 'awsAccountId'> {
  awsAccountId: string
  title: string
  color: string
  description?: string
}

export const putAWSAccount = async (
  awsAccount: AWSAccount,
  { apiUrl, fetch: _fetch = fetch, apiKey }: FetchOpts
): Promise<void> => {
  const response = await _fetch([apiUrl, 'aws-account'].join('/'), {
    method: 'PUT',
    headers: { Authorization: apiKey },
    body: JSON.stringify(awsAccount),
    signal: AbortSignal.timeout(30_000)
  })

  if (!response.ok) {
    const { message, Message } = (await response.json()) as
      | { message: string; Message?: undefined }
      | { message?: undefined; Message: string }
    throw new Error(message ?? Message)
  }
}
