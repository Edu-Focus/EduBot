const Discord = require("discord.js");
const fs = require('fs');
const dateFr = require('../functions/datefr.js')
const staffverif = require("../functions/staffverif.js")
let banbdd = JSON.parse(fs.readFileSync("./config/ignore_users.json", "utf8"));

exports.run = async (client, message, args, key) => {
    //message.channel.send(1)
    let mention = message.mentions.users.first();
    if(!mention) return message.channel.send('Tu as oublié de mentionner un utilisateur...')
    if(mention.id === '498570647124049942' || mention.id === '498570647124049942') return message.channel.send("Je ne peux pas m'auto bannir...")
    if(mention.id === message.author.id) return message.channel.send("Tu ne peux pas t'auto bannir...")

    //message.channel.send(2)
    if(args[1]){
        var raison = message.content.split(' ').slice(2).join(' ')
    }else{
        return message.channel.send('Une raison doit être fournie...')
    }
    //message.channel.send(3)
    if(await staffverif('system_main-administrator', message.author.id) === true) return message.channel.send("Cette commande est réservée aux ``Administrateurs Système`` d'Edu-Focus")

    if(await staffverif('system_main_admin', mention.id) === true) return message.channel.send('Impossible de bannir l\'utilisateur mentionné')

    banbdd[mention.id] = {
        "username": mention.username,
        "id": mention.id,
        "banni": "1",
        "time": await dateFr(),
        "reason": raison
    }
    //message.channel.send(4)
    fs.writeFile("./config/ignore_users.json", JSON.stringify(banbdd, null, 4), (err) => {
        if(err) message.channel.send("Une erreur est survenue");
    });
    message.channel.send('Utilisateur blacklisté avec succès.')
    //message.channel.send(5)
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