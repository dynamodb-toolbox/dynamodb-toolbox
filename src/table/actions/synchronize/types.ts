export interface AWSConfig {
  awsAccountId: string
  awsRegion: string
}

export interface FetchOpts {
  apiUrl: string
  fetch: typeof fetch
  apiKey: string
}
