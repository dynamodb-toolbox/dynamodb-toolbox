import Table from '../../classes/Table';
import { DocumentClient } from '../bootstrap-tests';

export default new Table({
  name: 'test-table',
  partitionKey: 'pk',
  sortKey: 'sk',
  DocumentClient
})
