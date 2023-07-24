require('dotenv').config();

const functions = require("firebase-functions");
const { Telegraf } = require("telegraf");
const { onSchedule } = require('firebase-functions/v2/scheduler');

const bot = new Telegraf(process.env.BOT_TOKEN, {
    telegram: { webhookReply: true },
})

const tueAttendancePoll = onSchedule({
    schedule: '0 18 * * MON',
    timeZone: 'Asia/Singapore',
    }, async (event) => {
    console.log("Preparing to send Tuesday poll");
    bot.telegram.sendPoll(process.env.CHAT_ID, 'Tuesday Weakday', ['Yes@Tues', 'Yes@Wed', 'OTOT', 'No@Busy'], {
        is_anonymous: false,
    });
});

const satAttendancePoll = onSchedule({
    schedule: '0 18 * * FRI',
    timeZone: 'Asia/Singapore',
    }, async (event) => {
    console.log("Preparing to send Saturday poll");
    bot.telegram.sendPoll(process.env.CHAT_ID, 'Saturday Werk', ['Yes', 'OTOT', 'Nah'], {
        is_anonymous: false,
    });
});

module.exports = { tueAttendancePoll, satAttendancePoll };