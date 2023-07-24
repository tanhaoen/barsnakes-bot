require('dotenv').config();

const functions = require("firebase-functions");
const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN, {
    telegram: { webhookReply: true },
});

bot.command("feedback", (ctx) => {
    ctx.reply("What improvements or suggestions do you have?");
    bot.on("text", (ctx) => {
        const { text } = ctx.message;
        ctx.reply("Thank you for your feedback!");
        console.log("Feedback received: ", text);
        console.log("Chat ID used is: ", process.env.CHAT_ID);
        bot.telegram.sendMessage(process.env.ADMIN_GROUP_ID, text);
    });
});

const testBarsnakesBot = functions.https.onRequest(
    (req, res) => bot.handleUpdate(req.body, res)
)

module.exports = { testBarsnakesBot };