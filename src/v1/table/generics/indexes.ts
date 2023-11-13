import type { TableV2 } from '../class'

/**
 * Returns the indexes of a Table
 *
 * @param TABLE Table
 * @return Object
 */
export type IndexNames<TABLE extends TableV2 = TableV2> = Extract<keyof TABLE['indexes'], string>

/**
 * Returns a specific index of a Table
 *
 * @param TABLE Table
 * @param INDEX_NAME String
 * @return Object
 */
export type IndexSchema<
  TABLE extends TableV2 = TableV2,
  INDEX_NAME extends IndexNames<TABLE> = IndexNames<TABLE>
> = TABLE['indexes'][INDEX_NAME]
