const fs = require('fs');

class AccuWeather {
    // Read from AccuWeather API
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.locationKey = "1569686";
    }
    
    async getCurrentConditions() {
        // Setup query params
        const params = new URLSearchParams({
            apikey: this.apiKey,
            details: true,
        });
        return fetch(`http://dataservice.accuweather.com/currentconditions/v1/${this.locationKey}?${params}`)
            .then(response => response.json())
            .then(data => {
                return data;
            })
            .catch(error => console.log(error));
    }
}

// ---------------------------------------------

module.exports = { AccuWeather };