// To start the bot use the command set-executionpolicy remotesigned in admin privilege powershell type "y"
// Then use the command ts-node index.ts
// Be sure to add the bot's token in the .env file
import DiscordJS, { Base, Channel, Intents, Options, TextChannel, ThreadChannel } from 'discord.js'
import dotenv from 'dotenv'
import fs from 'fs';

function login(){
    dotenv.config()
    const client = 
    new DiscordJS.Client({
        intents:[
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES
            // Intents.FLAGS.GUILD_MESSAGE_REACTIONS
        ]
    })
    client.login(process.env.TOKEN)
    return client
}
function main(client: DiscordJS.Client){
    // This is stupid don't judge me
    // Set the arbitrary day is the day that you are starting the bot on
    let arbitrary_day = 252
    // set the arbitrary diff is the difference between your arbitrary_day and the length of your list
    let arbitrary_diff = 1805
    // I'm sorry there's a better way of doing this but I don't care.

    // read in file
    const words = (fs.readFileSync("./wordle list.csv", {
        encoding: "utf-8"
    }).split(","));
    if (words[0] === ""){
        console.log("Out of words")
        return;
    }
    // Let's grab the word of the day
    let todays_word = words[0].substring(1,6)
    // Let's do some stupid math
    if (words.length < arbitrary_day){
        var modifier = words.length + arbitrary_diff
    }
    else{
        var modifier = words.length - arbitrary_diff 
    }
    // Get the offset to add
    let offset = arbitrary_day - modifier
    // Calculate the number
    let todays_number = arbitrary_day + offset
    // delete word from the list
    words.shift()
    // update the file after stripping out WoD
    fs.writeFileSync("./Test wordles.csv", words.toString());
    // Grab the date. yeah i got it off stackoverflow, sue me. https://stackoverflow.com/a/4929629
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.toLocaleString('en-us', {month: 'long'})).padStart(2, '0'); // Jan is apparently zero real smart.
    var yyyy = today.getFullYear()

    // client.on('ready', () => {
        //                                                             ID token of the thread
    const archive_thread: ThreadChannel = client.channels.cache.get("947220226561437706") as ThreadChannel;
    // console.log("The bot is ready")   
    if(!archive_thread.isThread()){
        console.log("Channel is not a thread")
        return
    }
    // post WoD
    else if (typeof todays_word === "string"){
        // dude typescript is so stupid you have to use tic marks ` to display variables in the strings
        archive_thread.send(`${mm} ${dd} ${yyyy}\nWordle #${todays_number}\n||${todays_word}||`)
        return
    }
    else
        console.log("Error bad word, or something horrible")
        return
        
    // })
    // return
}
// login once
let client = login();
// set a timer for posting for once a day lol
setInterval(main, 86400000, client);
// setTimeout(() => {clearInterval(timerId); console.log("stop");}, 10001);

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