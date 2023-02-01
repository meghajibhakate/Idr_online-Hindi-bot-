
import Parser from "rss-parser";
import { bot } from "./bot.js";
import fs from 'fs';
import { InlineKeyboard } from 'grammy';
import{updatePost, getPost} from "./db.js"


let parser = new Parser()


export async function getWebsitePosts() {
  let feed = await parser.parseURL('https://idronline.org/feed/');
  // console.log(feed.items);
  let allpost = feed.items.length
  let latestnum = allpost
  console.log("latestnum    " + latestnum);

  // let data = fs.readFileSync("./file.json")
  // let jsondata = JSON.parse(data)
  let data = await getPost();
  let lastpost = data.totalpost;
  let updateNum = 0

  if (latestnum != lastpost) {
    updateNum = latestnum - lastpost;
    console.log(updateNum);
    // fs.writeFileSync("./file.json", JSON.stringify(jsondata))
    await updatePost(latestnum);
  }






  for (let i = 0; i < updateNum; i++) {
    await bot.api.sendMessage(5636179119, ` <b><a href="${feed.items[i].link}">${feed.items[i].title}</a></b> 
    \n by:- <i>${feed.items[i].creator}</i> 
    \n\n <i>${feed.items[i].content.replace(/<[^>]*>?/gm, '').slice(0, 300)}...<a href="${feed.items[i].link}">Read More</a></i>`, {
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup: new InlineKeyboard().url(
        "Read Post",
        `${feed.items[i].link}`,
      )
    })




  }
}
// getPosts();