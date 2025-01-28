import type { Table } from '../table.js'

/**
 * Returns the indexes of a Table
 *
 * @param TABLE Table
 * @return Object
 */
export type IndexNames<
  TABLE extends Table = Table,
  INDEX_TYPE extends 'local' | 'global' = 'local' | 'global'
> = {
  [KEY in keyof TABLE['indexes'] & string]: TABLE['indexes'][KEY]['type'] extends INDEX_TYPE
    ? KEY
    : never
}[keyof TABLE['indexes'] & string]

/**
 * Returns a specific index of a Table
 *
 * @param TABLE Table
 * @param INDEX_NAME String
 * @return Object
 */
export type IndexSchema<
  TABLE extends Table = Table,
  INDEX_NAME extends IndexNames<TABLE> = IndexNames<TABLE>
> = TABLE['indexes'][INDEX_NAME]
