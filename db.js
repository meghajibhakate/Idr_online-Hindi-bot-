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
// const chats = db.collection("chats")


// export async function addPost(num) {

//     // if not, add to db.
//     //Here I am inserting data first time because now the data is empty
//     await posts.insertOne({
//         _id: "postData",
//         totalpost: num
//     }).then(() => {
//         return true;
//     }).catch((er) => {
//         console.log(`Unable to add posts Number in DB: ${er}`);
//         return false;
//     });
// }
// // await addPost();



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

export async function addChat(chatId, chatName,  chaType) {
    await chats.insertOne(
        {
            _id: chatId,
            Tital: chatName,
            type: chaType

        }).then(() => {
            return true;
        }).catch((er) => {
            console.log(`Unable to add chatID in DataBase:- ${er}`);
            // console.log(${er}`);

            return false;
        })
}


export async function getChats(){
    const allChatsArray = await chats.find({ _id: { $ne: null } }).toArray();
    return allChatsArray;
    
}

// await getChats();
