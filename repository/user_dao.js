const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-west-1'
});

const docClient = new AWS.DynamoDB.DocumentClient();

const TABLE = "exercisebox_users";

function addUser(user) {
    const params = {
        TableName: TABLE,
        Item: user
    };
    return docClient.put(params).promise();
}

// Read
// retrieve by username
function getUser(username) {
    const params = {
        TableName: TABLE,
        KeyConditionExpression: 'username = :username',
        ExpressionAttributeValues: {
            ':username': username,
        }
    }
    const result = docClient.query(params).promise();
    return result;
}


function retrieveList() {
    const params = {
        TableName: TABLE
    }
    return docClient.scan(params).promise();
}

// field needs to be a string value
function updateByUsername(username, field, value) {
    const params = {
        TableName: TABLE,
        Key: {
            username
        },
        UpdateExpression: `set #fieldToUpdate = :value`,
        ExpressionAttributeNames: {
            '#fieldToUpdate': field
        },
        ExpressionAttributeValues: {
            ':value': value
        }
    };
    const result = docClient.update(params).promise();
    return result;

}

module.exports = { getUser, addUser, retrieveList, updateByUsername };