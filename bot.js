//here we are Importing a BOT and InlineKeyboard from Grammy library
import { Bot, InlineKeyboard } from 'grammy';
import * as dotenv from 'dotenv'
//Colling the dotenv.config
dotenv.config()

// Create an instance of the `Bot` class and pass your authentication token to it.
export const bot = new Bot( process.env.BOT_TOKEN_KEY);// <-- put your unique token between the "Token wiil be here"

// Importing a node cron from "node-cron" library

import cron from "node-cron"//This node cron helps with creating and managing schedules.

// I getPosts function from method.js 
import { getWebsitePosts } from './method.js';
import { addChat,  } from "./db.js";


//It's telling the computer to run a certain set of instructions whenever someone types the "start" command in bot.
bot.command("start", async ctx => {
    bot.api.sendMessage(ctx.message.from.id, "अब आप वापस नहीं जा सकते है 😊 और उम्मीद है आप भी हमारी तरह उत्साहित होंगे।अब आप idr से सीधे अपने डीएम में अपडेट प्राप्त कर सकते हैं।",
        {
            reply_to_message_id: ctx.message.message_id,
            reply_markup: new InlineKeyboard().url(
                "क्लीक करे ",
                `https://idronline.org`,
            )
        })
    //add new users to DB
    if (ctx.message.chat.type === 'private') {
        await addChat(ctx.message.from.id, ctx.message.from.first_name, ctx.message.chat.type)
    }

});



bot.on("my_chat_member", async ctx => {
    // console.log(ctx.myChatMember);
    if (ctx.myChatMember.new_chat_member.status == "member" && ctx.myChatMember.old_chat_member.status == "left") {
        if (bot.botInfo.id == ctx.myChatMember.new_chat_member.user.id) {
            await bot.api.sendMessage(ctx.myChatMember.chat.id, "मुझे इस ग्रुप जोड़ने के लिए शुक्रया 🙏 \nयह बोट आपको आपकी पसंदीदा वेबसइट idr से नयी पोस्ट की अपडेट देगा 😊| "
            )
             await addChat(ctx.myChatMember.chat.id, ctx.myChatMember.chat.title, ctx.myChatMember.chat.type);

             await ctx.leaveChat();

        }
    }
    // addChat(ctx.myChatMember.chat.id)
})

getWebsitePosts()
cron.schedule('*/10 * * * *', () => {

});


//calling the bot function
bot.start()
