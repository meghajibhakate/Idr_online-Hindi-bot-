//here we are Importing a BOT and InlineKeyboard from Grammy library
import { Bot, InlineKeyboard } from 'grammy';

// Create an instance of the `Bot` class and pass your authentication token to it.
export const bot = new Bot("5893047012:AAED1BGBIQymEvMWf05FutBQshDAceOkRBE");// <-- put your unique token between the "Token wiil be here"

// Importing a node cron from "node-cron" library

import cron from "node-cron"//This node cron helps with creating and managing schedules.

// I getPosts function from method.js 
import { getPosts } from './method.js';


//It's telling the computer to run a certain set of instructions whenever someone types the "start" command in bot.
bot.command("start", ctx => {
    bot.api.sendMessage(ctx.message.from.id, "अब आप वापस नहीं जा सकते है 😊 और उम्मीद है आप भी हमारी तरह उत्साहित होंगे।अब आप idr से सीधे अपने डीएम में अपडेट प्राप्त कर सकते हैं।",
        {
            reply_to_message_id: ctx.message.message_id,
            reply_markup: new InlineKeyboard().url(
                "क्लीक करे ",
                `https://idronline.org`,
            )
        })

});
bot.on("my_chat_member",ctx =>{
    // console.log(ctx);
    console.log(ctx.myChatMember);

})

getPosts()
cron.schedule('*/10 * * * *', () => {

});


//calling the bot function
bot.start()
