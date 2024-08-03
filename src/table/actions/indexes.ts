import type { Table } from '../table.js'

/**
 * Returns the indexes of a table
 * @param TABLE Table
 * @returns Object
 */
export type IndexNames<TABLE extends Table = Table> = Extract<keyof TABLE['indexes'], string>

/**
 * Returns a specific index of a table
 * @param TABLE Table
 * @param INDEX_NAME String
 * @returns Object
 */
export type IndexSchema<
  TABLE extends Table = Table,
  INDEX_NAME extends IndexNames<TABLE> = IndexNames<TABLE>
> = TABLE['indexes'][INDEX_NAME]
