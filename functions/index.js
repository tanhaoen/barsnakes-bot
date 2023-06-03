const functions = require("firebase-functions");
const { Telegraf } = require("telegraf");
const cron = require("node-cron");
const fs = require("fs");

const { AccuWeather } = require("./modules/weather_api.js");

const weatherAPI = new AccuWeather(functions.config().accuweather.apikey);

const bot = new Telegraf(functions.config().telegram.token, {
    telegram: { webhookReply: true },
})

bot.start((ctx) => {ctx.reply("Welcome!")});

let weatherJob = null;

bot.command("startweather", async (ctx) => {
    ctx.reply("Starting CRON job for every minute");
    // const chatId = ctx.chat.id;
    // console.log("Starting weekly reminders");
    // Read from AccuWeather API
    // const data = await weatherAPI.getCurrentConditions();
    // bot.telegram.sendMessage(-817325123, data[0].WeatherText);

    // Read sample data from sample.json (for testing to avoid exceeding API call limit)
    const jsonString = fs.readFileSync("modules/sample.json", "utf8");
    const data = JSON.parse(jsonString);

    // Setup test cron job to send every minute
    weatherJob = cron.schedule("* * * * *", () => {
        bot.telegram.sendMessage(-817325123, data.WeatherText);
    });

    // Setup cron job to send every Tuesday at 5:30pm
    // weatherJob = cron.schedule("30 17 * * TUE", () => {
    //     console.log("Sending weekly reminder");
    //     bot.telegram.sendMessage(chatId, data.WeatherText);
    // });
});


bot.command("stopweather", (ctx) => {
    if (weatherJob) {
        weatherJob.stop();
        ctx.reply("Stopping CRON job");
    } else {
        ctx.reply("CRON job not started");
    }
});


exports.echoBot = functions.https.onRequest(
    (req, res) => bot.handleUpdate(req.body, res)
)