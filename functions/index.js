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

var weatherJob;

bot.command("startweather", async (ctx) => {
    ctx.reply("Starting scheduled weather reports");
    // Read from AccuWeather API
    // const data = await weatherAPI.getCurrentConditions();

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
        ctx.reply("Stopping scheduled weather reports");
    } else {
        ctx.reply("Scheduled weather reports not started");
    }
});

var tueAttendanceJob;
var satAttendanceJob;
var testAttendanceJob;

bot.command("startattendance", (ctx) => {
    ctx.reply("Starting scheduled attendance poll");
    tueAttendanceJob = cron.schedule("0 9 * * MON", () => {
        const pollQuestion = "Tues Workout";
        const pollOptions = ["Yes@Tues", "Yes@Wed", "OTOT", "Busy"];

        bot.telegram.sendPoll(-817325123, pollQuestion, pollOptions, {
            is_anonymous: false
        });
    });

    satAttendanceJob = cron.schedule("0 9 * * FRI", () => {
        const pollQuestion = "Sat Workout";
        const pollOptions = ["Yes", "OTOT", "Busy"];

        bot.telegram.sendPoll(-817325123, pollQuestion, pollOptions, {
            is_anonymous: false
        });
    });

    // testAttendanceJob = cron.schedule("* * * * *", () => {
    //     const pollQuestion = "Test Poll";
    //     const pollOptions = ["Yes", "No"];

    //     bot.telegram.sendPoll(-817325123, pollQuestion, pollOptions, {
    //         is_anonymous: false
    //     });
    // }
    // );
});


bot.command("stopattendance", (ctx) => {
    if (tueAttendanceJob) {
        tueAttendanceJob.stop();
        ctx.reply("Stopping Tuesday attendance poll");
    }
    if (satAttendanceJob) {
        satAttendanceJob.stop();
        ctx.reply("Stopping Saturday attendance poll");
    }
    if (testAttendanceJob) {
        testAttendanceJob.stop();
        ctx.reply("Stopping test attendance poll");
    }
    if (!tueAttendanceJob && !satAttendanceJob) {
        ctx.reply("No attendance polls running");
    }
});


exports.barsnakesBot = functions.https.onRequest(
    (req, res) => bot.handleUpdate(req.body, res)
)