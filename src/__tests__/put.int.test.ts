// const createTableParams = require('./create-table.json')

// // Include dynalite and config server (use in memory)
// const dynalite = require('dynalite')
// const dynaliteServer = dynalite({
//   createTableMs: 0,
//   updateTableMs: 0,
//   deleteTableMs: 0
// })

// const AWS = require('aws-sdk')

// // Create DynamoDB connection to dynalite
// const DynamoDB = new AWS.DynamoDB({
//   endpoint: 'http://localhost:4567',
//   region: 'us-east-1',
//   credentials: new AWS.Credentials({ accessKeyId: 'test', secretAccessKey: 'test' })
// })

// // Create our document client
// const DocumentClient = new AWS.DynamoDB.DocumentClient({
//   endpoint: 'http://localhost:4567',
//   region: 'us-east-1',
//   credentials: new AWS.Credentials({ accessKeyId: 'test', secretAccessKey: 'test' })
// })

// // Start up Dynalite on port 4567
// beforeAll(async () => {
//   // Listen on port 4567
//   await new Promise((resolve,reject) => {
//     dynaliteServer.listen(4567, function(err) {
//       if (err) reject(err)
//       console.log('Dynalite started on port 4567')
//       resolve(true)
//     })
//   })

//   // Create test tables
//   await DynamoDB.createTable(Object.assign(createTableParams,{ TableName: 'test-table'})).promise()
//   // let data = await DynamoDB.listTables().promise()
//   // console.log('TABLES:',data);
// })

// afterAll(async () => {
//   await DynamoDB.deleteTable({ TableName: 'test-table'}).promise()
//   // let data = await DynamoDB.listTables().promise()
//   // console.log('TABLES:',data);
//   dynaliteServer.close()
// })

// describe('put',()=>{

//   it.skip('creates basic item',async () => {

//     // Generate params
//     let params = TestModel.put({ pk: 'test-pk', sk: 'test-sk' })

//     // Put to DynamoDB
//     await DocumentClient.put(params).promise()

//     // Grab item from DynamoDB
//     let getParams = TestModel.get({ pk: 'test-pk', sk: 'test-sk' })
//     let get = await DocumentClient.get(getParams).promise()
//     // console.log(get);

//     // Simple test
//     expect(get.Item.pk).toBe('test-pk')

//   })

// })
