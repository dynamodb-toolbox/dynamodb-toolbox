// @xts-nocheck
import { GenericContainer } from 'testcontainers';
import * as AWS from 'aws-sdk';

import { createTableParams } from './bootstrap-tests';
import { Table, Entity } from '../index'
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

let container: any;

let TestTable: Table,
  TestEntity: Entity<{}>;

const dynamodbLocalVersion = process.env.TEST_LOCAL_DYNAMO_DB_VERSION || 'latest';
const dynamoPort = 8000;

describe('transactGetIntegration', () => {
  jest.setTimeout(30000);

  beforeAll(async () => {
    container = await new GenericContainer('amazon/dynamodb-local', dynamodbLocalVersion)
      .withExposedPorts(dynamoPort)
      .start();

    const mappedPort = container.getMappedPort(dynamoPort);
    const host = container.getHost();

    const endpoint = `http://${host}:${mappedPort}`;

    // Configure the AWS SDK so that it doesn't get mad
    AWS.config.region = 'us-east-1';

    // @ts-ignore
    AWS.config.endpoint = new AWS.Endpoint(endpoint);

    const params = {
      TableName: 'test-table',
      ...createTableParams
    }

    const dynamodb = new AWS.DynamoDB();
    await dynamodb.createTable(params).promise();

    const docClient = new AWS.DynamoDB.DocumentClient();

    TestTable = new Table({
      name: 'test-table',
      alias: 'testTable',
      partitionKey: 'pk',
      sortKey: 'sk',
      indexes: { GSI1: { partitionKey: 'GSI1pk', sortKey: 'GSIsk1' } },
      DocumentClient: docClient
    })

    TestEntity = new Entity({
      name: 'TestEntity',
      autoExecute: true,
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true },
        test: 'string'
      },
      table: TestTable
    })
  });

  afterAll(async () => {
    if (container) await container.stop();
  });

  it('returns empty item', async () => {
    const getTransactionResult = await TestTable.transactGet([
      TestEntity.getTransaction({ pk: 'test', sk: 'empty' })
    ]) as DocumentClient.TransactGetItemsOutput;

    console.log(getTransactionResult);

    expect(getTransactionResult.Responses).toBeTruthy();
    expect(getTransactionResult.Responses![0].Item).toEqual({});
  });

  it('returns an item', async () => {
    const pk = 'test';
    const sk = 'notempty';
    const test = 'abc';

    await TestEntity.put({ pk, sk, test });

    const getTransactionResult = await TestTable.transactGet([
      TestEntity.getTransaction({ pk: 'test', sk: 'notempty' })
    ]) as DocumentClient.TransactGetItemsOutput;

    expect(getTransactionResult.Responses).toBeTruthy();
    expect(getTransactionResult.Responses![0].Item!.email).toEqual(pk);
    expect(getTransactionResult.Responses![0].Item!.sort).toEqual(sk);
    expect(getTransactionResult.Responses![0].Item!.test).toEqual(test);
  });
})
