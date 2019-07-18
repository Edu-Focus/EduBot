const Discord = require("discord.js");
const request = require('request-promise');

module.exports.run = async (bot, message, args, id, name, key) => {

    console.log('user_info')
    var wait = message.channel.send("Demande d'informations au serveur d'Edu-Focus en cours")
}

module.exports.help = {
    name: "unserinfo"
}