describe.skip('utility functions',()=>{

  test('get/verify fields in model schema', ()=>{
    expect(TestModel.field('test_string')).toBe('test_string')
    expect(TestModel.field('email')).toBe('pk')
    expect(() => TestModel.field('not-exists')).toThrow(`'not-exists' does not exist or is an invalid alias`)
  })

  test('get partitionKey from model', ()=>{
    expect(TestModel.partitionKey()).toBe('pk')
  })

  test('get sortKey from model', ()=>{
    expect(TestModel.sortKey()).toBe('sk')
  })

})



// it('calculated fields', () => {
//
//   // Define simple model for testing
//   const CalcModel = new Model('CalcModel',{
//     // Include table name
//     table: 'calc-table',
//
//     // Include model field
//     model: false,
//
//     // Include timestamps
//     timestamps: false,
//
//     // Define partition and sort keys
//     partitionKey: 'pk',
//     sortKey: 'sk',
//
//     // Define schema
//     schema: {
//       pk: { type: 'string', alias: 'key', default: (fields) => fields.state + '#' + fields.id, hidden: false },
//       sk: { type: 'string', hidden: false }, //, default: 'testing-default' },
//       test: {
//         type: 'string',
//         coerce: false,
//         required: true,
//         default: (fields) => {
//           // console.log('FIELDS:',fields)
//           if (!fields.status) {
//             throw 'Need to provide a status'
//           }
//           // if (fields.pk === 'test-id') {
//           //   return fields.test2(fields)+'XYZ'
//           // }
//           return fields.status + '#test-default'
//         }
//       },
//       test2: {
//         type: 'string',
//         default: (fields) => {
//           // return fields.pk + '##testing'
//         },
//         onUpdate: true
//       },
//       status: { save: false },
//       // $state: ['pk','#',0],
//       // $id: ['pk','#',1]
//       // state: 'string',
//       id: 'string',
//       country: ['sk',0],//, { default: 'USA' }],
//       region: ['sk',1,'string'],
//       state: ['sk',2,'number'],// { default: () => 'MA', save: true }],
//       county: ['sk',3],
//       city: ['sk',4, { save: true }],
//       neighborhood: ['sk',5,{ type: 'string', save: false, alias:'nbhd' }],
//       status2: ['test',0],
//       test_sort: { default: (f) => `${f.country}#${f.state}#${f.city}` }
//     }
//   })
//
//   console.log(JSON.stringify(CalcModel.model(),null,2))
//
//   console.log(JSON.stringify(CalcModel.update({
//     // id: 'MA#id123',
//     status: 'active',
//     region: 'Northeast',
//     country: 'USA',
//     state: '4567',
//     city: 'Worcester',
//     county: 'WorcesterCounty',
//     // neighborhood: true,//'a string',
//     nbhd: 'Southie',//'a string',
//     id: '1234567890',
//     // sk: 'test'
//   }),null,2));
//   //
//   // console.log(JSON.stringify(CalcModel.put({
//   //   // id: 'MA#id123',
//   //   status: 'active',
//   //   region: 'Northeast',
//   //   country: 'USA',
//   //   state: 'MA',
//   //   id: '1234567890',
//   //   // sk: 'test'
//   // }),null,2));
//
//   console.log(JSON.stringify(CalcModel.parse({
//     pk: 'MA#1234567890',
//     sk: 'USA#Northeast#1234#Suffolk#Boston#true',
//     status: 'active',
//     // state: 'NH',
//     test: 'active#test-default'
//   }),null,2));
//
// })
