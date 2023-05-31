const functions = require("firebase-functions");
const { Telegraf } = require("telegraf");
const cron = require("node-cron");

const { AccuWeather, read_sample_data } = require("./modules/weather_api.js");

const weatherAPI = new AccuWeather(functions.config().accuweather.apikey);
// const sampleData = read_sample_data();

const bot = new Telegraf(functions.config().telegram.token, {
    telegram: { webhookReply: true },
})

// // error handling
// bot.catch((err, ctx) => {
// 	functions.logger.error("[Bot] Error", err);
// 	return ctx.reply(`Ooops, encountered an error for ${ctx.updateType}`, err);
// })

// // initialize the commands
// bot.command("/start", (ctx) => ctx.reply("Hello! Send any message and I will copy it."));
// // copy every message and send to the user
// bot.on("message", (ctx) => ctx.telegram.sendCopy(ctx.chat.id, ctx.message));

// // handle all telegram updates with HTTPs trigger
// exports.echoBot = functions.https.onRequest(async (request, response) => {
// 	functions.logger.log("Incoming message", request.body)
// 	return await bot.handleUpdate(request.body, response).then((rv) => {
// 		// if it"s not a request from the telegram, rv will be undefined, but we should respond with 200
// 		return !rv && response.sendStatus(200);
// 	})
// })

bot.start((ctx) => {ctx.reply("Welcome!")});

// bot.start((ctx) => ctx.reply("Welcome!"));
// bot.hears('hi', (ctx) => ctx.reply('Hey there!'))

let weatherJob = null;

bot.command("startWeather", (ctx) => {
    const chatId = ctx.chat.id;
    console.log("Starting weekly reminders");
    ctx.reply("Starting weekly reminders on Tuesday at 4pm");
    weatherJob = cron.schedule("0 16 * * TUE", () => {
        bot.telegram.sendMessage(chatId, "Hello! It's time to submit your weekly report!");
    });
});


bot.command("stopWeather", (ctx) => {
    const chatId = ctx.chat.id;
    if (weatherJob) {
        weatherJob.stop();
        ctx.reply("Weekly reminders stopped");
    } else {
        ctx.reply("Weekly reminders not started");
    }
});


exports.echoBot = functions.https.onRequest(
    (req, res) => bot.handleUpdate(req.body, res)
)