class AccuWeather {
    // Read from AccuWeather API
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.locationKey = "1569686";
    }
    
    getCurrentConditions() {
        // Setup query params
        const params = new URLSearchParams({
            apikey: this.apiKey,
            details: true,
        });
        return fetch(`http://dataservice.accuweather.com/currentconditions/v1/${this.locationKey}?${params}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                return data;
            })
            .catch(error => console.log(error));
    }
}

// ---------------------------------------------

const read_sample_data = () => {
    // Read sample data from sample.json
    const fs = require('fs');
    fs.readFile('sample.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err);
            return;
        }
        console.log('File data:', jsonString);
        const data = JSON.parse(jsonString);

        return data;
    });
};

module.exports = { AccuWeather, read_sample_data };