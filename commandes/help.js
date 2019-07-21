const Discord = require("discord.js");
const request = require('request-promise');

module.exports.run = async (bot, message, args, key) => {
    var embedd = new Discord.RichEmbed({
        "title": `Page d'aide`,
        "fields": [
          {
            "name": "Commandes générales",
            "value": "EF!help => Affiche cette page d'aide\nEF!staff => Affiche les membres du staff d'Edu-Focus",
            //"inline": false
          },
          {
            "name": "Commandes réservés au staff d'Edu-Focus",
            "value": "EF!userinfo {pseudonyme} => Affiche toutes les informations sur l'utilisateur déterminé"
          }
        ]
      })
    message.channel.send(embedd) 

}



module.exports.help = {
    name: "help"
}
