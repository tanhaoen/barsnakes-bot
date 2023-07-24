require('dotenv').config();

const functions = require("firebase-functions");
const { Telegraf } = require("telegraf");
const { onSchedule } = require('firebase-functions/v2/scheduler');
const { AccuWeather } = require("./modules/weather_api.js");

const weatherAPI = new AccuWeather(process.env.ACCUWEATHER_API_KEY);

const bot = new Telegraf(process.env.BOT_TOKEN, {
    telegram: { webhookReply: true },
})

async function weatherReport (bot, chatId) {
    // Read from AccuWeather API
    let data = await weatherAPI.getCurrentConditions();
    data = data[0];

    let precip1Hr = data.Precip1hr.Metric.Value;
    let precip1HrStatus = null;

    if (precip1Hr < 0.1) {
        precip1HrStatus = false;
    } else if (precip1Hr <= 2.5) {
        precip1HrStatus = "light rain";
    } else if (precip1Hr <= 7.6) {
        precip1HrStatus = "moderate rain";
    } else {
        precip1HrStatus = "heavy rain";
    }

    let msg = "";
    let rainFlag = false;

    if (data.HasPrecipitation && precip1Hr) {
        msg += `Currently raining at Serangoon, with ${precip1HrStatus} over the past hour (1hr total: ${precip1Hr}mm))`;
        rainFlag = true;
    } else if (data.HasPrecipitation && !precip1Hr) {
        msg += `Currently raining at Serangoon`;
        rainFlag = true;
    } else if (!data.HasPrecipitation && precip1Hr) {
    msg += `Currently not raining at Serangoon, but ${precip1HrStatus} over the past hour. Floor may be wet! (1hr total: ${precip1Hr}mm))`;
    } else {
        msg += `No rain at Serangoon! (1hr total: ${precip1Hr}mm)))`;
    }

    if (data.IsDayTime && !rainFlag) {
        msg += `\nTemperature is ${data.Temperature.Metric.Value}`
        msg += `\nUV Index is ${data.UVIndexText.toLowerCase()}`;
    }

    bot.telegram.sendMessage(chatId, msg)
}


const tueWeatherReport1 = onSchedule({
    schedule: '0 17 * * TUE',
    timeZone: 'Asia/Singapore',
    }, async (event) => {
    console.log("Preparing to send Tuesday weather report 1");
    await weatherReport(bot, process.env.CHAT_ID);
});

const tueWeatherReport2 = onSchedule({
    schedule: '0 18 * * TUE',
    timeZone: 'Asia/Singapore',
    }, async (event) => {
    console.log("Preparing to send Tuesday weather report 2");
    await weatherReport(bot, process.env.CHAT_ID);
});

const satWeatherReport1 = onSchedule({
    schedule: '0 9 * * SAT',
    timeZone: 'Asia/Singapore',
    }, async (event) => {
    console.log("Preparing to send Saturday weather report 1");
    await weatherReport(bot, process.env.CHAT_ID);
});

const satWeatherReport2 = onSchedule({
    schedule: '0 10 * * SAT',
    timeZone: 'Asia/Singapore',
    }, async (event) => {
    console.log("Preparing to send Saturday weather report 2");
    await weatherReport(bot, process.env.CHAT_ID);
});

module.exports = { tueWeatherReport1, tueWeatherReport2, satWeatherReport1, satWeatherReport2 };
