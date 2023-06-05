const cron = require('node-cron');
const { AccuWeather } = require("./modules/weather_api.js");

const weatherAPI = new AccuWeather(process.env.ACCUWEATHER_API_KEY);

let weatherJobs;
let isJobsStarted;

function startWeatherJobs(bot, chatId, ctx) {
    if (isJobsStarted) {
        console.log('Weather jobs already started');
        ctx.reply('Weather jobs already started');
        return;
    }

    weatherJobs = [];

    console.log("Starting scheduled weather report");
    ctx.reply("Starting scheduled weather report");
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
            console.log('Weather job is triggered');
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
                msg += `Currently raining at Serangoon, with ${precip1HrStatus} over the past hour`;
                rainFlag = true;
            } else if (data.HasPrecipitation && !precip1Hr) {
                msg += `Currently raining at Serangoon`;
                rainFlag = true;
            } else if (!data.HasPrecipitation && precip1Hr) {
                msg += `Currently not raining at Serangoon, but ${precip1HrStatus} over the past hour. Floor may be wet!`;
            } else {
                msg += `No rain at Serangoon!`;
            }

            if (data.IsDayTime && !rainFlag) {
                msg += `Temperature is ${data.Temperature.Metric.Value}`
                msg += `UV Index is ${data.UVIndexText.toLowerCase()}`;
            }

            bot.telegram.sendMessage(chatId, msg)

        }));
    });

    isJobsStarted = true;
}


function stopWeatherJobs (ctx) {
    if (isJobsStarted) {
        weatherJobs.forEach((job) => {
            job.stop();
        });
        console.log("Stopping scheduled weather report");
        ctx.reply("Stopping scheduled weather report");
    } else {
        console.log("Scheduled weather reports not started");
        ctx.reply("Scheduled weather reports not started");
        return;
    }

    weatherJobs = []; // Clear the weatherJobs array
    isJobsStarted = false;
}

module.exports = { startWeatherJobs, stopWeatherJobs };