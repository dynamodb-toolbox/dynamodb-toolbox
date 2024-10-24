import type { ITableDTO } from '~/table/actions/dto/index.js'
import { Table } from '~/table/index.js'

export const fromTableDTO = (tableDTO: ITableDTO): Table => new Table(tableDTO)
