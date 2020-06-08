/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @version 0.2.0
 * @license MIT
 */

// TODO: Check param merging
// TODO: 'Remove null fields' option
// TODO: prevent reserved field names?

import _Table from './classes/Table'
import _Entity from './classes/Entity'

export const Table = _Table
export const Entity = _Entity

export default {
  Table,
  Entity,
}
