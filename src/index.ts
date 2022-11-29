'use strict'

/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @version 0.6.1
 * @license MIT
 */

// TODO: Check param merging
// TODO: 'Remove null fields' option
// TODO: prevent reserved field names?

import Table from './classes/Table'
import Entity from './classes/Entity'
import type {
  GetOptions,
  QueryOptions,
  PutOptions,
  DeleteOptions,
  UpdateOptions,
  EntityItem,
  InferEntityItem
} from './classes/Entity'

export {
  Table,
  Entity,
  GetOptions,
  QueryOptions,
  PutOptions,
  DeleteOptions,
  UpdateOptions,
  EntityItem,
  InferEntityItem
}
