const Discord = require("discord.js");
const request = require('request-promise');

module.exports.run = async (bot, message, args, key) => {

    if(message.author.id === '300910791362740224' || message.author.id === '254567903742001153'){
        if(args[0]){
            if(!/^[A-Za-z0-9_-sáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]{4,40}$/.test(args[0])) {
                return message.channel.send(`La recherche \`${args[0]}\` ne peut être effectuée car elle contient des caractères invalides.`);
            }

            var personn = args[0];
            var wait = message.channel.send("Demande d'informations au serveur d'Edu-Focus en cours")
            wait.then(function (message) {
                request({
                    method: 'GET',
                    uri: `https://edu-focus.org/api/discord/guad`,
                    qs: {
                    'key': key,
                    'search': personn
                    },
                json: true
                }).then(function (response) {
                    message.delete('1')
                    if(response){
                        if(response.status === "success"){
                        var infos = response.data.informations;

                        switch(response.data.authorization_level) {
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
                                        },
                                        {
                                            "name": "Informations générales :",
                                            "value": `ID : ${response.data.informations.id}\nPseudonyme : ${response.data.informations.username}\nRank : ${response.data.informations.rank}`,
                                        }
                                    ]
                                })
                                message.channel.send(embedd)
                                break;
                            case 1:
                                var assos_member = infos.flags.is_assoc_member?':white_check_mark:':':x:';
                                var bug_hunter = infos.flags.is_bug_hunter?':white_check_mark:':':x:';
                                var premium = infos.flags.is_premium?':white_check_mark:':':x:';
                                var ban = infos.ban.banned?':white_check_mark:':':x:';
                                var time = infos.ban.banned?infos.ban.until:':x:';
                                var reason = infos.ban.banned?infos.ban.reason:':x:';
                                var control = infos.parental_control.status==='yes'?'white_check_mark':':x:'
                                var parent = infos.parental_control.parent_id==='yes'?infos.parental_control.parent_id:':x:'
                                var cgu = infos.cgu_accepted === true?':white_check_mark:':':x:';
                                var verified = infos.verified === true?':white_check_mark:':':x:';

                                var embedd = new Discord.RichEmbed({
                                    "title": `Résultats de recherche pour : _${personn}_`,
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
                                break; 
                            case 2:
                                var assos_member = infos.flags.is_assoc_member?':white_check_mark:':':x:';
                                var bug_hunter = infos.flags.is_bug_hunter?':white_check_mark:':':x:';
                                var premium = infos.flags.is_premium?':white_check_mark:':':x:';
                                var ban = infos.ban.banned?':white_check_mark:':':x:';
                                var time = infos.ban.banned?infos.ban.until:':x:';
                                var reason = infos.ban.banned?infos.ban.reason:':x:';
                                var control = infos.parental_control.status==='yes'?'white_check_mark':':x:'
                                var parent = infos.parental_control.parent_id==='yes'?infos.parental_control.parent_id:':x:'
                                var cgu = infos.cgu_accepted === true?':white_check_mark:':':x:';
                                var verified = infos.verified === true?':white_check_mark:':':x:';
                                var adf = infos['2fa_enabled']?':white_check_mark:':':x:';
                                var login_methods = response.data.login_method;
                                var google = login_methods.google?':white_check_mark:':':x:';
                                var discord = login_methods.discord?':white_check_mark:':':x:';
                                var entmip = login_methods.entmip?':white_check_mark:':':x:';

                                var schools = response.data.schools;
                                var schoolsString = '';
                                Object.keys(schools).forEach(function(key) {
                                    var data = schools[key];
                                    switch (data.rank) {
                                        case 'director':
                                            var rank = 'Directeur';
                                            break;
                                        case 'professor':
                                            var rank = 'professeur';
                                            break;
                                        case 'student_council':
                                            var rank = 'Délégué';
                                            break;
                                        case 'student':
                                            var rank = 'Elève';
                                            break;
                                    }
                                    schoolsString += rank + " de " + key + "\n"
                                });
                                schoolsString = schoolsString.substr(0, schoolsString.length-2);

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
                                            "value": `Compte vérifié : ${verified}\nA2F : ${adf}\nControl parental : ${control}\nID du parent : ${parent}\nCGU acceptés : ${cgu}`,
                                            "inline": true
                                        },
                                        {
                                            "name": "Ecoles :",
                                            "value": schoolsString,
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
                                message.channel.send(embedd);
                                break;
                            case 3:
                                var assos_member = infos.flags.is_assoc_member?':white_check_mark:':':x:';
                                var bug_hunter = infos.flags.is_bug_hunter?':white_check_mark:':':x:';
                                var premium = infos.flags.is_premium?':white_check_mark:':':x:';
                                var ban = infos.ban.banned?':white_check_mark:':':x:';
                                var time = infos.ban.banned?infos.ban.until:':x:';
                                var reason = infos.ban.banned?infos.ban.reason:':x:';
                                var control = infos.parental_control.status==='yes'?'white_check_mark':':x:'
                                var parent = infos.parental_control.parent_id==='yes'?infos.parental_control.parent_id:':x:'
                                var cgu = infos.cgu_accepted === true?':white_check_mark:':':x:';
                                var verified = infos.verified === true?':white_check_mark:':':x:';
                                var adf = infos['2fa_enabled']?':white_check_mark:':':x:';
                                var login_methods = response.data.login_method;
                                var google = login_methods.google?':white_check_mark:':':x:';
                                var discord = login_methods.discord?':white_check_mark:':':x:';
                                var entmip = login_methods.entmip?':white_check_mark:':':x:';
                                

                                var schools = response.data.schools;
                                var schoolsString = '';
                                Object.keys(schools).forEach(function(key) {
                                    var data = schools[key];
                                    switch (data.rank) {
                                        case 'director':
                                            var rank = 'Directeur';
                                            break;
                                        case 'professor':
                                            var rank = 'professeur';
                                            break;
                                        case 'student_council':
                                            var rank = 'Délégué';
                                            break;
                                        case 'student':
                                            var rank = 'Elève';
                                            break;
                                    }
                                    schoolsString += rank + " de " + key + "\n"
                                });
                                schoolsString = schoolsString.substr(0, schoolsString.length-2);

                                var embedd = new Discord.RichEmbed({
                                    "title": `Résultats de recherche pour : ${personn}`,
                                    "thumbnail": {
                                        "url": `https://edu-focus.org/assets/media/${response.data.informations.photo}?size=200`
                                    },
                                    "fields": [
                                        {
                                            "name": "Niveau de partage des données",
                                            "value": "Toutes les données",
                                            "inline": false
                                        },
                                        {
                                            "name": "Informations générales :",
                                            "value": `ID : ${response.data.informations.id}\nPseudonyme : ${response.data.informations.username}\nRank : ${response.data.informations.rank}\n Email : ${response.data.informations.email}`,
                                            "inline": true
                                        },
                                        {
                                            "name": "Informations personnelles :",
                                            "value": `Prénom : ${response.data.informations.first_name}\nNom : ${response.data.informations.last_name}\nDate de naissance : ${response.data.informations.birthday}\nClasse : ${response.data.informations.classroom}eme`,
                                            "inline": true
                                        },
                                        {
                                            "name": "Flags :",
                                            "value": `Membre de l'association : ${assos_member}\nBug Hunter : ${bug_hunter}\nMembre premium : ${premium}`,
                                            "inline": true
                                        },
                                        {
                                            "name": "Divers :",
                                            "value": `Compte vérifié : ${verified}\nA2F : ${adf}\nControl parental : ${control}\nID du parent : ${parent}\nCGU acceptés : ${cgu}`,
                                            "inline": true
                                        },
                                        {
                                            "name": "Etablissements scolaires :",
                                            "value": schoolsString,
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
                                break;     
                        }
                        }else if(response.message === "no user found"){
                            var embedd = new Discord.RichEmbed({
                                "fields": [
                                    {
                                        "name": "OHH ! Une erreur est survenue !",
                                        "value": `Hmmmm... Il semblerait que notre superbe API n'a trouvé aucun utilisateur avec un pseudonyme de "${personn}"`,
                                    }
                                ]
                            })
                            message.channel.send(embedd)
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
                            message.channel.send(embedd)
                        }
                        
                    }
                })
            })
        }else{
            message.channel.send(`Désolé ${message.author} mais vous avez oublié d'ajouter le pseudonyme de la personne à chercher dans la base de donnée d'Edu-Focus`)
        }
    }else{
        message.channel.send("Désolé mais pour l'instant, cet commande est indisponible au grand public")
    }    
}



module.exports.help = {
    name: "userinfo"
}