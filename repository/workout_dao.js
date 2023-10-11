const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-west-1'
});

const  docClient = new AWS.DynamoDB.DocumentClient();

const TABLE = "exercisebox_planner";

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
        Key: {
            username
        }
    }
    return docClient.query(params).promise();
}
function addPlanner(username, date, week, completed)
{
    const params = {
        TableName: TABLE,
        Item: {
            username,
            date,
            week,
            completed
        },
        ConditionExpression: 'attribute_not_exists(username) AND attribute_not_exists(date)' 
    };
    return docClient.put(params).promise();
}
function updatePlanner(username, date, week, completed) {
    const params = {
        TableName: TABLE,
        Key: {
            username,
            date
        },
        UpdateExpression: `set #w = :w, #c = :c`,
        ExpressionAttributeNames: {
            '#w': 'week',
            '#c': 'completed'
        },
        ExpressionAttributeValues: {
            ':w': week,
            ':c': completed
        }
    };
    const result = docClient.update(params).promise();
    return result;

}
function deletePlanner(username, date) {
    const params = {
        TableName: TABLE,
        Key: {
            username,
            date
        }
    }
    return docClient.delete(params).promise();
}
module.exports = {
    getUserPlanner,
    getAllUserPlanners,
    addPlanner,
    updatePlanner,
    deletePlanner
};