import type { ITableDTO } from '~/table/actions/dto/index.js'
import { Table } from '~/table/index.js'

export const fromTableDTO = ({ tableName, ...tableDTO }: ITableDTO): Table =>
  new Table({ name: tableName, ...tableDTO })
