const Discord = require("discord.js");
const fs = require('fs');
const dateFr = require('../functions/datefr.js')
const staffverif = require("../functions/staffverif.js")
let banbdd = JSON.parse(fs.readFileSync("./config/ignore_users.json", "utf8"));

exports.run = async (client, message, args, key) => {
    let mention = message.mentions.users.first();
    if(!mention) return message.channel.send('Tu as oublié de mentionner un utilisateur...')
    if(mention.id === '498570647124049942' || mention.id === '658363805985669140') return message.channel.send("Je ne peux pas m'auto bannir...")
    if(mention.id === message.author.id) return message.channel.send("Tu ne peux pas t'auto bannir...")

    if(args[1]){
        var raison = message.content.split(' ').slice(2).join(' ')
    }else{
        return message.channel.send('Une raison doit être fournie...')
    }

    if(await staffverif('system_main_admin', message.author.id) === true) return message.channel.send("Cette commande est réservée aux ``Administrateurs Système`` d'Edu-Focus")
    
    if(await staffverif('system_main_admin', mention.id) === false) return message.channel.send('Impossible de bannir l\'utilisateur mentionné')

    banbdd[mention.id] = {
        "username": mention.username,
        "id": mention.id,
        "banni": true,
        "time": dateFr(),
        "reason": raison
    }
    fs.writeFile("./config/ignore_users.json", JSON.stringify(banbdd, null, 4), (err) => {
        if(err) message.channel.send("Une erreur est survenue");
    });
    message.channel.send('Utilisateur blacklisté avec succès.')
};

exports.conf = {
    name: "ignore",
    aliases: [],
    help: {
        category: "Modération",
        description: "Permet de mettre l'utilisateur désigné sur liste noire (le bot l'ignorera)",
        usage: "EF!ignore {mention utilisateur}"
    }
};