// This is a small library for turning RSS XML feed into Javascript Object
import Parser from "rss-parser";

import { bot } from "./bot.js";

import { InlineKeyboard } from 'grammy';
// import {sleep}
import { updatePost, getPost, getChats } from "./db.js"
let parser = new Parser()


// *******************
export function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
// *******************



export async function getWebsitePosts() {
  let feed = await parser.parseURL('https://hindi.idronline.org/feed/');

  

// console.log(feed.items[3].guid)
  let FirstguId=feed.items[0].guid
  // console.log("GUID---"+FirstguId)
  let result =  await getPost()

let dbGuid = result.guidIndex
  if(FirstguId != dbGuid){
    const dbpostIndex = feed.items.map(items => items.guid).indexOf(dbGuid);
        await updatePost(FirstguId);

    // Loop all posts above that Index.
    const allChats = await getChats();

    for(let i=dbpostIndex-1; i>=0; i--){


      // for (let i = 0; i < updateNum; i++) {
        for (let chat of allChats) {
          // console.log(chat._id)
          // taking the all chat id's here
          try {
    
            await bot.api.sendMessage(chat._id,` <b><a href="${feed.items[i].link}">${feed.items[i].title}</a></b> 
            \n लेखक :- <i>${feed.items[i].creator}</i> \n\n <i>${feed.items[i].content.replace(/<[^>]*>?/gm, '').slice(0, 300)}...<a href="${feed.items[i].link}">और पढ़े </a></i>`,
              {
                parse_mode: "HTML",
                disable_web_page_preview: true,
                reply_markup: new InlineKeyboard().url(
                  "पोस्ट पढ़े",
                  `${feed.items[i].link}`,
                )
              })

              await sleep(2000);

          } catch (e) {
            console.log(e);
          }
    
        }
    
      }
  }


  
}

//  await  getWebsitePosts()
