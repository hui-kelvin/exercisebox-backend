
//just testing for muslces as a query parameter
async function getExercises() {
const url = 'https://exercises-by-api-ninjas.p.rapidapi.com/v1/exercises';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '0a1b13841dmshb7a1bdc943b5d52p1bb7a8jsn8df047ef9818',
		'X-RapidAPI-Host': 'exercises-by-api-ninjas.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.text();
	return result;
} catch (error) {
	console.error(error);
}
}

module.exports = {
    getExercises
};