import type { EntityMetadata } from '~/entity/index.js'
import type { TableMetadata } from '~/table/index.js'

import type { AccessRole } from './putAccessRole.js'

/**
 * AWS account and region identifying where a table lives.
 */
export interface AWSConfig {
  awsAccountId: string
  awsRegion: string
}

/**
 * AWS account details displayed in the synchronization registry.
 */
export interface AWSAccount extends AWSConfig {
  color?: string
  title?: string
  description?: string
}

/**
 * Table metadata extended with synchronization-specific fields.
 */
export interface SyncedTableMetadata extends TableMetadata {
  _ddbToolshack?: {
    icon?: string
    accessRole?: AccessRole
  }
}

/**
 * Entity metadata extended with synchronization-specific fields.
 */
export interface SyncedEntityMetadata extends EntityMetadata {
  _ddbToolshack?: {
    icon?: string
  }
}

/**
 * Options for the HTTP calls made during synchronization.
 */
export interface FetchOpts {
  apiUrl: string
  fetch: typeof fetch
  apiKey: string
}
