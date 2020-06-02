/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

import validateTypes from './validateTypes';

// Format item based on attribute defnition
export default (DocumentClient) => (attributes,linked,item,include=[]) => {
  
  // TODO: Support nested maps?
  // TODO: include alias support?

  // Intialize validate type
  const validateType = validateTypes(DocumentClient)

  return Object.keys(item).reduce((acc,field) => {

    if (linked[field] || linked[attributes[field].alias]) {
      Object.assign(acc, (linked[field] || linked[attributes[field].alias]).reduce((acc,f,i) => {
        if (attributes[f].save || attributes[f].hidden || (include.length > 0 && !include.includes(f))) return acc    
        return Object.assign(acc,{
          [attributes[f].alias || f]: validateType(attributes[f],f,
            item[field]
              .replace(new RegExp(`^${escapeRegExp(attributes[field].prefix)}`),'')
              .replace(new RegExp(`${escapeRegExp(attributes[field].suffix)}$`),'')
              .split(attributes[field].delimiter || '#')[i]
          )
        })
      },{}))
    }

    if ((attributes[field] && attributes[field].hidden) || (include.length > 0 && !include.includes(field))) return acc
    // Extract values from sets
    if (attributes[field] && attributes[field].type === 'set' && Array.isArray(item[field].values)) { item[field] = item[field].values } 
    return Object.assign(acc,{
      [(attributes[field] && attributes[field].alias) || field]: (
        attributes[field].prefix || attributes[field].suffix
          ? item[field]
            .replace(new RegExp(`^${escapeRegExp(attributes[field].prefix)}`),'')
            .replace(new RegExp(`${escapeRegExp(attributes[field].suffix)}$`),'')
          : item[field]
      )
    })
  },{})
};

function escapeRegExp(text) {
  return text ? text.replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&') : ''
}