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

interface FilterExpression {
  attr?: string
  size?: string
  eq?: string | number | boolean | null
  ne?: string | number | boolean | null
  lt?: string | number
  lte?: string | number
  gt?: string | number
  gte?: string | number
  between?:	string[] | number[]
  beginsWith?: string
  in?: any[]
  contains?: string
  exists?: boolean
  type?: string
  or?: boolean
  negate?: boolean
  entity?:string
}

export type FilterExpressions = FilterExpression | FilterExpression[] | FilterExpressions[]

const buildExpression = (
  exp: FilterExpressions,
  table: Table,
  entity?: string,
  group=0,
  level=0
): any => {

  // Coerce to array if not already
  const clauses = Array.isArray(exp) ? exp : [exp]
  let expression = ''
  let names = {}
  let values = {}
  let logic: string | undefined // init undefined at each level

  // group logic tracker - need to mark the first clause

  // Loop through the clauses
  clauses.forEach((x,id) => {

    // If clause is nested in an array
    if (Array.isArray(clauses[id])) {

      // Build the sub clause
      let sub = buildExpression(clauses[id],table,entity,group,level)

      // If no logic at this level, capture from sub clause
      logic = logic ? logic : sub.logic

      // Concat to expression and merge names and values
      expression += `${id > 0 ? ` ${sub.logic} `: ''}(${sub.expression})`
      names = Object.assign(names,sub.names)
      values = Object.assign(values,sub.values)
      group = sub.group

      // Else process the clause
    } else {

      // Make sure TS knows this is a FilterExpression
      const exp = clauses[id] as FilterExpression

      // Increment group counter for each clause
      group++ // guarantees uniqueness

      // Default entity reference
      if (entity && !exp.entity) exp.entity = entity

      // Parse the clause
      const clause = parseClause(exp,group,table)

      // Concat to expression and merge names and values
      expression += `${id > 0 ? ` ${clause.logic} `: ''}${clause.clause}`
      names = Object.assign(names,clause.names)
      values = Object.assign(values,clause.values)

      // Capture the first logic indicator at this level      
      logic = logic ? logic : clause.logic
    }
  }) // end for

  return {
    logic,
    expression,
    names,
    values,
    group
  }
}

// Export buildExpression
export default buildExpression


// Define condition expression error
const conditionError = (op?: string) =>
  error(`You can only supply one filter condition per query. Already using '${op}'`)


// Parses expression clause and returns structured clause object
const parseClause = (_clause: FilterExpression, grp: number, table: Table) => {

  // Init clause, names, and values
  let clause = ''
  const names: { [key: string]: string } = {}
  const values: { [key: string]: any } = {}

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
  if (entity !== undefined && (typeof entity !== 'string' || (!table[entity] || !table[entity].schema || !table[entity].schema.attributes)))
    error(`'entity' value of '${entity}' must be a string and a valid table Entity name`)

  // Add filter attribute to names  
  let attrName = "";
  const path = typeof attr === 'string' ? attr.split('.') : typeof size === 'string' ? size.split('.') : error(`A string for 'attr' or 'size' is required for condition expressions`);;
  for (let i = 0; i < path.length; i++) {
    names[i == 0 ? `#attr${grp}` : `#attr${grp}${i}`] = i == 0 ? checkAttribute(path[i], (entity ? table[entity].schema.attributes : table.Table.attributes)) : path[i];
    attrName += i == 0 ? `#attr${grp}` : `.#attr${grp}${i}`;
  }

  // Parse clause operator and value
  let operator, value, f
  if (eq !== undefined) { value = eq; f = 'eq'; operator = '=' }
  if (ne !== undefined) { value = value ? conditionError(f) : ne; f = 'ne'; operator = '<>' }
  if (_in) { value = value ? conditionError(f) : _in; f = 'in'; operator = 'IN' }
  if (lt !== undefined) { value = value ? conditionError(f) : lt; f = 'lt'; operator = '<' }
  if (lte !== undefined) { value = value ? conditionError(f) : lte; f = 'lte'; operator = '<=' }
  if (gt !== undefined) { value = value ? conditionError(f) : gt; f = 'gt'; operator = '>' }
  if (gte !== undefined) { value = value ? conditionError(f) : gte; f = 'gte';  operator = '>=' }
  if (between) { value = value ? conditionError(f) : between; f = 'between'; operator = 'BETWEEN' }
  if (exists !== undefined) { value = value ? conditionError(f) : exists; f = 'exists'; operator = 'EXISTS' }
  if (contains) { value = value ? conditionError(f) : contains; f = 'contains'; operator = 'CONTAINS' }
  if (beginsWith) { value = value ? conditionError(f) : beginsWith; f = 'beginsWith'; operator = 'BEGINS_WITH' }
  if (type) { value = value ? conditionError(f) : type; f = 'type'; operator = 'ATTRIBUTE_TYPE' }


  // If a operator was set
  if (operator) {
    // If begins_with
    if (operator === 'BETWEEN') {
      // Verify array input
      if (Array.isArray(value) && value.length === 2) {
        // Add values and special key condition
        values[`:attr${grp}_0`] = value[0]
        values[`:attr${grp}_1`] = value[1]
        clause = `${size ? `size(${attrName})` : `${attrName}`} between :attr${grp}_0 and :attr${grp}_1`
      } else {
        error(`'between' conditions require an array with two values.`)
      }
    } else if (operator === 'IN') {
      if (!attr) error(`'in' conditions require an 'attr'.`)
      // Verify array input
      if (Array.isArray(value)) {
        // Add values and special key condition
        clause = `#attr${grp} IN (${value.map((x,i)=>{
          values[`:attr${grp}_${i}`] = x
          return `:attr${grp}_${i}`
        }).join(',')})`
      } else {
        error(`'in' conditions require an array.`)
      }
    } else if (operator === 'EXISTS') {
      if (!attr) error(`'exists' conditions require an 'attr'.`)
      clause = value ? `attribute_exists(${attrName})` : `attribute_not_exists(${attrName})`
    } else {
      // Add value
      values[`:attr${grp}`] = value
      // If begins_with, add special key condition
      if (operator === 'BEGINS_WITH') {
        if (!attr) error(`'beginsWith' conditions require an 'attr'.`)
        clause = `begins_with(${attrName},:attr${grp})`
      } else if (operator === 'CONTAINS') {
        if (!attr) error(`'contains' conditions require an 'attr'.`)
        clause = `contains(${attrName},:attr${grp})`
      } else if (operator === 'ATTRIBUTE_TYPE') {
        if (!attr) error(`'type' conditions require an 'attr'.`)
        // TODO: validate/convert types
        clause = `attribute_type(${attrName},:attr${grp})`
      } else {
        clause = `${size ? `size(${attrName})` : `${attrName}`} ${operator} :attr${grp}`
      }
    } // end if-else

    // Negate the clause
    if (negate) { clause = `(NOT ${clause})` }
  } else {
    error('A condition is required')
  } // end if operator

  // console.log('CLAUSE:',clause,'\nNAMES:',names,'\nVALUES:',values)

  return {
    logic: or ? 'OR' : 'AND',
    clause,
    names,
    values
  }

} // end parseClause