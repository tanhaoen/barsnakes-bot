require('dotenv').config();
const { testAttendancePoll } = require('./scheduledAttendance');
const { testWeatherReport } = require('./scheduledWeather');
const { testBarsnakesBot } = require('./pushFunctions');

module.exports = {
    testAttendancePoll,
    testWeatherReport,
    testBarsnakesBot
};
