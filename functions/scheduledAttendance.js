require('dotenv').config();

const functions = require("firebase-functions");
const { Telegraf } = require("telegraf");
const { onSchedule } = require('firebase-functions/v2/scheduler');

const bot = new Telegraf(process.env.BOT_TOKEN, {
    telegram: { webhookReply: true },
})

const testAttendancePoll = onSchedule('* * * * *', async (event) => {
    console.log("Preparing to send test poll");
    bot.telegram.sendPoll(process.env.TEST_CHAT_ID, 'Test Poll', ['Yes', 'No'], {
        is_anonymous: false,
    });
});

module.exports = { testAttendancePoll };
