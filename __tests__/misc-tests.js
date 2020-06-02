// Bootstrap testing
const { createTableParams, dynaliteServer, DynamoDB, DocumentClient, DocumentClient2, delay } = require('./bootstrap-tests')

// console.log(DocumentClient);
// console.log(DocumentClient.constructor.name);


// Start up Dynalite on port 4567
beforeAll(async () => {
  // Listen on port 4567
  await new Promise((resolve,reject) => {
    dynaliteServer.listen(4567, function(err) {
      if (err) reject(err)
      resolve(true)
    })
  })
  // Create test table
  await DynamoDB.createTable(Object.assign(createTableParams,{ TableName: 'test-table'})).promise()
})

afterAll(async () => {
  await DynamoDB.deleteTable({ TableName: 'test-table'}).promise()
  dynaliteServer.close()
})


// Require Table and Entity classes
const Table = require('../src/classes/Table')
const Entity = require('../src/classes/Entity')


describe('Table creation', ()=> {

  it('misc tests', async () => {

    let Default = new Table({
      // name: 'dynamodb-toolbox-test-test-table',
      name: 'test-table',
      alias: 'aliased-table-name',
      partitionKey: 'pk',
      sortKey: 'sk',
      attributes: {
        GSI1sk: 'number',
        data: {}
      //   // pk: { type: 'string' },
      //   // sk: 'string',
      //   // data: 'number',
      //   // test: 'string',
      //   // // testx: 'test',
      //   // test2: { type: 'set', setType: 'string' }
      },
      indexes: {
        GSI1: { partitionKey: 'GSI1pk', sortKey: 'GSI1sk' },
        LSI2: { partitionKey: 'pk', sortKey: 'test' },
        GSI3: { partitionKey: 'test' },
        LSI1: { sortKey: 'data' }
      },
      // DocumentClient
      // autoExecute: false,
      // autoParse: false
      removeNullAttributes: true
    })

    Default.DocumentClient = DocumentClient//2
    

    console.log(Default.Table.attributes);
    

    let Default2 = new Table({
      name: 'other-table',
      partitionKey: 'pk',
      sortKey: 'sk',
      DocumentClient
    })

    Default2.entities = new Entity({
      name: 'UserX',
      // timestamps: false,
      attributes: {
        family: { type: 'string', partitionKey: true },
        name: { type: 'string', sortKey: true }
      }
      // autoExecute: true,
      // autoParse: false
    })

    // console.log(Default2);
    

    // Default.DocumentClient = DocumentClient

    // SimpleEntity.name = '_Table'
    // console.log(DefaultTable)

    // Default.Entity = TestEntity
    // SimpleEntity.Table = Default

    Default.entities = new Entity({
      name: 'User',
      // timestamps: false,
      attributes: {
        family: { type: 'string', partitionKey: true },
        name: { type: 'string', sortKey: true },
        data: 'number',
        set: { type: 'set', setType: 'string', alias: 'roles' },
        age: { type: 'number' },
        friends: 'list',
        mapTest: { type: 'map', alias: 'mapper' },
        test: { map: 'testvar' },
        GSI1pk: { default: (x) => `family#${x.pk}`, hidden: true },
        GSI1sk: { type: 'number', default: (x) => `${x.age}`, hidden: true },
        shared: 'string',
        testDefaultF: { type: 'boolean', default: false },
        testDefault0: { type: 'boolean', default: 0 },
        testDefaultT: { type: 'boolean', default: true },
        comp: {},
        cp1: ['comp',0, { save: false }],
        cp2: ['comp',1, { save: false }]
      },
      // table: Default
      // autoExecute: true,
      // autoParse: false
    })

    // console.log(Default.User.schema.attributes);
    

    Default.entities = new Entity({
      name: 'Pet',
      // timestamps: true,
      attributes: {
        family: { type: 'string', partitionKey: true },
        name: { type: 'string', sortKey: true },
        data: 'set',
        petType: 'string',
        typey: { type: 'string', alias: 'typex' },
        // set: { type: 'set', setType: 'string', alias: 'roles' },
        // test: { default: 'some default' }
        shared: 'boolean',
        // GSI1pkx: 'string',
        // GSIpk: { partitionKey: 'GSI1' } 
        
      },
      // table: Default
      // autoExecute: true,
      // autoParse: false
    })

    // console.log(Default.User.attribute('family'));
    // console.log(JSON.stringify(Default.Table.attributes,null,2));
    

    // Default.name = 'New Table Name'
    // console.log(Object.getPrototypeOf())
    // console.log(Object.getOwnPropertyNames(Table.prototype))
// console.log(Default);

    // console.log(Default.User.put({ id: 'test', sk: '123', test: 123, setx: ['test','test2'] },{},{ execute: false}));
    
      
    console.log(
      await Default.User.put({ 
        family: 'Brady', 
        name: 'Mike', 
        age: 41,
        roles: ['father','husband'],
        test: null,
        mapper: {
          test: true,
          test2: false
        },
        cp1: 'test',
        cp2: 'test2'
      },{ 
        // capacity: 'total',
        // metrics: 'size',
        // returnValues: 'all_old',
        // conditions: { attr: 'test', type: 'S', negate: true},
        // execute: false
        // parse: false
      })
    )
    
    await delay(10)
    // console.log(
    //   await Default.User.update({ 
    //     family: 'Brady', 
    //     name: 'Mike',
    //     age: 41,
    //     test: null,
    //     // $remove: ['mapper']
    //   },{
    //     // capacity: 'total',
    //     // metrics: 'size',
    //     // returnValues: 'all_new',
    //     // conditions: { attr: 'test', type: 'S', negate: true},
    //     execute: false
    //     // parse: false
    //   })
    // )

    await Default.User.put({ family: 'Brady', name: 'Carol', age: 42, roles: ['mother','wife'] })
    await Default.User.put({ family: 'Brady', name: 'Alice', age: 50, roles: ['housekeeper'], mapTest: { test: 'Test level 1', test2: { test3: 'Test level 2'}} })
    await Default.User.put({ family: 'Brady', name: 'Greg', age: 18, roles: ['son','brother'] })
    await Default.User.put({ family: 'Brady', name: 'Marcia', age: 18, roles: ['daughter','sister'] })
    await Default.User.put({ family: 'Brady', name: 'Peter', age: 16, roles: ['son','brother'] })
    await Default.User.put({ family: 'Brady', name: 'Jan', age: 16, roles: ['daughter','sister'], friends: ['George Glass'] })
    await Default.User.put({ family: 'Brady', name: 'Bobby', age: 14, roles: ['son','brother'] })
    await Default.User.put({ family: 'Brady', name: 'Cindy', age: 14, roles: ['daughter','sister'] })
    await Default.User.put({ family: 'Franklin', name: 'Sam', age: 52, roles: ['butcher'] })
    await Default.Pet.put({ family: 'Brady', name: 'Tiger', petType: 'dog', typex: 'some value' })
    await Default.Pet.put({ family: 'Brady', name: 'Fluffy', petType: 'cat' })
    await delay(10)

    // console.log(JSON.stringify(
    //   await Default.User.get({ family: 'Brady', name: 'Alice' },{},{ omit: [] })
    //   ,null,2))

    console.log(JSON.stringify(
      await Default.query('Brady',{ eq: 'Mike' })
    ,null,2))


    // const query = await Default.query('family#Brady',{
    //   // execute: false,
    //   // parse: false,
    //   // test: true,
    //   limit: 50,
    //   // beginsWith: 'C',
    //   // between: ['Cindy','Jan'],
    //   // gt: 'Cindy',
    //   gt: '18',
    //   // reverse: true,
    //   // omit: ['set']
    //   // capacity: 'none',
    //   // consistent: true,
    //   // filters: [{ size: 'family[4].testing', gt: 18, entity:'User' },{attr:'sk',lte:'test'}],
    //   // filters: [{ attr: 'age', between: [16,18] },
    //   //   // { attr: 'friends', exists: false }],
    //   //   // { attr: 'age', gte: 16 },
    //   // ],
    //   // filter: { attr: 'age', in: [14,16,18] },
    //   // filters: { size: 'roles', gt: 1, entity: 'User' },
    //   filters: { attr: 'age', gt: 40 },
    //   // filter: { attr: 'roles', notContains: 'brother' }
    //   // startKey: { pk: 'Brady', sk: 'Jan' }
    //   // test: true,
    //   // test2: true,
    //   // attributes: [
    //   //   { User: 'name,family,age,roles' },
    //   //   { Pet: 'name,petType' }
    //   // ],
    //   index: 'GSI1'
    // },
    // // { ProjectionExpression: 'age'}
    // )


    // console.log(
    //   await Default.User.get({
    //     family: 'Brady', 
    //     name: 'Mike',
    //   },{
    //     consistent: true,
    //     capacity: 'total',
    //     attributes: ['age','roles','sk','modified'],
    //     // execute: false
    //     // parse: false
    //   })
    // )

    // console.log(
    //   await Default.User.delete({
    //     family: 'Brady', 
    //     name: 'Mike',
    //   },{
    //     capacity: 'total',
    //     // metrics: 'size',
    //     returnValues: 'all_old',
    //     conditions: { attr: 'test', type: 'S', negate: true},
    //     // execute: false
    //   })
    // )
    
    // await delay(10)
  
    // const query = await Default.User.query('Brady',{
    //   // execute: false,
    //   // parse: false,
    //   eq: 'Mike',
    //   // limit: 5,
    //   // gt: 'Cindy',
    //   // parse: false,
    //   // filters: [
    //   //   { attr: 'agex', between: [18,90]},
    //   //   { attr: 'petType', ne: 16, entity: 'Pet' }
    //   // ],
    //   // attributes: { User: ['name', 'family', 'mapper' ] }
    //   // attributes: ['name', 'family', 'mapper','pk','sk' ],
    //   // index: 'GSI1',
    //   // select: 'COUNT'
    //   // capacity: 'indexes'
    // })
    // console.log(JSON.stringify(query,null,2))


    // const scan = await Default.scan({
    //   // execute: false,
    //   // parse: false,
    //   // limit: 5,
    //   // filters: [
    //   //   { attr: 'age', between: [18,90]},
    //   //   { attr: 'petType', ne: 16, entity: 'Pet' }
    //   // ],
    //   // attributes: { User: ['name', 'family', 'mapper' ] },
    //   // attributes: ['name','family', 'mapper','pk','sk' ],
    //   // index: 'GSI1',
    //   // select: 'COUNT',
    //   // capacity: 'indexes',
    //   // consistent: true,
    //   // segments: 2,
    //   // segment: 1,
    //   // startKey: { test: 'test' }
    // })
    // console.log(JSON.stringify(scan,null,2))
    
    // console.log(JSON.stringify(await query.next(),null,2))
    // console.log(query)
    
    
    
    // const batchTest = await Default.batchGet(
    //     [
    //       { 
    //         // table: Default,
    //         keys: [
    //           { family: 'Brady', name: 'Mike', entity: 'User' },
    //           { family: 'Brady', name: 'Tiger', entity:'Pet' }
    //         ],
    //         consistent: false,
    //         attributes: [ 
    //           'age',
    //           { User: ['name', 'family', 'mapper' ] },
    //           { Pet: ['typex','name'] }
    //         ],
    //         // entity: 'User',
    //       },
    //       { family: 'Brady', name: 'MikeX', pk: 'test', entity: 'User' },
    //       { family: 'Brady', name: 'CarolX', entity: 'Pet' },
    //       // { 
    //       //   table: Default,
    //       //   keys: [
    //       //     { family: 'Brady', name: 'MikeY', entity: 'Pet' },
    //       //     { family: 'Brady', name: 'CarolY' }
    //       //   ],
    //       //   consistent: false,
    //       //   attributes: [ 'age','pk','sk' ]
    //       // },
    //       // { 
    //       //   table: Default2,
    //       //   keys: [
    //       //     { pk: 'Brady', sk: 'Mike' },
    //       //     { family: 'Brady', sk: 'Carol', entity: 'UserX' }
    //       //   ],
    //       //   // consistent: true,
    //       //   // entity: 'UserX',
    //       //   attributes: [ { UserX: ['name', 'family' ] } ]
    //       // }
    //     ], 
    //     { 
    //       capacity: 'total',
    //       // execute: false,
    //       // parse: false
    //     }
    //   )
    //   console.log(JSON.stringify(batchTest,null,2))
    //   console.log(JSON.stringify(await batchTest.next(),null,2))
  
    // console.log(
    //   // JSON.stringify(
    //    Default.User.getBatch({ family: 'Brady', name: 'CarolX' })
    // ) //)

    // const batchTest = await Default.batchGet(
    //   [
    //     Default.User.getBatch({ family: 'Brady', name: 'Mike' }),
    //     Default.User.getBatch({ family: 'Brady', name: 'Carol' }),
    //     // Default2.UserX.getBatch({ family: 'Brady', name: 'other' }),
    //     Default.Pet.getBatch({ family: 'Brady', name: 'Tiger' })
    //   ], 
    //   { 
    //     capacity: 'total',
    //     // consistent: true,
    //     // consistent: {
    //     //   'aliased-table-name': true,
    //     //   // 'other-table': true
    //     // },
    //     attributes: {
    //       'aliased-table-name': [ 
    //         'age',
    //         { User: ['name', 'family', 'mapper' ] },
    //         { Pet: ['typex','name'] }
    //       ],
    //       // 'other-table': ['pk','sk']
    //     },
    //     // execute: false,
    //     // parse: false
    //   }
    // )
    //   console.log(JSON.stringify(batchTest,null,2))
    //   // console.log(JSON.stringify(await batchTest.next(),null,2))



    // console.log(
    //    Default.User.putBatch({ family: 'Brady', name: 'CarolX', age: 40, roles: ['mother','wife'] })
    // )

  //   console.log(
  //     Default.User.deleteBatch({ family: 'Brady', name: 'CarolX', age: 40, roles: ['mother','wife'] })
  //  )
    // const batchWriteTest = await Default.batchWrite(
    //   [
    //     Default.User.putBatch({ family: 'Brady', name: 'CarolX', age: 40, roles: ['mother','wife'] }),
    //     Default.User.putBatch({ family: 'Brady', name: 'CarolY', age: 42, roles: ['wife'] }),
    //     Default.User.deleteBatch({ family: 'Brady', name: 'Tiger' })
    //   ],{ 
    //     capacity: 'total',
    //     metrics: 'size',
    //     // execute: false,
    //     // parse: false
    //   }
    // )
    // console.log(JSON.stringify(batchWriteTest,null,2))
    // console.log(JSON.stringify(await batchWriteTest.next(),null,2))


    // console.log(JSON.stringify(
    //   await DocumentClient2.batchGet({
    //     RequestItems: {
    //       'dynamodb-toolbox-test-test-table': {
    //         Keys: [
    //           { pk: 'Brady', sk: 'Mike' },
    //           { pk: 'Brady', sk: 'Alice' },
    //           // { pk: 'Brady', sk: 'Mike' }
    //         ]
    //       }
    //     }
    //   }).promise()
    // ,null,2))

    // console.log(JSON.stringify(
    //   await DocumentClient2.query({
    //       TableName: 'dynamodb-toolbox-test-test-table',
    //       KeyConditionExpression: `#pk = :pk`,
    //       ExpressionAttributeNames: { '#pk': 'pk', '#test': 'age' },
    //       ExpressionAttributeValues: { ':pk': 'Brady', ':test': '' },
    //       FilterExpression: '#test = :test'
    //   }).promise()
    // ,null,2))

    // console.log(JSON.stringify(
    //   await DocumentClient2.query({
    //       TableName: 'dynamodb-toolbox-test-test-table',
    //       KeyConditionExpression: `#pk = :pk`,
    //       ExpressionAttributeNames: { '#pk': 'pk', '#test': 'age' },
    //       ExpressionAttributeValues: { ':pk': 'Brady', ':test': '' },
    //       FilterExpression: '#test = :test'
    //   }).promise()
    // ,null,2))

    await delay(100)
  
    // const query = await Default.User.query('Brady',{
    //   // execute: false,
    //   // parse: false,
    //   eq: 'Tiger',
    //   // limit: 5,
    //   // gt: 'Cindy',
    //   // parse: false,
    //   // filters: [
    //   //   { attr: 'agex', between: [18,90]},
    //   //   { attr: 'petType', ne: 16, entity: 'Pet' }
    //   // ],
    //   // filters: { attr: 'name', eq: 'Tiger', entity: 'Pet'}
    //   // attributes: { User: ['name', 'family', 'mapper' ] }
    //   // attributes: ['name', 'family', 'mapper','pk','sk' ],
    //   // index: 'GSI1',
    //   // select: 'COUNT'
    //   // capacity: 'indexes'
    // })
    // console.log(JSON.stringify(query,null,2))

    // console.log(await Default.User.update({ pk: 'test', sk: '123', testABC: true }))
    // console.log(JSON.stringify(await Default.User.get({ pk: 'test', sk: '123' }),null,2))
    // console.log(await Default.User.delete({ pk: 'test', sk: '123' }))
    // console.log(JSON.stringify(await Default.User.get({ pk: 'test', sk: '123' }),null,2))

    // console.log(Default.User.put({ pk: 'test', sk: '123', test: 123, setx: ['test','test2'] }))

    // console.log(Default.get('User', { pk: 'test', sk: '123' }))
    // console.log(Default.delete('User', { pk: 'test', sk: '123' }))
    // console.log(Default.update('User', { pk: 'test', sk: '123', testABC: true }))
    // console.log(Default.put('User', { pk: 'test', sk: '123', test: 123 }))


    // expect(Default.Table).toEqual({
    //   table: 'test-table',
    //   partitionKey: 'pk',
    //   sortKey: null,
    //   schema: {
    //     pk: { type: 'string', coerce: true },
    //     __model: { type: 'string', default: 'Default', coerce: true, hidden: true }
    //   },
    //   defaults: {
    //     __model: 'Default'
    //   },
    //   required: {},
    //   linked: {}
    // })
  })


  // it('creates basic table', () => {
  //   let Default = new Table({
  //     name: 'test-table',
  //     partitionKey: 'pk',
  //     sortKey: 'sk',
  //     attributes: {
  //       pk: { type: 'string' },
  //       sk: 'string',
  //       data: 'number',
  //       test: 'list',
  //       // testx: 'test',
  //       test2: { type: 'set', setType: 'string' }
  //     },
  //     lsis: {
  //       LSI1: { sortKey: 'data' },
  //       LSI2: { partitionKey: 'pk', sortKey: 'test' }
  //     },
  //     gsis: {
  //       GSI1: { partitionKey: 'sk', sortKey: 'pk' },
  //       GSI2: { partitionKey: 'sk', sortKey: 'test' }
  //     }
  //   })
  //
  //   console.log(JSON.stringify(Default.table(),null,2))
  //
  // //   expect(Default.model()).toEqual({
  // //     table: 'test-table',
  // //     partitionKey: 'pk',
  // //     sortKey: null,
  // //     schema: {
  // //       pk: { type: 'string', coerce: true },
  // //       __model: { type: 'string', default: 'Default', coerce: true, hidden: true }
  // //     },
  // //     defaults: {
  // //       __model: 'Default'
  // //     },
  // //     required: {},
  // //     linked: {}
  // //   })
})




