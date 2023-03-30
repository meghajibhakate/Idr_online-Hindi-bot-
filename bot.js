//here we are Importing a BOT and InlineKeyboard class from Grammy library
// Bot this is a class
// InlineKeyboard this is a class
import { Bot, InlineKeyboard , GrammyError,  HttpError } from 'grammy';

import * as dotenv from 'dotenv'
import { getChats } from './db.js';

//Colling the dotenv.config
dotenv.config()

// Create an instance of the `Bot` class and pass your token to it.
export const bot = new Bot(process.env.BOT_TOKEN_KEY);// <-- put your unique token;

// Importing a node cron from node-cron library

import cron from "node-cron"//This node cron helps with creating and managing schedules.

// Importing getPosts function from method.js 
import { getWebsitePosts, sleep } from './method.js';

// Importing  addChat function from ./db.js 
import { addChat, removeChat } from "./db.js";

//It's telling the computer to run a certain set of instructions whenever someone types the "start" command in bot.
bot.command("start", async ctx => {
    bot.api.sendMessage(ctx.message.from.id, "अब आप वापस नहीं जा सकते है 😊 और उम्मीद है आप भी हमारी तरह उत्साहित होंगे।अब आप IDR से सीधे अपने डीएम में अपडेट प्राप्त कर सकते हैं।",
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
            await bot.api.sendMessage(ctx.myChatMember.chat.id, "मुझे इस ग्रुप जोड़ने के लिए शुक्रया 🙏 \nयह बोट आपको आपकी पसंदीदा वेबसइट IDR से नयी पोस्ट की अपडेट देगा 😊| "
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
// *****************************


bot.command("jrbc").filter(
    async (ctx) =>{
        // check if the command is from admin & is a reply.
        return ctx.message.reply_to_message && ctx.message.from.id === 1004813228;
    },
    async (ctx) => {
        // Get all subcribers from database.
        const allChats = await getChats();
        // store the success and failed data in broadcast
        const failedChats = [];
        const successChats = [];
        for (let chat of allChats) {
            // Broadcast to chats
            try {
                await bot.api.copyMessage(chat._id,ctx.message.chat.id, ctx.message.reply_to_message.message_id);
                successChats.push(chat._id);
                await sleep(3000);
            } catch (e) {
                failedChats.push(chat._id);
                console.log(e);
            }
      
        }
        // after broadcast show the statistics to admin.
        await bot.api.sendMessage(1004813228,`Broadcast completed with ${successChats.length} users. Failed count ${failedChats.length}`);
        await bot.api.sendMessage(1004813228,`Success: ${successChats.toString()} \n Fail: ${failedChats.toString()}`);

        
    }
);
// *****************************





// await  getWebsitePosts()

// scheduling timing for updateNum
//  Taking update in every 10 minutes.....
cron.schedule('*/10 * * * *', async () => {
  await  getWebsitePosts()


});


bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
      console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
      console.error("Could not contact Telegram:", e);
    } else {
      console.error("Unknown error:", e);
    }
  });

//calling the bot function
bot.start()
