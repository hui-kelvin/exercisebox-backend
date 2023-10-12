const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-west-1'
});

const {google} = require('googleapis');
require('dotenv').config();
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.PORT
);
const  docClient = new AWS.DynamoDB.DocumentClient();

const TABLE = "exercisebox_planner";
const USERTABLE = "exercisebox_user";

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
async function getRefreshToken(username) {
    const params = {
        TableName: USERTABLE,
        Key: {
            username
        }
    }
    return docClient.query(params).promise();
}
async function addPlanner(username, date, week, completed, REFRESH_TOKEN)
{
    oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN});
    const calendar = google.calendar('v3');
    for(const day in week){
        let count = 0;
        for(const exercise of week[day].exercises)
        {
            date.setDate(date.getDate()+count)
            const description = `Equipment: ${exercise.equipment}\n
                                 Instructions: ${exercise.instructions}`
            const response = await calendar.events.insert({
                auth: oauth2Client,
                calendarId: 'primary',
                requestBody: {
                    summary: exercise.name,
                    description: description,
                    locked: true,
                    colorId: '10',
                    start: {
                        dateTime: new Date(date)
                    },
                    end: {
                        dateTime: new Date(date)
                    },
                },
            })

        }
        count++;
    }

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
async function updatePlanner(username, date, week, completed) {
    oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN});
    const calendar = google.calendar('v3');
    for(const day in week){
        let count = 0;
        for(const exercise of week[day].exercises)
        {
            date.setDate(date.getDate()+count)
            const description = `Equipment: ${exercise.equipment}\n
                                 Instructions: ${exercise.instructions}`
            const response = await calendar.events.update({
                auth: oauth2Client,
                calendarId: 'primary',
                requestBody: {
                    summary: exercise.name,
                    description: description,
                    locked: true,
                    colorId: '10',
                    start: {
                        dateTime: new Date(date)
                    },
                    end: {
                        dateTime: new Date(date)
                    },
                },
            })

        }
        count++;
    }
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
    getRefreshToken,
    addPlanner,
    updatePlanner,
    deletePlanner
};