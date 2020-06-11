/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

// TODO: allow for nesting (use arrays) and boolean settings
// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.OperatorsAndFunctions.html

// Import standard error handler
import { error } from './utils'

import checkAttribute from './checkAttribute'
import Table from '../classes/Table'

export interface ExpressionObject {
  attr?: string // 	Specifies the attribute to filter on. If an entity property is provided (or inherited from the calling operation), aliases can be used. Either attr or size must be provided.
  size?: string // 	Specifies which attribute's calculated size to filter on (see Operators and Functions for more information). If an entity property is provided (or inherited from the calling operation), aliases can be used. Either attr or size must be provided.
  eq?: any // Specifies value to equal attribute or size of attribute.
  ne?: any // Specifies value to not equal attribute or size of attribute.
  lt?: any // Specifies value for attribute or size to be less than.
  lte?: any // Specifies value for attribute or size to be less than or equal to.
  gt?: any // Specifies value for attribute or size to be greater than.
  gte?: any // Specifies value for attribute or size to be greater than or equal to.
  between?: any[] // Specifies values for attribute or size to be between. E.g. [18,49].
  beginsWith?: any // Specifies value for the attribute to begin with
  in?: any[] // Specifies and array of values that the attribute or size must match one value.
  contains?: string // Specifies value that must be contained within a string or Set. (see Operators and Functions for more information)
  exists?: boolean | string // Checks whether or not the attribute exists for an item. A value of true uses the attribute_exists() function and a value of false uses the attribute_not_exists() function (see Operators and Functions for more information)
  type?: string // A value that compares the attribute's type. Value must be one of S,SS, N, NS, B, BS, BOOL, NULL, L, or M (see Operators and Functions for more information)
  or?: boolean // Changes the logical evaluation to OR (by default it's AND)
  negate?: boolean // Adds NOT to the condition.
  entity?: string // The entity this attribute applies to. If supplied (or inherited from the calling operation), attr and size properties can use the entity's aliases to reference attributes.
}

export interface ExpressionArray
  extends Array<ExpressionObject | ExpressionArray> {}

export type Expression = ExpressionObject | ExpressionArray

type LogicalOperator = 'OR' | 'AND'

type ExpressionBuilderResult = {
  logic?: LogicalOperator
  expression: string
  names: Record<string, string>
  values: Record<string, any>
  group: number
}

const buildExpression = (
  exp: Expression,
  table: Table,
  entity?: string,
  group = 0,
  level = 0
): ExpressionBuilderResult => {
  // Coerce to array if not already
  const clauses = Array.isArray(exp) ? exp : [exp]
  let expression = ''
  let names = {}
  let values = {}
  let logic: LogicalOperator | undefined // init undefined at each level

  // group logic tracker - need to mark the first clause

  // Loop through the clauses
  clauses.forEach((nClause, id) => {
    // If clause is nested in an array
    if (Array.isArray(nClause)) {
      // Build the sub clause
      let sub = buildExpression(nClause, table, entity, group, level)

      // If no logic at this level, capture from sub clause
      logic = logic ? logic : sub.logic

      // Concat to expression and merge names and values
      expression += `${id > 0 ? ` ${sub.logic} ` : ''}(${sub.expression})`
      names = Object.assign(names, sub.names)
      values = Object.assign(values, sub.values)
      group = sub.group

      // Else process the clause
    } else {
      // Increment group counter for each clause
      group++ // guarantees uniqueness

      // Default entity reference
      if (entity && !nClause.entity) nClause.entity = entity

      // Parse the clause
      const clause = parseClause(nClause, group, table)

      // Concat to expression and merge names and values
      expression += `${id > 0 ? ` ${clause.logic} ` : ''}${clause.clause}`
      names = Object.assign(names, clause.names)
      values = Object.assign(values, clause.values)

      // Capture the first logic indicator at this level
      logic = logic ? logic : clause.logic
    }
  })

  return {
    logic,
    expression,
    names,
    values,
    group,
  }
}

// Export buildExpression
export default buildExpression

// Define condition expression error
const conditionError = (op?: string) =>
  error(
    `You can only supply one filter condition per query. Already using '${op}'`
  )

type ParseClauseResult = {
  logic: LogicalOperator
  clause: string
  names: Record<string, string>
  values: Record<string, any>
}

