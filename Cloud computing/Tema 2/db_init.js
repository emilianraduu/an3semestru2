let AWS = require('aws-sdk');
const region = 'us-east-2'

AWS.config.update({region});

let ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

let params = {
    AttributeDefinitions: [
        {
            AttributeName: 'USER_ID',
            AttributeType: 'N'
        },
        {
            AttributeName: 'USER_NAME',
            AttributeType: 'S'
        }
    ],
    KeySchema: [
        {
            AttributeName: 'USER_ID',
            KeyType: 'HASH'
        },
        {
            AttributeName: 'USER_NAME',
            KeyType: 'RANGE'
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    },
    TableName: 'users',
    StreamSpecification: {
        StreamEnabled: false
    }
};

ddb.createTable(params, function (err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Table Created", data);
    }
});

params = {
    AttributeDefinitions: [
        {
            AttributeName: 'USER_ID',
            AttributeType: 'N'
        },
        {
            AttributeName: 'ROLE_NAME',
            AttributeType: 'S'
        }
    ],
    KeySchema: [
        {
            AttributeName: 'USER_ID',
            KeyType: 'HASH'
        },
        {
            AttributeName: 'ROLE_NAME',
            KeyType: 'RANGE'
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    },
    TableName: 'roles',
    StreamSpecification: {
        StreamEnabled: false
    }
};

ddb.createTable(params, function (err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Table Created", data);
    }
});
