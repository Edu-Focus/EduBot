const request = require('request-promise');
const Discord = require("discord.js");

exports.run = async (client, message, args, key) => {
    if(args[0]) {
        const personn = args[0];

        if(!/^[A-Za-z0-9_-sáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]{4,40}$/.test(personn)) {
            return message.channel.send(`La recherche \`${args[0]}\` ne peut être effectuée car elle contient des caractères invalides et/ou est trop courte.`)
                .catch(function(err) {
                    return message.channel.send(`Ouah ! 2 Erreurs en même temps !\n\nLa première :\nLa recherche ne peut être effectuée car elle contient des caractères invalides et/ou est trop courte.\n\nLa Seconde :\n${err}`);
                });
        }

        if(args[1]) var mode = args[1];

        if(mode === '-noreqs'){
            await retreiveStaffList(key).then(function(list) {
                for(let i = 0; i<list.length; i++){
                    let id = list[i].misc.discord_id;
                    console.log(id === message.author.id.trim() && list[i].profile.rank === "system_main_admin")
                    if(typeof id === "string") id = id.trim();
                    if(id === message.author.id.trim() && list[i].profile.rank === "system_main_admin"){
                        restriction = false;
                        return;
                    }
                }
            })

            // Message d'erreur noreqs xDD (Je le met ici prck fuck)
            if(restriction === true) return message.channel.send('L\'option ``-noreqs`` est réservée aux ``Administrateur Système`` d\'Edu-Focus.\nSi jamais vous êtes un ``Administrateurs Système``, merci de relier vorte compte discord a votre compte Edu-Focus pour faire fonctionner cette option');
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
                        const data = response.data;
                        const infos = data.informations;
                        var rank;
                        var color;
                        // Premièrement, on regarde quel est le rôle de l'utilisateur.
                        switch(infos.rank) {
                        case 'user':
                            rank = 'Utilisateur';
                            color = 0x616161;
                            break;
                        case 'validated':
                            rank = 'Membre Agréé';
                            color = 0xFFB300;
                            break;
                        case 'moderator':
                            rank = 'Modérateur';
                            color = 0x4CAF50;
                            break;
                        case 'administrator':
                            rank = 'Administrateur';
                            color = 0xF44336;
                            break;
                        case 'system_main_admin':
                            rank = 'Administrateur Système';
                            color = 0xD32F2F;
                            break;
                        case 'system':
                            rank = 'Système';
                            color = 0x546E7A;
                            break;

                        }

                        if(data.authorization_level > 0) {
                            var assos_member = infos.flags.is_assoc_member ? ':white_check_mark:' : ':x:';
                            var bug_hunter = infos.flags.is_bug_hunter ? ':white_check_mark:' : ':x:';
                            var premium = infos.flags.is_premium ? ':white_check_mark:' : ':x:';
                            var ban = infos.ban.banned ? ':white_check_mark:' : ':x:';
                            var verified = infos.verified === '1' ? ':white_check_mark:' : ':x:';
                            var control = infos.parental_control.status === 'yes' ? ':white_check_mark:' : ':x:';
                            var parent = infos.parental_control.parent_id === 'yes' ? infos.parental_control.parent_id : ':x:';
                            var cgu = infos.cgu_accepted === true ? ':white_check_mark:' : ':x:';
                            var time = infos.ban.banned ? infos.ban.until : ':x:';
                            var reason = infos.ban.banned ? infos.ban.reason : ':x:';

                            if(data.authorization_level > 1) {
                                var adf = infos['2fa_enabled'] ? ':white_check_mark:' : ':x:';
                                var schools = response.data.schools;
                                var schoolsString = '';
                                Object.keys(schools).forEach(function(key) {
                                    var data = schools[key];
                                    switch (data.rank) {
                                    case 'director':
                                        rank = 'Directeur';
                                        break;
                                    case 'professor':
                                        rank = 'professeur';
                                        break;
                                    case 'student_council':
                                        rank = 'Délégué';
                                        break;
                                    case 'student':
                                        rank = 'Elève';
                                        break;
                                    }
                                    schoolsString += rank + ' de ' + key + '\n';
                                });
                                schoolsString = schoolsString.substr(0, schoolsString.length - 2);
                                if(schoolsString == '') schoolsString = 'Aucune école';
                                var login_methods = response.data.login_method;
                                var google = login_methods.google ? ':white_check_mark:' : ':x:';
                                var discord = login_methods.discord ? ':white_check_mark:' : ':x:';
                                var entmip = login_methods.entmip ? ':white_check_mark:' : ':x:';

                                if(data.authorization_level > 2) {
                                    if(infos.classroom) {
                                        var level = infos.classroom;
                                        var classroom = (level == '-2' ? 'Autre' :
                                            (level == '-1' ? 'Personnel d\'établissement' :
                                                (level == '0' ? 'Terminale' :
                                                    (level == '1' ? 'Première' :
                                                        (level == '2' ? 'Seconde' :
                                                            (level == '3' ? 'Troisième' :
                                                                (level == '4' ? 'Quatrième' :
                                                                    (level == '5' ? 'Cinquième' :
                                                                        (level == '6' ? 'Sixième' : 'Enseignement primaire'
                                                                        )))))))));
                                    }
                                }
                            }
                        }

                        // Maintenant on peut commencer a construire notre embed
                        var embed;
                        switch(restriction) {
                        case false:
                            // NOREQS
                            switch(data.authorization_level) {
                            case 0:
                                embed = new Discord.RichEmbed({
                                    'title': `Profil de ${personn} (noreqs)`,
                                    'thumbnail': {
                                        'url': `${infos.photo}?size=200`,
                                    },
                                    'color': `${color}`,
                                    'fields': [
                                        {
                                            'name': 'Niveau de partage des données',
                                            'value': 'Ne rien partager',
                                        },
                                        {
                                            'name': 'Informations générales :',
                                            'value': `ID : ${infos.id}\nPseudonyme : ${infos.username}\nRang : ${rank}`,
                                        },
                                    ],
                                });
                                message.channel.send(embed);
                                break;
                            case 1:
                                embed = new Discord.RichEmbed({
                                    'title': `Profil de ${personn} (noreqs)`,
                                    'thumbnail': {
                                        'url': `${infos.photo}?size=200`,
                                    },
                                    'color': `${color}`,
                                    'fields': [
                                        {
                                            'name': 'Niveau de partage des données',
                                            'value': 'Uniquement le status du compte',
                                            'inline': false,
                                        },
                                        {
                                            'name': 'Informations générales :',
                                            'value': `ID : ${infos.id}\nPseudonyme : ${infos.username}\nRang : ${rank}\n Email : ${infos.email}`,
                                            'inline': true,
                                        },
                                        {
                                            'name': 'Flags :',
                                            'value': `Membre de l'association : ${assos_member}\nBug Hunter : ${bug_hunter}\nMembre premium : ${premium}`,
                                            'inline': true,
                                        },
                                        {
                                            'name': 'Divers :',
                                            'value': `Compte vérifié : ${verified}\nControl parental : ${control}\nID du parent : ${parent}\nCGU acceptés : ${cgu}`,
                                            'inline': true,
                                        },
                                        {
                                            'name': 'Sanctions :',
                                            'value': `Banni : ${ban}\nJusqu'a : ${time}\nRaison: ${reason}`,
                                            'inline': true,
                                        },
                                    ],
                                });
                                message.channel.send(embed);
                                break;
                            case 2:
                                embed = new Discord.RichEmbed({
                                    'title': `Profil de ${personn} (noreqs)`,
                                    'thumbnail': {
                                        'url': `${infos.photo}?size=200`,
                                    },
                                    'color': `${color}`,
                                    'fields': [
                                        {
                                            'name': 'Niveau de partage des données',
                                            'value': 'Uniquement le status du compte + Données annexes',
                                            'inline': false,
                                        },
                                        {
                                            'name': 'Informations générales :',
                                            'value': `ID : ${infos.id}\nPseudonyme : ${infos.username}\nRang : ${rank}\n Email : ${infos.email}`,
                                            'inline': true,
                                        },
                                        {
                                            'name': 'Flags :',
                                            'value': `Membre de l'association : ${assos_member}\nBug Hunter : ${bug_hunter}\nMembre premium : ${premium}`,
                                            'inline': true,
                                        },
                                        {
                                            'name': 'Divers :',
                                            'value': `Compte vérifié : ${verified}\nA2F : ${adf}\nControl parental : ${control}\nID du parent : ${parent}\nCGU acceptés : ${cgu}`,
                                            'inline': true,
                                        },
                                        {
                                            'name': 'Ecoles :',
                                            'value': schoolsString,
                                            'inline': true,
                                        },
                                        {
                                            'name': 'Methodes de connection :',
                                            'value': `Google : ${google}\nDiscord : ${discord}\nEntmip : ${entmip}`,
                                            'inline': true,
                                        },
                                        {
                                            'name': 'Sanctions :',
                                            'value': `Banni : ${ban}\nJusqu'a : ${time}\nRaison: ${reason}`,
                                            'inline': true,
                                        },
                                    ],
                                });
                                message.channel.send(embed);
                                break;
                            case 3:
                                embed = new Discord.RichEmbed({
                                    'title': `Profil de ${personn} (noreqs)`,
                                    'thumbnail': {
                                        'url': `${infos.photo}?size=200`,
                                    },
                                    'color': `${color}`,
                                    'fields': [
                                        {
                                            'name': 'Niveau de partage des données',
                                            'value': 'Toutes les données',
                                            'inline': false,
                                        },
                                        {
                                            'name': 'Informations générales :',
                                            'value': `ID : ${infos.id}\nPseudonyme : ${infos.username}\nRang : ${rank}\n Email : ${infos.email}`,
                                            'inline': true,
                                        },
                                        {
                                            'name': 'Informations personnelles :',
                                            'value': `Prénom : ${infos.first_name}\nNom : ${infos.last_name}\nDate de naissance : ${infos.birthday}\nNiveau scolaire : ${classroom}`,
                                            'inline': true,
                                        },
                                        {
                                            'name': 'Flags :',
                                            'value': `Membre de l'association : ${assos_member}\nBug Hunter : ${bug_hunter}\nMembre premium : ${premium}`,
                                            'inline': true,
                                        },
                                        {
                                            'name': 'Divers :',
                                            'value': `Compte vérifié : ${verified}\nA2F : ${adf}\nControl parental : ${control}\nID du parent : ${parent}\nCGU acceptés : ${cgu}`,
                                            'inline': true,
                                        },
                                        {
                                            'name': 'Etablissements scolaires :',
                                            'value': schoolsString,
                                            'inline': true,
                                        },
                                        {
                                            'name': 'Methodes de connection :',
                                            'value': `Google : ${google}\nDiscord : ${discord}\nEntmip : ${entmip}`,
                                            'inline': true,
                                        },
                                        {
                                            'name': 'Sanctions :',
                                            'value': `Banni : ${ban}\nJusqu'a : ${time}\nRaison: ${reason}`,
                                            'inline': true,
                                        },
                                    ],
                                });
                                message.channel.send(embed);
                                break;
                            }
                            break;
                        case true:
                            // Public mode
                            switch(response.data.authorization_level) {
                            case 0:
                                embed = new Discord.RichEmbed({
                                    'title': `Profil de ${personn}`,
                                    'thumbnail': {
                                        'url': `${infos.photo}`,
                                    },
                                    'color': `${color}`,
                                    'fields': [
                                        {
                                            'name': 'Niveau de partage des données',
                                            'value': 'Ne rien partager',
                                        },
                                        {
                                            'name': 'Informations générales :',
                                            'value': `ID : ${infos.id}\nPseudonyme : ${infos.username}\nRang : ${rank}`,
                                        },
                                    ],
                                });
                                message.channel.send(embed);
                                break;
                            case 1:
                                embed = new Discord.RichEmbed({
                                    'title': `Résultats de recherche pour : ${personn}`,
                                    'thumbnail': {
                                        'url': `${infos.photo}?size=200`,
                                    },
                                    'color': `${color}`,
                                    'fields': [
                                        {
                                            'name': 'Niveau de partage des données',
                                            'value': 'Uniquement le status du compte',
                                            'inline': false,
                                        },
                                        {
                                            'name': 'Informations générales :',
                                            'value': `ID : ${infos.id}\nPseudonyme : ${infos.username}\nRang : ${rank}\n`,
                                            'inline': true,
                                        },
                                        {
                                            'name': 'Flags :',
                                            'value': `Membre de l'association : ${assos_member}\nBug Hunter : ${bug_hunter}\nMembre premium : ${premium}`,
                                            'inline': true,
                                        },
                                        {
                                            'name': 'Divers :',
                                            'value': `Compte vérifié : ${verified}\nControl parental : ${control}\nCGU acceptés : ${cgu}`,
                                            'inline': true,
                                        },
                                        {
                                            'name': 'Sanctions :',
                                            'value': `Banni : ${ban}`,
                                            'inline': true,
                                        },
                                    ],
                                });
                                message.channel.send(embed);
                                break;
                            case 2:
                                embed = new Discord.RichEmbed({
                                    'title': `Résultats de recherche pour : ${personn}`,
                                    'thumbnail': {
                                        'url': `${infos.photo}?size=200`,
                                    },
                                    'color': `${color}`,
                                    'fields': [
                                        {
                                            'name': 'Niveau de partage des données',
                                            'value': 'Uniquement le status du compte + Données annexes',
                                            'inline': false,
                                        },
                                        {
                                            'name': 'Informations générales :',
                                            'value': `ID : ${infos.id}\nPseudonyme : ${infos.username}\nRang : ${rank}`,
                                            'inline': true,
                                        },
                                        {
                                            'name': 'Flags :',
                                            'value': `Membre de l'association : ${assos_member}\nBug Hunter : ${bug_hunter}\nMembre premium : ${premium}`,
                                            'inline': true,
                                        },
                                        {
                                            'name': 'Divers :',
                                            'value': `Compte vérifié : ${verified}\nA2F : ${adf}\nControl parental : ${control}\nCGU acceptés : ${cgu}`,
                                            'inline': true,
                                        },
                                        {
                                            'name': 'Sanctions :',
                                            'value': `Banni : ${ban}`,
                                            'inline': true,
                                        },
                                    ],
                                });
                                message.channel.send(embed);
                                break;
                            case 3:
                                embed = new Discord.RichEmbed({
                                    'title': `Résultats de recherche pour : ${personn}`,
                                    'thumbnail': {
                                        'url': `${infos.photo}?size=200`,
                                    },
                                    'color': `${color}`,
                                    'fields': [
                                        {
                                            'name': 'Niveau de partage des données',
                                            'value': 'Toutes les données',
                                            'inline': false,
                                        },
                                        {
                                            'name': 'Informations générales :',
                                            'value': `ID : ${infos.id}\nPseudonyme : ${infos.username}\nRang : ${rank}`,
                                            'inline': true,
                                        },
                                        {
                                            'name': 'Flags :',
                                            'value': `Membre de l'association : ${assos_member}\nBug Hunter : ${bug_hunter}\nMembre premium : ${premium}`,
                                            'inline': true,
                                        },
                                        {
                                            'name': 'Divers :',
                                            'value': `Compte vérifié : ${verified}\nA2F : ${adf}\nControl parental : ${control}\nCGU acceptés : ${cgu}`,
                                            'inline': true,
                                        },
                                        {
                                            'name': 'Sanctions :',
                                            'value': `Banni : ${ban}`,
                                            'inline': true,
                                        },
                                    ],
                                });
                                message.channel.send(embed);
                                break;
                            }
                            break;
                        }

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
            })
                .catch(function(err) {
                    return message.channel.send(`Error : ${err}`);
                });
        });
    }
    else{
        message.channel.send(`Désolé ${message.author} mais vous avez oublié d'ajouter le pseudonyme de la personne à chercher dans la base de donnée d'Edu-Focus`);
    }
    
    function retreiveStaffList(key) {
        return new Promise(function(resolve, reject) {
            if (doRequest) {
                request({
                    uri: 'https://edu-focus.org/api/discord/staff',
                    json: true,
                    qs: {
                        key: key,
                    },
                }).then(function(response) {
    
                    doRequest = false;
                    fallbackOccurences = 0;
                    setTimeout(function() {
                        doRequest = true;
                    }, 10000);
    
                    if (response.status === 'success') {
                        staffList = response.data.staff_members;
    
                        resolve(staffList);
                    }
                    else if (staffList === null) {
                        console.error('Error: The api refused to retrive data (reason: ' + response.message + '), unable to continue due to absence of cache.');
                        reject('refused_then_no_cache');
                    }
                    else if (fallbackOccurences < 3) {
                        console.warn('Warning: The api refused to retrive data (reason: ' + response.message + '), using cached datas to continue.');
                        fallbackOccurences++;
                        resolve(staffList);
                    }
                    else {
                        console.error('Error: The api refused to retrive data (reason: ' + response.message + '), unable to continue due to outdated cache.');
                        reject('refused_then_outdated_cache');
                    }
                }).catch(function(err) {
                    if (staffList === null) {
                        console.error('Error: Failed to retreive datas, unable to continue due to absence of cache.\n', err);
                        reject('fail_then_no_cache');
                    }
                    else if (fallbackOccurences < 3) {
                        console.warn('Warning: Failed to retreive datas, using cached datas to continue.');
                        fallbackOccurences++;
                        resolve(staffList);
                    }
                    else {
                        console.error('Error: Failed to retreive datas, unable to continue due to outdated cache.');
                        reject('fail_then_outdated_cache');
                    }
                });
            }
            else {
                resolve(staffList);
                return;
            }
        });
    }

}

exports.conf = {
    name: "userinfo",
    aliases: [],
    help: {
        category: "Utilitaires",
        description: "Retourne les informations de l'utilisateur demandé",
        usage: "EF!userinfo {username}"
    }
};