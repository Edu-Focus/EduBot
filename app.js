const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client();
const config = require("./botconfig.json");
bot.commands = new Discord.Collection();
let prefix = ("EF!");

fs.readdir("./commandes/", (err, files) => {
    if(err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0){
        console.log("Les fichiers commandes n'ont pas été trouvés");
        return;
    }

    jsfile.forEach((f, i) =>{
        let props = require(`./commandes/${f}`);
        console.log(`${f} a bien été chargé`)
        bot.commands.set(props.help.name, props);
    });
});

bot.login(config.token)
const key = config.api_key

bot.on("ready", async () => {
    console.log('index.js a bien été chargé')
    console.log(`${bot.user.username} est maintenant en ligne`);
    bot.user.setGame("Edu-Focus, tout le monde a le droit d'apprendre !")
});

bot.on ("message", message => {
    if(message.author.bot) return
    if (message.channel.type === "dm") return

    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if(commandfile) commandfile.run(bot,message,args,key);

    if(cmd === (prefix + "ping")){
        message.channel.send("Pong")
    } 
});