/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions")
const {Telegraf} = require("telegraf")

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

bot.start((ctx) => ctx.reply("Welcome!"))
bot.hears('hi', (ctx) => ctx.reply('Hey there!'))

exports.echoBot = functions.https.onRequest(
    (req, res) => bot.handleUpdate(req.body, res)
)