const Discord = require("discord.js");
const request = require('request-promise');

module.exports.run = async (bot, message, args, key) => {

    if(args[0]){
        var personn = args[0]
        var wait = message.channel.send("Demande d'informations au serveur d'Edu-Focus en cours")
        wait.then(function (message) {
            request({
                method: 'GET',
                    uri: `https://edu-focus.org/api/discord/guad?key=${key}&search=${personn}`,
                    json: true
            }).then(function (response) {
                message.delete('1')
                if(response){
                    if(response.status === "success"){
                        console.log(response)
                        switch(response.data.authorization_level) {
                            //message.channel.send()
                            case 0:
                                var embedd = new Discord.RichEmbed({
                                    "title": `Profil de ${personn}`,
                                    "thumbnail": {
                                        "url": `https://edu-focus.org/assets/media/${response.data.informations.photo}?size=200`
                                      },
                                    "fields": [
                                      {
                                        "name": "Niveau de partage des données",
                                        "value": "Ne rien partager",
                                        //"inline": true
                                      },
                                      {
                                        "name": "Informations générales :",
                                        "value": `ID : ${response.data.informations.id}\nPseudonyme : ${response.data.informations.username}\nRank : ${response.data.informations.rank}`,
                                        //"inline": true
                                      }
                                    ]
                                  })
                                message.channel.send(embedd) 
                            case 1:
                                if(response.data.informations.flags.is_assoc_member === true){
                                var assos_member = ":white_check_mark: "
                                }else{
                                    var assos_member = ":x:"
                                }
                                if(response.data.informations.flags.is_bug_hunter === true){
                                    var bug_hunter = ":white_check_mark: "
                                }else{
                                    var bug_hunter = ":x:"
                                }
                                if(response.data.informations.flags.is_premium === true){
                                    var premium = ":white_check_mark: "
                                }else{
                                    var premium = ":x:"
                                }
                                if(response.data.informations.ban.banned === true){
                                    var ban = ":white_check_mark: "
                                    var time = response.data.informations.ban.until
                                    var reason = response.data.informations.ban.reason
                                }else{
                                    var ban = ":x:"
                                    var time = ":x:"
                                    var reason = ":x:"
                                }
                                if(response.data.informations.parental_control.status === 'yes'){
                                    var control = ":white_check_mark: "
                                    var parent = response.data.informations.parental_control.parent_id
                                }else{
                                    var control = ":x:"
                                    var parent = ":x:"
                                }
                                if(response.data.informations.cgu_accepted === true){
                                    var cgu = ":white_check_mark: "
                                }else{
                                    var cgu = ":x:"
                                }
                                if(response.data.informations.verified === '1'){
                                    var verified = ":white_check_mark: "
                                }else{
                                    var verified = ":x:"
                                }
                                var embedd = new Discord.RichEmbed({
                                    "title": `Résultats de recherche pour : ${personn}`,
                                    "thumbnail": {
                                        "url": `https://edu-focus.org/assets/media/${response.data.informations.photo}?size=200`
                                      },
                                    "fields": [
                                      {
                                        "name": "Niveau de partage des données",
                                        "value": "Uniquement le status du compte",
                                        "inline": false
                                      },
                                      {
                                        "name": "Informations générales :",
                                        "value": `ID : ${response.data.informations.id}\nPseudonyme : ${response.data.informations.username}\nRank : ${response.data.informations.rank}\n Email : ${response.data.informations.email}`,
                                        "inline": true
                                      },
                                      {
                                        "name": "Flags :",
                                        "value": `Membre de l'association : ${assos_member}\nBug Hunter : ${bug_hunter}\nMembre premium : ${premium}`,
                                        "inline": true
                                      },
                                      {
                                        "name": "Divers :",
                                        "value": `Compte vérifié : ${verified}\nControl parental : ${control}\nID du parent : ${parent}\nCGU acceptés : ${cgu}`,
                                        "inline": true
                                      },
                                      {
                                        "name": "Sanctions :",
                                        "value": `Banni : ${ban}\nJusqu'a : ${time}\nRaison: ${reason}`,
                                        "inline": true
                                      }
                                    ]
                                  })
                                  message.channel.send(embedd)
                            case 2:
                                    if(response.data.informations.flags.is_assoc_member === true){
                                        var assos_member = ":white_check_mark: "
                                        }else{
                                            var assos_member = ":x:"
                                        }
                                        if(response.data.informations.flags.is_bug_hunter === true){
                                            var bug_hunter = ":white_check_mark: "
                                        }else{
                                            var bug_hunter = ":x:"
                                        }
                                        if(response.data.informations.flags.is_premium === true){
                                            var premium = ":white_check_mark: "
                                        }else{
                                            var premium = ":x:"
                                        }
                                        if(response.data.informations.ban.banned === true){
                                            var ban = ":white_check_mark: "
                                            var time = response.data.informations.ban.until
                                            var reason = response.data.informations.ban.reason
                                        }else{
                                            var ban = ":x:"
                                            var time = ":x:"
                                            var reason = ":x:"
                                        }
                                        if(response.data.informations.parental_control.status === 'yes'){
                                            var control = ":white_check_mark: "
                                            var parent = response.data.informations.parental_control.parent_id
                                        }else{
                                            var control = ":x:"
                                            var parent = ":x:"
                                        }
                                        if(response.data.informations.cgu_accepted === true){
                                            var cgu = ":white_check_mark: "
                                        }else{
                                            var cgu = ":x:"
                                        }
                                        if(response.data.informations.verified === '1'){
                                            var verified = ":white_check_mark: "
                                        }else{
                                            var verified = ":x:"
                                        }
                                        if(response.data.informations['2fa_enabled'] === true){
                                            var adf = ":white_check_mark:"
                                        }else{
                                            var adf = ":x:"
                                        }
                                        if(response.data.login_method.google === true){
                                            var google = ":white_check_mark:"
                                        }else{
                                            var google = ":x:"
                                        }
                                        if(response.data.login_method.discord === true){
                                            var discord = ":white_check_mark:"
                                        }else{
                                            var discord = ":x:"
                                        }
                                        if(response.data.login_method['entmip.fr'] === true){
                                            var entmip = ":white_check_mark:"
                                        }else{
                                            var entmip = ":x:"
                                        }
                                        var embedd = new Discord.RichEmbed({
                                            "title": `Résultats de recherche pour : ${personn}`,
                                            "thumbnail": {
                                                "url": `https://edu-focus.org/assets/media/${response.data.informations.photo}?size=200`
                                              },
                                            "fields": [
                                              {
                                                "name": "Niveau de partage des données",
                                                "value": "Uniquement le status du compte + Données annexes",
                                                "inline": false
                                              },
                                              {
                                                "name": "Informations générales :",
                                                "value": `ID : ${response.data.informations.id}\nPseudonyme : ${response.data.informations.username}\nRank : ${response.data.informations.rank}\n Email : ${response.data.informations.email}`,
                                                "inline": true
                                              },
                                              {
                                                "name": "Flags :",
                                                "value": `Membre de l'association : ${assos_member}\nBug Hunter : ${bug_hunter}\nMembre premium : ${premium}`,
                                                "inline": true
                                              },
                                              {
                                                "name": "Divers :",
                                                "value": `Compte vérifié : ${verified}\nControl parental : ${control}\nID du parent : ${parent}\nCGU acceptés : ${cgu}`,
                                                "inline": true
                                              },
                                              {
                                                "name": "Ecoles :",
                                                "value": `${schools}`,
                                                "inline": true
                                              },
                                              {
                                                "name": "Methodes de connection :",
                                                "value": `Google : ${google}\nDiscord : ${discord}\nEntmip : ${entmip}`,
                                                "inline": true
                                              },
                                              {
                                                "name": "Sanctions :",
                                                "value": `Banni : ${ban}\nJusqu'a : ${time}\nRaison: ${reason}`,
                                                "inline": true
                                              }
                                            ]
                                          })
                                    message.channel.send(embedd)
                            case 3:
                        }
                    }else{
                        if(response.message === "no user found"){
                        var embedd = new Discord.RichEmbed({
                            "fields": [
                              {
                                "name": "OHH ! Une erreur est survenue !",
                                "value": `Hmmmm... Il semblerait que notre superbe API n'a trouvé aucun utilisateur avec un pseudonyme de "${personn}"`,
                                //"inline": true
                              }
                            ]
                          })
                        }else{
                            var embedd = new Discord.RichEmbed({
                                "fields": [
                                  {
                                    "name": "OHH ! Une erreur est survenue !",
                                    "value": `J'ai buggé... Je suis désolé mais voici la raison de mon bug : ${response.message}`,
                                    //"inline": true
                                  }
                                ]
                              })
                        }
                           message.channel.send(embedd)
                    }
                }
            })
        })
    }else{
        message.channel.send(`Désolé ${message.author} mais vous avez oublié d'ajouter le pseudonyme de la personne à chercher dans la base de donnée d'Edu-Focus`)
    }    
}



module.exports.help = {
    name: "userinfo"
}