//here we are Importing a BOT and InlineKeyboard class from Grammy library
// Bot this is a class
// InlineKeyboard this is a class
import { Bot, InlineKeyboard } from 'grammy';

import * as dotenv from 'dotenv'

//Colling the dotenv.config
dotenv.config()

// Create an instance of the `Bot` class and pass your token to it.
export const bot = new Bot(process.env.BOT_TOKEN_KEY);// <-- put your unique token;

// Importing a node cron from node-cron library

import cron from "node-cron"//This node cron helps with creating and managing schedules.

// Importing getPosts function from method.js 
import { getWebsitePosts } from './method.js';

// Importing  addChat function from ./db.js 
import { addChat } from "./db.js";

//It's telling the computer to run a certain set of instructions whenever someone types the "start" command in bot.
bot.command("start", async ctx => {
    bot.api.sendMessage(ctx.message.from.id, "अब आप वापस नहीं जा सकते है 😊 और उम्मीद है आप भी हमारी तरह उत्साहित होंगे।अब आप idr से सीधे अपने डीएम में अपडेट प्राप्त कर सकते हैं।",
        {
            reply_to_message_id: ctx.message.message_id,
            reply_markup: new InlineKeyboard().url(
                "क्लीक करे ",
                `https://hindi.idronline.org/`,
            )
        })
    //add new users to DB
    if (ctx.message.chat.type === 'private') {
        await addChat(ctx.message.from.id, ctx.message.from.first_name, ctx.message.chat.type)
    }

});


bot.command("donate", async ctx => {
    bot.api.sendMessage(ctx.message.from.id, `इस लिंक के मदत से IDR को Donate करे| https://idronline.org/donate/`,
        {
            reply_to_message_id: ctx.message.message_id,
            disable_web_page_preview: true,
            reply_markup: new InlineKeyboard().url(
                "Donate करे ",
                `https://idronline.org/donate/`,
            )
        })
    
});





bot.on("my_chat_member", async ctx => {
    //console.log(ctx.myChatMember);
    if (ctx.myChatMember.chat.type === 'private') {
        if (ctx.myChatMember.old_chat_member.status === "member" && ctx.myChatMember.new_chat_member.status === "kicked") {
            //remove user from database
            await removeChat(ctx.myChatMember.from.id)
        }
    } else if (bot.botInfo.id == ctx.myChatMember.new_chat_member.user.id) {
        // if me then add / remove

        if (ctx.myChatMember.new_chat_member.status == "member" || ctx.myChatMember.new_chat_member.status == "administrator") {
            // add
            //if someone add the bot in group                                   //if someone add the bot in channle
            await bot.api.sendMessage(ctx.myChatMember.chat.id, "मुझे इस ग्रुप जोड़ने के लिए शुक्रया 🙏 \nयह बोट आपको आपकी पसंदीदा वेबसइट idr से नयी पोस्ट की अपडेट देगा 😊| "
            )
            await addChat(ctx.myChatMember.chat.id, ctx.myChatMember.chat.title, ctx.myChatMember.chat.type);
        }

        else if (ctx.myChatMember.new_chat_member.status === "kicked" || ctx.myChatMember.new_chat_member.status === "left") {
            //remove
            //if someone remove the bot from group                                        //if someone remove the bot from channle

            await removeChat(ctx.myChatMember.chat.id);
        }
    }

})

// scheduling timing for updateNum
//  Taking update in every 10 minutes.....
cron.schedule('*/10 * * * *', async () => {
  await  getWebsitePosts()


});


//calling the bot function
bot.start()
