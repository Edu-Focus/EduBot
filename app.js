const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client();
const config = require("./botconfig.json");
bot.commands = new Discord.Collection();
let prefix = ("Edu-Focus,");

fs.readdir("./commandes/", (err, files) => {
    if(err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0){
        console.log("Une erreur est survenue lors du chargement des fichiers de commande");
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
    bot.user.setGame("Edu-Focus, on a tous le droit d'apprendre")
});

bot.on ("message", message => {
    if(message.author.bot) return
    if (message.channel.type === "dm") return

    let messageArray = message.content.split(" ");
    let cmd = messageArray[1];
    let args = messageArray.slice(1);

    var id = message.author.id
    var name = message.author.username
    
    let commandfile = bot.commands.get(cmd);
    if(commandfile) commandfile.run(bot,message,args,id,name,key);

    if(cmd === ("ping")){
        message.channel.send("pong")
    } 
    console.log(cmd)
});