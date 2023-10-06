const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-west-1'
});

const  docClient = new AWS.DynamoDB.DocumentClient();

const TABLE = "exercisebox_users";

async function getUserPlanner(username) {
    const params = {
        TableName: TABLE,
        Key: {
            username
        }
    }
    return docClient.get(params).promise();
}

function updateWeek(username, week) {
    const params = {
        TableName: TABLE,
        Key: {
            username
        },
        UpdateExpression: `set #w = :w`,
        ExpressionAttributeNames: {
            '#w': 'week',
        },
        ExpressionAttributeValues: {
            ':w': week,
        },
        ConditionExpression: '!contains(#w, :w)'
    };
    const result = docClient.update(params).promise();
    return result;

}
function updateCompleted(username, completed) {
    const params = {
        TableName: TABLE,
        Key: {
            username
        },
        UpdateExpression: `set  #c = :c`,
        ExpressionAttributeNames: {
            '#c': 'completed'
        },
        ExpressionAttributeValues: {
            ':c': completed
        },
        ConditionExpression: '!contains(#c, :c)'
    };
    const result = docClient.update(params).promise();
    return result;

}

module.exports = {
    getUserPlanner,
    updateWeek,
    updateCompleted
};