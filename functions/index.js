const functions = require("firebase-functions");
const { Telegraf } = require("telegraf");
const cron = require("node-cron");
const fs = require("fs");

const { startAttendancePolls, stopAttendancePolls } = require('./attendanceJobs');
const { startWeatherJobs, stopWeatherJobs } = require('./weatherJobs');


const chatId = process.env.CHAT_ID;
if (typeof chatId !== "number") {
    chatId = parseInt(chatId);
}

const adminGroupId = process.env.ADMIN_GROUP_ID;
if (typeof adminGroupId !== "number") {
    adminGroupId = parseInt(adminGroupId);
}

const bot = new Telegraf(process.env.BOT_TOKEN, {
    telegram: { webhookReply: true },
})

bot.start((ctx) => {ctx.reply("Welcome!")});


bot.command("startweather", async (ctx) => {
    console.log("Chat ID used is: ", chatId);
    startWeatherJobs(bot, chatId, ctx);
});


bot.command("stopweather", (ctx) => {
    stopWeatherJobs(ctx);
});


bot.command('startattendance', (ctx) => {
    console.log("Chat ID used is: ", chatId);
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
        console.log("Feedback received: ", text);
        console.log("Chat ID used is: ", chatId);
        bot.telegram.sendMessage(adminGroupId, text);
    });
});


exports.barsnakesBot = functions.https.onRequest(
    (req, res) => bot.handleUpdate(req.body, res)
)