/*
// Generate BatchGet Params
  generateBatchGetParams(_items,options={},params={},meta=false) {

    let items = Array.isArray(_items) ? _items : [_items]

    const {
      capacity,
      ..._args
    } = options
  
    // Remove other valid options from options
    const args = Object.keys(_args).filter(x => !['execute','parse'].includes(x))

    // Error on extraneous arguments
    if (args.length > 0)
      error(`Invalid batchGet options: ${args.join(', ')}`)

    // Verify capacity
    if (capacity !== undefined
      && (typeof capacity !== 'string' || !['NONE','TOTAL','INDEXES'].includes(capacity.toUpperCase())))
      error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`)

    // Init RequestItems and Tables reference
    const RequestItems = {}
    const Tables = {}
    let EntityProjections = {}
    let TableProjections = {}
    
    // Loop through items
    for (const i in items) {
      const item = items[i]
      let Keys = []
      
      // Item must be an object
      if (typeof item === 'object' && !Array.isArray(item)) {
        
        // Extract known parameters
        let {
          table, // table object
          keys, // array of keys
          consistent, // boolean for ConsistentRead
          attributes, // Projections
          entity, // entity name
          ...args
        } = item   

        // If table supplied, verify, else default to current table
        if (table !== undefined) {
          if (table.constructor.name !== 'Table')
            error(`'table' requires a valid Table object`)
        } else {
          table = this
        }
         
        // Verify consistent read
        if (consistent !== undefined && typeof consistent !== 'boolean')
          error(`'consistent' requires a boolean`)

        // Verify entity, set default for this table
        if (entity !== undefined) {
          if (typeof entity !== 'string' || (!table[entity] || table[entity].constructor.name !== 'Entity'))
            error(`'entity' value of '${entity}' must be a string and a valid table Entity name`)
        } else if (table.name === this.name) {
          // entity = this.name
        }

        let ExpressionAttributeNames // init ExpressionAttributeNames
        let ProjectionExpression // init ProjectionExpression
        let _EntityProjections // scoped to this loop
        let _TableProjections // scoped to this loop
    
        // If projections
        if (attributes) {
          const { names, projections, entities, tableAttrs } = parseProjections(attributes,table,null,true)
    
          if (Object.keys(names).length > 0) {
            // Merge names and add projection expression
            ExpressionAttributeNames = names
            ProjectionExpression = projections
            _EntityProjections = entities
            _TableProjections = tableAttrs
          } // end if names
    
        } // end if projections

        // Error if extra arguments are provided along with keys
        if (keys !== undefined && Object.keys(args).length > 0)
          error(`Invalid options when specifying 'keys': ${args.join(', ')}`)
        
        // If no keys, convert extra args to a keys array
        if (keys === undefined) keys = [ { entity, ...args }]        

        // Process keys
        if (Array.isArray(keys)) {
          // Loop through keys
          for (const x in keys) {
            // Extract entity (if provided) and remaining attributes
            let { 
              entity: _entity,
              ...keyMap
            } = keys[x]

            // Inherit entity
            const ent = _entity || entity

            // Track key combos
            let primaryKey = {}

            // Loop through the remaining attributes and check if a pk/sk
            for (const attr in keyMap) {
              
              // Load the schema for entity, or default to table
              const schema = ent ? table[ent].schema.attributes : table.Table.attributes

              // Merge keys into the primary Key
              primaryKey = Object.assign(
                primaryKey,
                { 
                  [(schema[attr] && (schema[attr].partitionKey || schema[attr].sortKey || table.Table.partitionKey === attr || table.Table.sortKey === attr)) ? schema[attr].map || attr
                  : error(`'${attr}' is not a valid partition or sort key`)]: keyMap[attr]
                }
              )
            } // end for keyMap

            // Push primaryKey onto Keys
            Keys.push(primaryKey)

          } // end for loop

        } else {
          error(`'keys' must be an array of objects`)
        }

        // Create the table in the Request Item if it doesn't exist
        if (!RequestItems[table.name]) {

          // Add the table reference
          Tables[table.name] = table

          // Create meta data references projections
          EntityProjections[table.name] = _EntityProjections
          TableProjections[table.name] = _TableProjections

          // Merge keys, fail on dupe configs
          RequestItems[table.name] = Object.assign(
            { Keys },
            // Prevent multiple table definitons with more than just Keys
            consistent ? { ConsistentRead: consistent } : null,
            ExpressionAttributeNames ? { ExpressionAttributeNames } : null,
            ProjectionExpression ? { ProjectionExpression } : null
          )
        } else {
          if (consistent || attributes) { error(`Only one configuration object per table is allowed`) }
          RequestItems[table.name].Keys = RequestItems[table.name].Keys.concat(Keys)
        } // end if table exists

      // Else, throw an error
      } else {
        error(`Invalid input, batchGet accepts and array of objects`)
      }

    } // end loop

    const payload = Object.assign(
      { RequestItems },
      capacity ? { ReturnConsumedCapacity: capacity.toUpperCase() } : null,
      typeof params === 'object' ? params : null
    )

    return meta ? { payload, Tables, EntityProjections, TableProjections } : payload
  } // generateBatchGetParams


    // const batchTest = await Default.batchGet(
    //     [
    //       { 
    //         // table: Default,
    //         keys: [
    //           { family: 'Brady', name: 'Mike', entity: 'User' },
    //           { family: 'Brady', name: 'Tiger', entity:'Pet' }
    //         ],
    //         consistent: false,
    //         attributes: [ 
    //           'age',
    //           { User: ['name', 'family', 'mapper' ] },
    //           { Pet: ['typex','name'] }
    //         ],
    //         // entity: 'User',
    //       },
    //       { family: 'Brady', name: 'MikeX', pk: 'test', entity: 'User' },
    //       { family: 'Brady', name: 'CarolX', entity: 'Pet' },
    //       // { 
    //       //   table: Default,
    //       //   keys: [
    //       //     { family: 'Brady', name: 'MikeY', entity: 'Pet' },
    //       //     { family: 'Brady', name: 'CarolY' }
    //       //   ],
    //       //   consistent: false,
    //       //   attributes: [ 'age','pk','sk' ]
    //       // },
    //       // { 
    //       //   table: Default2,
    //       //   keys: [
    //       //     { pk: 'Brady', sk: 'Mike' },
    //       //     { family: 'Brady', sk: 'Carol', entity: 'UserX' }
    //       //   ],
    //       //   // consistent: true,
    //       //   // entity: 'UserX',
    //       //   attributes: [ { UserX: ['name', 'family' ] } ]
    //       // }
    //     ], 
    //     { 
    //       capacity: 'total',
    //       // execute: false,
    //       // parse: false
    //     }
    //   )
    //   console.log(JSON.stringify(batchTest,null,2))
    //   console.log(JSON.stringify(await batchTest.next(),null,2))

 */
