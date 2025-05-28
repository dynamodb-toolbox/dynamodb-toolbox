import type { Database } from '~/database/database.js'
import { DatabaseAction } from '~/database/database.js'
import { EntityDTO } from '~/entity/actions/dto/index.js'
import { TableDTO } from '~/table/actions/dto/index.js'

import { $awsAccount } from './constants.js'
import { deleteEntity } from './deleteEntity.js'
import { getTableEntityNames } from './getTableEntityNames.js'
import { assignAccessRole, putAccessRole } from './putAccessRole.js'
import { putAWSAccount } from './putAwsAccount.js'
import { putEntity } from './putEntity.js'
import { putTable } from './putTable.js'
import type {
  AWSAccount,
  AWSConfig,
  FetchOpts,
  SyncedEntityMetadata,
  SyncedTableMetadata
} from './types.js'

export class Synchronizer<DATABASE extends Database> extends DatabaseAction<DATABASE> {
  static override actionName = 'synchronize' as const

  apiUrl: string;
  [$awsAccount]?: AWSAccount

  constructor(database: DATABASE, awsConfig?: AWSConfig) {
    super(database)

    this.apiUrl = 'https://api.dynamodb-toolshack.com'
    this[$awsAccount] = awsConfig
  }

  awsAccount(awsAccount: AWSAccount): Synchronizer<DATABASE> {
    return new Synchronizer(this.database, awsAccount)
  }

  async sync({
    apiKey,
    deleteUnknownEntities = false,
    fetch: _fetch = fetch
  }: {
    apiKey: string
    deleteUnknownEntities?: boolean
    fetch?: typeof fetch
  }): Promise<void> {
    const fetchOpts: FetchOpts = { apiUrl: this.apiUrl, fetch: _fetch, apiKey }
    const awsConfig = this[$awsAccount]

    if (awsConfig === undefined) {
      throw new Error('Synchronizer incomplete: Missing "awsConfig" property')
    }
    const {
      awsAccountId,
      awsRegion,
      title: awsAccountTitle = String(awsAccountId),
      color: awsAccountColor = 'blue',
      description: awsAccountDescription
    } = awsConfig

    await putAWSAccount(
      {
        awsAccountId,
        title: awsAccountTitle,
        color: awsAccountColor,
        description: awsAccountDescription
      },
      fetchOpts
    )

    for (const table of Object.values(this.database.tables)) {
      const { tableName, ...tableDTO } = table.build(TableDTO).toJSON()
      if (tableName === undefined) {
        throw new Error('tableName should be provided')
      }

      const tableMetadata = table.meta as SyncedTableMetadata

      await putTable(
        {
          tableName,
          ...awsConfig,
          ...tableDTO,
          icon: tableMetadata.icon ?? 'database-zap',
          title: tableMetadata.title,
          description: tableMetadata.description
        },
        fetchOpts
      )

      const { accessRole } = tableMetadata
      if (accessRole !== undefined) {
        const { roleName } = accessRole

        await putAccessRole({ awsAccountId, ...accessRole }, fetchOpts)
        await assignAccessRole({ awsAccountId, awsRegion, tableName, roleName }, fetchOpts)
      }

      let unknownEntityNames: Set<string> | undefined = undefined
      if (deleteUnknownEntities) {
        const tableEntityNames = await getTableEntityNames(
          { awsAccountId, awsRegion, tableName },
          fetchOpts
        )

        unknownEntityNames = new Set(tableEntityNames)
      }

      for (const entity of Object.values(table.entities)) {
        const entityDTO = entity.build(EntityDTO).toJSON()

        const entityMetadata = entity.meta as SyncedEntityMetadata

        await putEntity(
          {
            awsAccountId,
            awsRegion,
            tableName,
            ...entityDTO,
            icon: entityMetadata.icon ?? 'database-zap',
            title: entityMetadata.title,
            description: entityMetadata.description
          },
          fetchOpts
        )

        unknownEntityNames?.delete(entity.entityName)
      }

      if (deleteUnknownEntities && unknownEntityNames !== undefined) {
        for (const entityName of unknownEntityNames) {
          await deleteEntity({ awsAccountId, awsRegion, tableName, entityName }, fetchOpts)
        }
      }
    }
  }
}
