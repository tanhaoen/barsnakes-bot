const cron = require('node-cron');

let attendanceJobs;
let isPollsStarted;


function startAttendancePolls(bot, chatId, ctx) {
    if (isPollsStarted) {
        console.log('Attendance polls already started');
        ctx.reply('Attendance polls already started');
        return;
    }

    attendanceJobs = [];

    console.log('Starting scheduled attendance polls');
    ctx.reply('Starting scheduled attendance polls');
    const attendance = [
        // {
        //     cron: '* * * * *',
        //     question: 'Test Poll',
        //     options: ['Yes', 'No'],
        // },
        {
            cron: '0 18 * * MON',
            question: 'Tuesday Weakday',
            options: ['Yes@Tues', 'Yes@Wed', 'OTOT', 'No@Busy'],
        },
        {
            cron: '0 18 * * FRI',
            question: 'Saturday Werk',
            options: ['Yes', 'OTOT', 'Nah'],
        },
    ];

    attendance.forEach((poll) => {
        const job = cron.schedule(poll.cron, () => {
            bot.telegram.sendPoll(chatId, poll.question, poll.options, {
                is_anonymous: false,
            });
        });
        attendanceJobs.push(job);
    });

    isPollsStarted = true;
}


function stopAttendancePolls(ctx) {
    if (!isPollsStarted) {
        console.log('Scheduled attendance polls not started');
        ctx.reply('Scheduled attendance polls not started');
        return;
    }

    console.log('Stopping scheduled attendance polls');
    ctx.reply('Stopping scheduled attendance polls');
    attendanceJobs.forEach((job) => {
        job.stop();
    });
    
    attendanceJobs = []; // Clear the attendanceJobs array
    isPollsStarted = false;
}

module.exports = { startAttendancePolls, stopAttendancePolls };
