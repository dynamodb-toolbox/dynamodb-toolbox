const { dynaliteServer, DynamoDB } = require('../util/dynalite')

const getTables = async () => {
  const { TableNames: tableNames } = await DynamoDB.listTables({}).promise()
  return tableNames || []
}

const deleteAllTables = (tables) => Promise.all(
  tables.map((TableName) => DynamoDB.deleteTable({ TableName }).promise()),
)
module.exports = async () => {
  // make sure all tables are cleaned up
  const allTables = await getTables()
  await deleteAllTables(allTables)
  dynaliteServer.close()
}
