'use strict'

/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

const validateType = require('./validateType')

// Format item based on schema
module.exports = (schema,linked,item,omit) => {
  return Object.keys(item).reduce((acc,field) => {

    if (linked[field]) {
      Object.assign(acc, linked[field].reduce((acc,f,i) => {
        if (schema[f].save || schema[f].hidden || omit.includes(f)) return acc
        return Object.assign(acc,{
          [schema[f].alias || f]: validateType(schema[f],f,item[field].split('#')[i])
        })
      },{}))
    }

    if ((schema[field] && schema[field].hidden) || omit.includes(field)) return acc
    return Object.assign(acc,{
      [(schema[field] && schema[field].alias) || field]: item[field]
    })
  },{})
}
