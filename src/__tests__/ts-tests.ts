// Bootstrap testing
const { createTableParams, dynaliteServer, DynamoDB, DocumentClient, DocumentClient2, delay } = require('./bootstrap-tests')

// Start up Dynalite on port 4567
beforeAll(async () => {
  // Listen on port 4567
  await new Promise((resolve,reject) => {
    dynaliteServer.listen(4567, function(err: any) {
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
import Table from '../classes/Table'
import Entity from '../classes/Entity'


describe('Misc Tests (development only)', ()=> {



  it('uses a numeric pk value', async () => {
    
    const table = new Table({
      name: 'test-table',
      partitionKey: 'pk',
      sortKey: 'sk',
      indexes: {
        GSI1: { partitionKey: 'gs1pk', sortKey: 'gs1sk' }
      },
      attributes: {
        test: 'string',
        test2: { type: 'set', setType: 'string' }
      },
      DocumentClient
    })


    // console.log(JSON.stringify(table,null,2))
    // console.log(table)
    
    const TestEntity = new Entity({
      name: 'Test',
      attributes: {
        id: { partitionKey: true, type: 'string' },
        sk: { sortKey: true, type: 'string' },
        test: 'string',
        test2: { alias: 'testAlias' },
        GSI: { partitionKey: 'GSI1', type: 'string', required: true }
      },
      table
    })

    // console.log(TestEntity.schema.attributes);
    console.log(
      TestEntity.getParams(
        { id: 'test', sk: 'testsk' },
        {
          consistent: true,
          capacity: 'none',
          attributes: ['test','something else']

        }
      )
    )
    

    // console.log(
    //   await TestEntity.query(1)
    // )

  })

})