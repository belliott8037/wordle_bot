// To start the bot use the command set-executionpolicy remotesigned in admin privilege powershell type "y"
// Then use the command ts-node index.ts
// Be sure to add the bot's token in the .env file
import DiscordJS, { Base, Channel, Intents, Options, TextChannel, ThreadChannel } from 'discord.js'
import dotenv from 'dotenv'
import fs from 'fs';
dotenv.config()

// read in file
const words = (fs.readFileSync("./Test wordles.csv", {
    encoding: "utf-8"
}).split(","));
// craft a queue
const the_queue = [];
for (var index in words){
    the_queue.push(words[index]);
}
// grab the word of the day
let todays_word = the_queue.shift();
// update the file after stripping out WoD
fs.writeFileSync("./Test wordles.csv", the_queue.toString());

const client = new DiscordJS.Client({
    intents:[
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
        // Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ]
})
client.on('ready', () => {
    //                                                             ID token of the thread
    const archive_thread: ThreadChannel = client.channels.cache.get("944764856672862269") as ThreadChannel;
    console.log("The bot is ready")   
    if(!archive_thread.isThread()){
        console.log("Channel is not a thread")
        return
    }
    // post WoD
    else if (typeof todays_word === "string"){
        archive_thread.send(todays_word)
    }
    else
        console.log("Error bad word, or something horrible")
})
// This is just messing around with a certain message "ping" is found in a channel then replys/reacts
// client.on("messageCreate", (message) => {
//     const archive_thread: TextChannel = client.channels.cache.get("944764856672862269") as TextChannel;
//     if (message.content === "ping"){
//         message.reply({
//             content: "pong"
//         })
//         // thumbsup emoji
//         message.react("%F0%9F%91%8D")
//         //archive_thread.send("please kill me")
//         console.log(archive_thread)
//     }
// }
// )
// TOKEN name needs to match the variable name you chose in the .env file
client.login(process.env.TOKEN)
