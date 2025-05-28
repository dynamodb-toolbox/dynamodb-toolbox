import type { EntityMetadata } from '~/entity/index.js'
import type { TableMetadata } from '~/table/index.js'

import type { AccessRole } from './putAccessRole.js'

export interface AWSConfig {
  awsAccountId: string
  awsRegion: string
}

export interface AWSAccount extends AWSConfig {
  color?: string
  title?: string
  description?: string
}

export interface SyncedTableMetadata extends TableMetadata {
  icon?: string
  accessRole?: AccessRole
}

export interface SyncedEntityMetadata extends EntityMetadata {
  icon?: string
}

export interface FetchOpts {
  apiUrl: string
  fetch: typeof fetch
  apiKey: string
}
