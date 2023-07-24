require('dotenv').config();

const functions = require("firebase-functions");
const { Telegraf } = require("telegraf");
const { onSchedule } = require('firebase-functions/v2/scheduler');

const bot = new Telegraf(process.env.BOT_TOKEN, {
    telegram: { webhookReply: true },
})

const tueAttendancePoll = onSchedule('0 18 * * MON', async (event) => {
    console.log("Preparing to send Tuesday poll");
    bot.telegram.sendPoll(process.env.CHAT_ID, 'Tuesday Weakday', ['Yes@Tues', 'Yes@Wed', 'OTOT', 'No@Busy'], {
        is_anonymous: false,
    });
});

const satAttendancePoll = onSchedule('0 18 * * FRI', async (event) => {
    console.log("Preparing to send Saturday poll");
    bot.telegram.sendPoll(process.env.CHAT_ID, 'Saturday Werk', ['Yes', 'OTOT', 'Nah'], {
        is_anonymous: false,
    });
});

const testAttendancePoll = onSchedule('* * * * *', async (event) => {
    console.log("Preparing to send test poll");
    bot.telegram.sendPoll(process.env.CHAT_ID, 'Test Poll', ['Yes', 'No'], {
        is_anonymous: false,
    });
});

module.exports = { tueAttendancePoll, satAttendancePoll, testAttendancePoll };

// function startAttendancePolls(bot, chatId, ctx) {
//     if (isPollsStarted) {
//         console.log('Attendance polls already started');
//         ctx.reply('Attendance polls already started');
//         return;
//     }

//     attendanceJobs = [];

//     console.log('Starting scheduled attendance polls');
//     ctx.reply('Starting scheduled attendance polls');
//     const attendance = [
//         // {
//         //     cron: '* * * * *',
//         //     question: 'Test Poll',
//         //     options: ['Yes', 'No'],
//         // },
//         {
//             cron: '0 18 * * MON',
//             question: 'Tuesday Weakday',
//             options: ['Yes@Tues', 'Yes@Wed', 'OTOT', 'No@Busy'],
//         },
//         {
//             cron: '0 18 * * FRI',
//             question: 'Saturday Werk',
//             options: ['Yes', 'OTOT', 'Nah'],
//         },
//     ];

//     attendance.forEach((poll) => {
//         const job = cron.schedule(poll.cron, () => {
//             bot.telegram.sendPoll(chatId, poll.question, poll.options, {
//                 is_anonymous: false,
//             });
//         });
//         attendanceJobs.push(job);
//     });

//     isPollsStarted = true;
// }


// function stopAttendancePolls(ctx) {
//     if (!isPollsStarted) {
//         console.log('Scheduled attendance polls not started');
//         ctx.reply('Scheduled attendance polls not started');
//         return;
//     }

//     console.log('Stopping scheduled attendance polls');
//     ctx.reply('Stopping scheduled attendance polls');
//     attendanceJobs.forEach((job) => {
//         job.stop();
//     });
    
//     attendanceJobs = []; // Clear the attendanceJobs array
//     isPollsStarted = false;
// }

// module.exports = { startAttendancePolls, stopAttendancePolls };
