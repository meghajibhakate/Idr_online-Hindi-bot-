// Importing MongoClient class from mongodb
import { MongoClient } from "mongodb";

// Importing dotenv
import * as dotenv from 'dotenv'
//Colling the dotenv.config
dotenv.config()

async function main() {
    // Taking URL from MongoDB
    const mongo_url = process.env.MONGODB_URL;
    const client = new MongoClient(mongo_url);

    try {
        await client.connect()
        console.log("Connected to DataBase");
        const dataBase = client.db("IdrOnline_Hindi");
        return dataBase;
    } catch (error) {
        console.error(`Showing ${error} this error to connecting with database`)
    }
}

const db = await main();

const posts = db.collection("post")


export async function updatePost(num) {

    //Here I am updating data
    await posts.updateOne({
        _id: "postData"
    },
        {
            $set: {
                totalpost: num
            }
        }).then(() => {
            return true;
        }).catch((er) => {
            console.log(`Unable to add posts Number in DB: ${er}`);
            return false;
        });
}

// getPost(11)

export async function getPost() {
    const postData = await posts.findOne({
        _id: "postData"
    })
    return postData;
}





// 2nd collection *******************
const chats = db.collection("chats")

// export async function addChat(chatId, chatName,  chaType) {
//     await chats.insertOne(
//         {
//             _id: chatId,
//             Tital: chatName,
//             type: chaType

//         }).then(() => {
//             return true;
//         }).catch((er) => {
//             console.log(`Unable to add chatID in DataBase:- ${er}`);
//             return false;
//         })
// }

export async function addChat(chatId, chatName,  chaType) {
    const item = await chats.findOne({ _id: chatId });
    if (item) return false;

    await chats.insertOne(
        {
            _id: chatId,
            Tital: chatName,
            type: chaType

        }).then(() => {
            return true;
        }).catch((er) => {
            console.log(`Unable to add chatID in DataBase:- ${er}`);
            return false;
        })
}



export async function getChats(){
    const allChatsArray = await chats.find({ _id: { $ne: null } }).toArray();
    return allChatsArray;

}

// await getChats();

export async function removeChat(chatId){
    // check if same User already exists.
    const item = await chats.findOne({ _id: chatId });
    if (!item) return false;
  
    // if yes, rem frm db.
    await chats.deleteOne({
      _id: chatId
    }).catch((err) =>{
        console.log(`Unable to remove chat frm DB: ${err}`);
    })
    
  }