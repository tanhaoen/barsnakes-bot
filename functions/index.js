const functions = require("firebase-functions");
const { Telegraf } = require("telegraf");
const cron = require("node-cron");
const fs = require("fs");

const { startAttendancePolls, stopAttendancePolls } = require('./attendanceJobs');
const { startWeatherJobs, stopWeatherJobs } = require('./weatherJobs');


const chatId = -817325123;

const bot = new Telegraf(process.env.BOT_TOKEN, {
    telegram: { webhookReply: true },
})

bot.start((ctx) => {ctx.reply("Welcome!")});


bot.command("startweather", async (ctx) => {
    startWeatherJobs(bot, chatId, ctx);
});


bot.command("stopweather", (ctx) => {
    stopWeatherJobs(ctx);
});


bot.command('startattendance', (ctx) => {
    startAttendancePolls(bot, chatId, ctx);
});


bot.command('stopattendance', (ctx) => {
    stopAttendancePolls(ctx);
});


bot.command("feedback", (ctx) => {
    ctx.reply("What improvements or suggestions do you have?");
    bot.on("text", (ctx) => {
        const { text } = ctx.message;
        ctx.reply("Thank you for your feedback!");
        bot.telegram.sendMessage(-817325123, text);
    });
});


exports.barsnakesBot = functions.https.onRequest(
    (req, res) => bot.handleUpdate(req.body, res)
)