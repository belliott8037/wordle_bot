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
function setup(){
    let arbitrary_day = 254
    // set the arbitrary diff is the difference between your arbitrary_day and the length of your list
    let arbitrary_diff = 1801
    // I'm sorry there's a better way of doing this but I don't care.

    // read in file, don't use relative pathing when using a cronjob.
    const words = (fs.readFileSync("./wordle list.csv", {
        encoding: "utf-8"
    }).split(","));
    if (words[0] === ""){
        console.log("Out of words")
        return;
    }
    // console.log(words.length)
    // Let's grab the word of the day
    let todays_word: string = words[0].substring(1,6)
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
    let todays_number: number = arbitrary_day + offset
    // delete word from the list
    //words.shift()
    // update the file after stripping out WoD, don't use relative pathing when using a cronjob
    fs.writeFileSync("./wordle list.csv", words.toString());
    // Grab the date. yeah i got it off stackoverflow, sue me. https://stackoverflow.com/a/4929629
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.toLocaleString('en-us', {month: 'long'})).padStart(2, '0'); // Jan is apparently zero real smart.
    var yyyy = String(today.getFullYear())
    let dmy: string[] = [dd,mm,yyyy]
    return {
        "todays_number": todays_number as number,
        "todays_word": todays_word as string,
        "dmy": dmy as string[]
    };
}
// TODO: Try and make a promise for this function to then callback a kill function for the bot.
function main(client: DiscordJS.Client){
    let message = setup()
    client.on('ready', () => {
        // This is stupid don't judge me
        // Set the arbitrary day is the day that you are starting the bot on
        //                                                              ID token of the thread
        const archive_thread: ThreadChannel = client.channels.cache.get("947959106029912065") as ThreadChannel;
        if(archive_thread === undefined)
        {
            console.log("breaking")
            return
        }
        // post WoD
        else if (typeof message?.todays_word === "string"){
        // dude typescript is so stupid you have to use tic marks ` to display variables in the strings
            archive_thread.send(`${message?.dmy[1]} ${message?.dmy[0]} ${message?.dmy[2]}\nWordle #${message?.todays_number}\n||${message?.todays_word}||`)
            // .then(message => console.log(`Sent message: ${message.content}`))
            // .catch(console.error)
        }
        else
            console.log("Error bad word, or something horrible")
            return
        })
        return new Promise(resolve => {
            setTimeout(() => {
                resolve('ye boi');
            },2000)
        })
}
let client = login();
async function logout(){
    await main(client);
    process.exit()
}
logout();

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