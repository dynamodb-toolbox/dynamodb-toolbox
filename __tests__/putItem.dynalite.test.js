const { advanceTo } = require('jest-date-mock')
const Entity = require('../classes/Entity')
const Table = require('../classes/Table')
const createTable = require('./tables/create-table.json')
const { DocumentClient, DynamoDB } = require('../__tests__/util/dynalite')

const mockTableName = 'mock-table-put-item' 

const MyTable = new Table({
  name: mockTableName,
  partitionKey: 'pk',
  sortKey: 'sk',
  DocumentClient
})

const Customer = new Entity({
  name: 'Customer',
  attributes: {
    id: { partitionKey: true },
    sk: { hidden: true, sortKey: true },
    name: { map: 'data' },
    co: { alias: 'company' },
    age: { type: 'number' },
    status: ['sk',0],
    date_added: ['sk',1],
  },
  table: MyTable
})

  
describe('put item integration test', () => {
  beforeAll(() => DynamoDB.createTable({
    TableName: mockTableName,
    ...createTable
  }).promise())

  it('should create customer record', async () => {
    advanceTo(new Date(2020, 4, 31, 0, 0, 0))
    let item = {
      id: 123,
      name: 'Jane Smith',
      company: 'ACME',
      age: 35,
      status: 'active',
      date_added: '2020-04-24'
    }
    
    await Customer.put(item)
    const scan = await DocumentClient.scan({
        TableName: mockTableName
    }).promise()
    expect(scan).toMatchSnapshot()
  })

})