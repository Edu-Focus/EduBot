const request = require('request-promise');
const Discord = require("discord.js");
const fs = require('fs');
const gradesjs = JSON.parse(fs.readFileSync('./rankconfig.json', 'utf8'));

exports.run = async (client, message, args, key) => {
    if(args[0]) {
        const personn = args[0];
        var aut = message

        if(!/^[A-Za-z0-9_-sáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]{4,40}$/.test(personn)) {
            var reply = message.cleanContent.split('EF$rankupdate ').join('')
            return message.channel.send(`La recherche \`${reply}\` ne peut être effectuée car elle contient des caractères invalides et/ou est trop courte.`)
                .catch(function(err) {
                    return message.channel.send(`Ouah ! 2 Erreurs en même temps !\n\nLa première :\nLa recherche ne peut être effectuée car elle contient des caractères invalides et/ou est trop courte.\n\nLa Seconde :\n${err}`);
                });
        }

        const wait = message.channel.send('Demande d\'informations au serveur d\'Edu-Focus en cours');
        wait.then(function(message) {
            request({
                method: 'GET',
                uri: 'https://edu-focus.org/api/discord/guad',
                qs: {
                    'key': key,
                    'search': personn,
                },
                json: true,
            }).then(function(response) {
                message.delete('1');
                if(response) {
                    if(response.status === 'success') {
                        if(response.data.authorization_level < 2) return message.channel.send("Votre niveau de partage des données n'est pas assez élevé\nMerci de changer ce paramètre si vous voulez accéder a cette commande\nSi vous avez besoin d'aide, merci de consulter un administrateur")
                        if(response.data.discord_id === null) return message.channel.send("Ce compte est lié a aucun profil discord...\nSi vous avez besoin d'aide, merci de consulter un administrateur")
                        if(response.data.discord_id !== aut.author.id) return message.channel.send("Ce compte n'est pas lié avec ce profil discord...\n")
                        var rank = response.data.informations.rank
                        var asso = response.data.informations.flags.is_assoc_member
                        message.channel.send(rank + " // " + asso)
                        message.channel.send(gradesjs[rank])
                        aut.member.addRole(gradesjs[rank])
                        if(asso === true) aut.member.addRole('525019895000334351')
                    }
                    else if(response.message === 'no user found') {
                        var embed = new Discord.RichEmbed({
                            'fields': [
                                {
                                    'name': 'Oh ! Une erreur est survenue !',
                                    'value': `Hmmmm... Il semblerait que notre superbe API n'ait trouvé aucun utilisateur avec un pseudonyme de "${personn}"`,
                                },
                            ],
                        });
                        message.channel.send(embed);
                    }
                    else{
                        var embed = new Discord.RichEmbed({
                            'fields': [
                                {
                                    'name': 'Oh ! Une erreur est survenue !',
                                    'value': `J'ai buggé... Je suis désolé mais voici la raison de mon bug : ${response.message}`,
                                    'inline': true,
                                },
                            ],
                        });
                        message.channel.send(embed);
                    }

                }
            }).catch(function(err) {
                    return message.channel.send(`Error : ${err}`);
                });
        });
    }else{
        message.channel.send(`Désolé ${message.author} mais vous avez oublié d'ajouter le pseudonyme de la personne à chercher dans la base de donnée d'Edu-Focus`);
    }
}

exports.conf = {
    name: "rankupdate",
    aliases: [],
    help: {
        category: "Utilitaire",
        description: "INDEV",
        usage: "INDEV"
    }
};