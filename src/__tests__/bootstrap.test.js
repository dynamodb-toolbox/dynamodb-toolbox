import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
const marshallOptions = {
    // Whether to automatically convert empty strings, blobs, and sets to `null`.
    convertEmptyValues: false,
    // Whether to remove undefined values while marshalling.
    removeUndefinedValues: false,
    // Whether to convert typeof object to map attribute.
    convertClassInstanceToMap: false, // false, by default.
};
const unmarshallOptions = {
    // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
    wrapNumbers: false, // false, by default.
};
const translateConfig = { marshallOptions, unmarshallOptions };
export const DocumentClient = DynamoDBDocumentClient.from(new DynamoDBClient({
    endpoint: 'http://localhost:4567',
    region: 'us-east-1',
    credentials: {
        accessKeyId: 'test',
        secretAccessKey: 'test',
    },
}), translateConfig);
export const DocumentClientWithoutConfig = DynamoDBDocumentClient.from(new DynamoDBClient({
    endpoint: 'http://localhost:4567',
    region: 'us-east-1',
}));
export const DocumentClientWithWrappedNumbers = DynamoDBDocumentClient.from(new DynamoDBClient({
    endpoint: 'http://localhost:4567',
    region: 'us-east-1',
    credentials: {
        accessKeyId: 'test',
        secretAccessKey: 'test',
    },
}), {
    ...translateConfig,
    unmarshallOptions: {
        ...translateConfig.unmarshallOptions,
        wrapNumbers: true,
    }
});
