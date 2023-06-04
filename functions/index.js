const functions = require("firebase-functions");
const { Telegraf } = require("telegraf");
const cron = require("node-cron");
const fs = require("fs");

const { AccuWeather } = require("./modules/weather_api.js");

const weatherAPI = new AccuWeather(process.env.ACCUWEATHER_API_KEY);
const chatId = -817325123;

const bot = new Telegraf(process.env.BOT_TOKEN, {
    telegram: { webhookReply: true },
})

bot.start((ctx) => {ctx.reply("Welcome!")});

let weatherJobs = [];

bot.command("startweather", async (ctx) => {
    ctx.reply("Starting scheduled weather reports");
    // Read sample data from sample.json (for testing to avoid exceeding API call limit)
    // const jsonString = fs.readFileSync("modules/sample.json", "utf8");
    // const data = JSON.parse(jsonString);

    const weatherJobTimings = [
        // "* * * * *",
        "0 17 * * TUE",
        "0 18 * * TUE",
        "0 9 * * SAT",
        "0 10 * * SAT"
    ];

    weatherJobTimings.forEach((timing) => {
        weatherJobs.push(cron.schedule(timing, async () => {
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

            if (data.HasPrecipitation && precip1Hr) { 
                bot.telegram.sendMessage(chatId, `Currently raining at Serangoon, with ${precip1HrStatus} over the past hour`);
            } else if (data.HasPrecipitation && !precip1Hr) {
                bot.telegram.sendMessage(chatId, `Currently raining at Serangoon`);
            } else if (!data.HasPrecipitation && precip1Hr) {
                bot.telegram.sendMessage(chatId, `Currently not raining at Serangoon, but ${precip1HrStatus} over the past hour. Floor may be wet!`);
            } else {
                bot.telegram.sendMessage(chatId, `All clear at Serangoon!`);
            }
        }));
    });
});


bot.command("stopweather", (ctx) => {
    if (weatherJobs) {
        weatherJobs.forEach((job) => {
            job.stop();
        });
        ctx.reply("Stopping scheduled weather reports");
    } else {
        ctx.reply("Scheduled weather reports not started");
    }
});


let tueAttendanceJob;
let satAttendanceJob;
let testAttendanceJob;

bot.command("startattendance", (ctx) => {
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