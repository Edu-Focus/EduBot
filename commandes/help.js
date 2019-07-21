const Discord = require("discord.js");
const request = require('request-promise');

module.exports.run = async (bot, message, args, key) => {
    var embedd = new Discord.RichEmbed({
        "title": `Page d'aide`,
        "fields": [
          {
            "name": "Commandes réservés au staff d'Edu-Focus",
            "value": "EF!userinfo {pseudonyme} => Donne les informations d'un compte Edu-Focus",
            //"inline": true
          },
        ]
      })
    message.channel.send(embedd) 

}



module.exports.help = {
    name: "help"
}