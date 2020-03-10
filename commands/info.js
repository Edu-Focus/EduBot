const Discord = require("discord.js");
const version = require("../config/config.js").version;
const StrtTime = require("../config/config.js").StrtTime;
const comprtime = require("../functions/comprtime.js")
const DateFr = require("../functions/datefr.js")

exports.run = async (client, message, args, key) => {
    const uptime = await comprtime(StrtTime, new Date())
    const embed = new Discord.RichEmbed()
    .setTitle('Informations bot')
    .addField('Version :', version, true)
    .addField('Uptime :', uptime, true)
    .addBlankField(true)
    .addField('Dev site web :', "Vasco#8049", true)
    .addField('Dev bot :', "MaitreRouge#1536", true)
    .addBlankField(true)
    .addField('Discord principal', 'https://edu-foc.us/ds', true)
    .addField('Discord sandbox', "https://edu-foc.us/sandbox", true)
    .setFooter('Message envoyé le ' + DateFr())
    message.channel.send(embed)
};

exports.conf = {
    name: "info",
    aliases: [],
    help: {
        category: "Utilitaires",
        description: "Affiche certaines information du bot",
        usage: "EF!info"
    }
};