// Parses expression clause and returns structured clause object
const parseClause = (
  _clause: ExpressionObject,
  grp: number,
  table: Table
): ParseClauseResult => {
  // Init clause, names, and values
  let clause: string = ''
  const names: Record<string, string> = {}
  const values: Record<string, any> = {}

  // Deconstruct valid expression options
  const {
    attr, // attribute
    size, // wraps attr in size()
    negate, // negates expression
    or, // change logical evaluator to OR
    eq, // =
    ne, // <>
    in: _in, // IN
    lt, // <
    lte, // <=
    gt, // >
    gte, // >=
    between, // BETWEEN
    exists, // NULL and NOT_NULL
    contains, // CONTAINS
    beginsWith, // BEGINS_WITH
    type, // checks attribute_type
    entity, // optional entity reference for aliasing
    ...args
  } = _clause

  // Error on extraneous arguments
  if (Object.keys(args).length > 0)
    error(`Invalid expression options: ${Object.keys(args).join(', ')}`)

  // Verify entity
  if (
    entity !== undefined &&
    (typeof entity !== 'string' ||
      !table.getEntity(entity) ||
      table.getEntity(entity)!.constructor.name !== 'Entity')
  )
    error(
      `'entity' value of '${entity}' must be a string and a valid table Entity name`
    )

  // Add filter attribute to names
  const currName =
    typeof attr === 'string'
      ? checkAttribute(
          attr,
          entity
            ? table.getEntity(entity)!.schema.attributes
            : table.Table.attributes
        )
      : typeof size === 'string'
      ? checkAttribute(
          size,
          entity
            ? table.getEntity(entity)!.schema.attributes
            : table.Table.attributes
        )
      : error(
          `A string for 'attr' or 'size' is required for condition expressions`
        )

  names[`#attr${grp}`] = currName!

  // Parse clause operator and value
  let operator: string | undefined = undefined
  let value: any = undefined
  let f: string | undefined = undefined

  if (eq !== undefined) {
    value = eq
    f = 'eq'
    operator = '='
  }
  if (ne !== undefined) {
    value = value ? conditionError(f) : ne
    f = 'ne'
    operator = '<>'
  }
  if (_in) {
    value = value ? conditionError(f) : _in
    f = 'in'
    operator = 'IN'
  }
  if (lt) {
    value = value ? conditionError(f) : lt
    f = 'lt'
    operator = '<'
  }
  if (lte) {
    value = value ? conditionError(f) : lte
    f = 'lte'
    operator = '<='
  }
  if (gt) {
    value = value ? conditionError(f) : gt
    f = 'gt'
    operator = '>'
  }
  if (gte) {
    value = value ? conditionError(f) : gte
    f = 'gte'
    operator = '>='
  }
  if (between) {
    value = value ? conditionError(f) : between
    f = 'between'
    operator = 'BETWEEN'
  }
  if (exists !== undefined) {
    value = value ? conditionError(f) : exists
    f = 'exists'
    operator = 'EXISTS'
  }
  if (contains) {
    value = value ? conditionError(f) : contains
    f = 'contains'
    operator = 'CONTAINS'
  }
  if (beginsWith) {
    value = value ? conditionError(f) : beginsWith
    f = 'beginsWith'
    operator = 'BEGINS_WITH'
  }
  if (type) {
    value = value ? conditionError(f) : type
    f = 'type'
    operator = 'ATTRIBUTE_TYPE'
  }

  // If a operator was set
  if (operator) {
    // If begins_with
    if (operator === 'BETWEEN') {
      // Verify array input
      if (!Array.isArray(value) || value.length !== 2)
        error(`'between' conditions require an array with two values.`)
      // Add values and special key condition
      values[`:attr${grp}_0`] = value[0]
      values[`:attr${grp}_1`] = value[1]
      clause = `${
        size ? `size(#attr${grp})` : `#attr${grp}`
      } between :attr${grp}_0 and :attr${grp}_1`
    } else if (operator === 'IN') {
      // Verify array input
      if (!Array.isArray(value)) error(`'in' conditions require an array.`)
      if (!attr) error(`'in' conditions require an 'attr'.`)
      // Add values and special key condition
      clause = `#attr${grp} IN (${(value as any[])
        .map((x, i) => {
          values[`:attr${grp}_${i}`] = x
          return `:attr${grp}_${i}`
        })
        .join(',')})`
    } else if (operator === 'EXISTS') {
      if (!attr) error(`'exists' conditions require an 'attr'.`)
      clause = value
        ? `attribute_exists(#attr${grp})`
        : `attribute_not_exists(#attr${grp})`
    } else {
      // Add value
      values[`:attr${grp}`] = value
      // If begins_with, add special key condition
      if (operator === 'BEGINS_WITH') {
        if (!attr) error(`'beginsWith' conditions require an 'attr'.`)
        clause = `begins_with(#attr${grp},:attr${grp})`
      } else if (operator === 'CONTAINS') {
        if (!attr) error(`'contains' conditions require an 'attr'.`)
        clause = `contains(#attr${grp},:attr${grp})`
      } else if (operator === 'ATTRIBUTE_TYPE') {
        if (!attr) error(`'type' conditions require an 'attr'.`)
        // TODO: validate/convert types
        clause = `attribute_type(#attr${grp},:attr${grp})`
      } else {
        clause = `${
          size ? `size(#attr${grp})` : `#attr${grp}`
        } ${operator} :attr${grp}`
      }
    } // end if-else

    // Negate the clause
    if (negate) {
      clause = `(NOT ${clause})`
    }
  } else {
    error('A condition is required')
  } // end if operator

  // console.log('CLAUSE:',clause,'\nNAMES:',names,'\nVALUES:',values)

  return {
    logic: or ? 'OR' : 'AND',
    clause,
    names,
    values,
  }
} // end parseClause
