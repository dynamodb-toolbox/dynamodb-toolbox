// SIMPLE ENTITY w/ SORT KEY for testing
module.exports = {
    // Specify entity name
    name: 'SimpleEntitySK',
    // Include timestamps
    timestamps: false,
    // Define partition and sort keys
    partitionKey: 'pk',
    sortKey: 'sk',
    // Define attributes
    attributes: {
        pk: { type: 'string' },
        sk: { type: 'string' },
        test: { type: 'string' }
    }
};
export {};
