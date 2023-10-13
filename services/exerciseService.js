const fs = require('fs');

//const KEY = fs.readFileSync('rapidAPIkey.txt', { encoding: 'utf8', flag: 'r' });

async function getExercises(params) {
    const queryString = buildQueryString(params);

    const URL = `https://exercises-by-api-ninjas.p.rapidapi.com/v1/exercises?${queryString}`;
    const options = {
        method: 'GET',
        headers: {
            //'X-RapidAPI-Key': KEY,
            'X-RapidAPI-Host': 'exercises-by-api-ninjas.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(URL, options);
        const exercises = await response.json();
        return exercises;
    } catch (err) {
        console.log(err);
    }
}

/*----------------- HELPER FUNCTIONS -----------------*/

// Constructs the query string to pass into a URL
function buildQueryString(params) {
    const keys = Object.keys(params);
    const values = Object.values(params);
    let queryString = '';

    for (i = 0; i < keys.length; i++) {
        if (i == keys.length - 1)
            queryString += `${keys[i]}=${values[i]}`;

        else
            queryString += `${keys[i]}=${values[i]}&`;
    }

    return queryString;
}

/*--------------- END HELPER FUNCTIONS ---------------*/

module.exports = { getExercises };
