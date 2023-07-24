require('dotenv').config();
const { tueAttendancePoll, satAttendancePoll } = require('./scheduledAttendance');
const { tueWeatherReport1, tueWeatherReport2, satWeatherReport1, satWeatherReport2 } = require('./scheduledWeather');
const { barsnakesBot } = require('./pushFunctions');

module.exports = {
    tueAttendancePoll,
    satAttendancePoll,
    tueWeatherReport1,tueWeatherReport2,
    satWeatherReport1,satWeatherReport2,
    barsnakesBot
};
