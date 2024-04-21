// SIMPLE ENTITY w/ REQUIRED fields for testing
module.exports = {
    // Specify entity name
    name: 'SimpleEntityReq',
    // Include timestamps
    timestamps: false,
    // Define partition and sort keys
    partitionKey: 'pk',
    // Define attributes
    attributes: {
        pk: { type: 'string' },
        test: { type: 'string', required: true },
        test2: { type: 'string', required: 'always' }
    }
};
export {};
