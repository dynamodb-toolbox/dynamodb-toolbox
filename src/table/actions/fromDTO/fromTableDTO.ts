import type { ITableDTO } from '~/table/actions/dto/index.js'
import { Table } from '~/table/index.js'

/** Rebuild a `Table` instance from an `ITableDTO`. */
export const fromTableDTO = ({ tableName, ...tableDTO }: ITableDTO): Table =>
  new Table({ name: tableName, ...tableDTO })
