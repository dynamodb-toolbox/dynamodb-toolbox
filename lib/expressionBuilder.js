'use strict'

/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

// TODO: allow for nesting (use arrays) and boolean settings
// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.OperatorsAndFunctions.html

// Import standard error handler
const { error } = require('./utils')

const buildExpression = (exp,group=0,level=0) => {
  
  // Coerce to array if not already
  const clauses = Array.isArray(exp) ? exp : [exp]
  let expression = ''
  let names = {}
  let values = {}
  let logic // init undefined at each level

  // group logic tracker - need to mark the first clause

  // Loop through the clauses
  for (let id in clauses) {

    // If clause is nested in an array
    if (Array.isArray(clauses[id])) {

      // Build the sub clause
      let sub = buildExpression(clauses[id],group,level)

      // If no logic at this level, capture from sub clause
      logic = logic ? logic : sub.logic

      // Concat to expression and merge names and values
      expression += `${id > 0 ? ` ${sub.logic} `: ''}(${sub.expression})`
      names = Object.assign(names,sub.names)
      values = Object.assign(values,sub.values)
      group = sub.group
    
    // Else process the clause
    } else {

      // Increment group counter for each clause
      group++ // guarantees uniqueness

      let clause = parseClause(clauses[id],group)
      
      // Concat to expression and merge names and values
      expression += `${id > 0 ? ` ${clause.logic} `: ''}${clause.clause}`
      names = Object.assign(names,clause.names)
      values = Object.assign(values,clause.values)

      // Capture the first logic indicator at this level      
      logic = logic ? logic : clause.logic
    }
  } // end for

  return { 
    logic,
    expression,
    names,
    values,
    group
  }
}

module.exports = buildExpression


// Define condition expression error
const conditionError = (op) =>
  error(`You can only supply one filter condition per query. Already using '${op}'`)


// Parses expression clause and returns structured clause object
const parseClause = (_clause,grp) => {

  // Init clause, names, and values
  let clause = ''
  const names = {}
  const values = {}

  // Deconstruct valid expression options
  const { 
    attr, // attribute
    size, // wraps attr in size()
    negate, // negates expression
    // TODO: thing about the name of this
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
    ...args
  } = _clause

  // Error on extraneous arguments
  if (Object.keys(args).length > 0)
    error(`Invalid expression options: ${Object.keys(args).join(', ')}`)

  // Add filter attribute to names
  names[`#attr${grp}`] = typeof attr === 'string' ? attr 
    : typeof size === 'string' ? size
    : error(`A string for 'attr' or 'size' is required for condition expressions`)

  // Parse clause operator and value
  let operator, value, f
  if (eq) { f = 'eq'; value = value ? conditionError(f) : eq; operator = '=' }
  if (ne) { f = 'ne'; value = value ? conditionError(f) : ne; operator = '<>' }
  if (_in) { f = 'in'; value = value ? conditionError(f) : _in; operator = 'IN' }
  if (lt) { f = 'lt'; value = value ? conditionError(f) : lt; operator = '<' }
  if (lte) { f = 'lte'; value = value ? conditionError(f) : lte; operator = '<=' }
  if (gt) { f = 'gt'; value = value ? conditionError(f) : gt; operator = '>' }
  if (gte) { f = ''; value = value ? conditionError(f) : gte; operator = '>=' }
  if (between) { f = 'between'; value = value ? conditionError(f) : between; operator = 'BETWEEN' }
  if (exists !== undefined) { f = 'exists'; value = value ? conditionError(f) : exists; operator = 'EXISTS' }
  if (contains) { f = 'contains'; value = value ? conditionError(f) : contains; operator = 'CONTAINS' }
  if (beginsWith) { f = 'beginsWith'; value = value ? conditionError(f) : beginsWith; operator = 'BEGINS_WITH' }
  if (type) { f = 'type'; value = value ? conditionError(f) : type; operator = 'ATTRIBUTE_TYPE' }
  

  // If a operator was set
  if (operator) {
    // If begins_with
    if (operator === 'BETWEEN') {
      // Verify array input
      if (!Array.isArray(value) || value.length !== 2)
        error(`'between' conditions requires an array with two values.`)
      // Add values and special key condition
      values[`:attr${grp}_0`] = value[0]
      values[`:attr${grp}_1`] = value[1]
      clause = `${size ? `size(#attr${grp})` : `#attr${grp}`} between :attr${grp}_0 and :attr${grp}_1`
    } else if (operator === 'IN') {
      // Verify array input
      if (!Array.isArray(value))
        error(`'in' conditions requires an array.`)
      if (!attr) error(`'in' conditions requires an 'attr'.`)
      // Add values and special key condition
      clause = `#attr${grp} IN (${value.map((x,i)=>{
        values[`:attr${grp}_${i}`] = x  
        return `:attr${grp}_${i}`
      }).join(',')})`
    } else if (operator === 'EXISTS') {
      if (!attr) error(`'exists' conditions requires an 'attr'.`)
      clause = value ? `attribute_exists(#attr${grp})` : `attribute_not_exists(#attr${grp})`
    } else {
      // Add value
      values[`:attr${grp}`] = value
      // If begins_with, add special key condition
      if (operator === 'BEGINS_WITH') {
        if (!attr) error(`'begins_with' conditions requires an 'attr'.`)
        clause = `begins_with(#attr${grp},:attr${grp})`
      } else if (operator === 'CONTAINS') {
        if (!attr) error(`'contains' conditions requires an 'attr' value.`)
        clause = `contains(#attr${grp},:attr${grp})`
      } else if (operator === 'ATTRIBUTE_TYPE') {
        if (!attr) error(`'type' conditions requires an 'attr'.`)
        // TODO: validate/convert types
        clause = `attribute_type(#attr${grp},:attr${grp})`
      } else {
        clause = `${size ? `size(#attr${grp})` : `#attr${grp}`} ${operator} :attr${grp}`
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


}