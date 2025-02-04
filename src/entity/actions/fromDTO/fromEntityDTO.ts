import type { IEntityDTO } from '~/entity/actions/dto/index.js'
import { Entity } from '~/entity/index.js'
import type { TimestampsDefaultOptions } from '~/entity/index.js'
import { fromSchemaDTO } from '~/schema/actions/fromDTO/index.js'
import { fromTableDTO } from '~/table/actions/fromDTO/index.js'

export const fromEntityDTO = ({
  entityName,
  schema,
  table,
  timestamps,
  ...entity
}: IEntityDTO): Entity =>
  new Entity({
    name: entityName,
    schema: fromSchemaDTO(schema),
    table: fromTableDTO(table),
    timestamps: timestamps as TimestampsDefaultOptions,
    ...entity,
    // @ts-expect-error
    computeKey: undefined
  })
