const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-west-1'
});

const  docClient = new AWS.DynamoDB.DocumentClient();

const TABLE = "exercisebox_workouts";

async function getUserPlanner(username, date) {

   
    const params = {
        TableName: TABLE,
        Key: {
            username,
            date
        }
    }
    return docClient.get(params).promise();
}
async function getAllUserPlanners(username) {
    const params = {
        TableName: TABLE,
        FilterExpression: 'username = :username',
        ExpressionAttributeValues: {
            ':username': username,
        }
    }
    return docClient.scan(params).promise();
}

function addPlanner(username, exercises)
{
    const params = {
        TableName: TABLE,
        Item: {
            username,
            exercises
        }
    };
    return docClient.put(params).promise();
}
async function deleteEvent(username, exercises) {
    const params = {
        TableName: TABLE,
        Key: {
            username,
        },
        UpdateExpression: `set #e = :e`,
        ExpressionAttributeNames: {
            '#e': 'exercises'
        },
        ExpressionAttributeValues: {
            ':e': exercises
        }
    }
    return docClient.update(params).promise();
}
module.exports = {
    getUserPlanner,
    getAllUserPlanners,
    addPlanner,
    deleteEvent
};