const request = require('request-promise');
const Discord = require("discord.js");
const staffverif = require("../functions/staffverif.js")

exports.run = async (client, message, args, key) => {
    if(args[0]) {
        const personn = args[0];

        if(!/^[A-Za-z0-9_-sáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]{4,40}$/.test(personn)) {
            var reply = message.cleanContent.split('EF$rankupdate ').join('')
            return message.channel.send(`La recherche \`${reply}\` ne peut être effectuée car elle contient des caractères invalides et/ou est trop courte.`)
                .catch(function(err) {
                    return message.channel.send(`Ouah ! 2 Erreurs en même temps !\n\nLa première :\nLa recherche ne peut être effectuée car elle contient des caractères invalides et/ou est trop courte.\n\nLa Seconde :\n${err}`);
                });
        }

        if(args[1]) var mode = args[1];
        var restriction = true
        if (mode === '-noreqs'){
            if (await staffverif('system_main_admin', message.author.id) === true) return message.channel.send('L\'option ``-noreqs`` est réservée aux ``Administrateur Système`` d\'Edu-Focus.\nSi jamais vous êtes un ``Administrateurs Système``, merci de relier vorte compte discord a votre compte Edu-Focus pour faire fonctionner cette option');
            restriction = false
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
                                        var classroom = ''
                                        var level = infos.classroom;
                                        switch(level){
                                            case '-2':
                                                classroom = 'Autre'
                                                break;
                                            case '-1':
                                                classroom = 'Personnel d\'établissement'
                                                break;
                                            case '-0':
                                                classroom = 'Terminale'
                                                break;
                                            case '1':
                                                classroom = 'Première'
                                                break;
                                            case '2':
                                                classroom = 'Seconde'
                                                break;
                                            case '3':
                                                classroom = 'Troisième'
                                                break;
                                            case '4':
                                                classroom = 'Quatrième'
                                                break;
                                            case '5':
                                                classroom = 'Cinquième'
                                                break;
                                            case '6':
                                                classroom = 'Sixième'
                                                break;
                                        }
                                        if(classroom === '') classroom = 'Enseignement primaire'
                                    }
                                }
                            }
                        }

                        // Maintenant on peut commencer a construire notre embed
                        switch(restriction) {
                        case false:
                            // NOREQS
                            switch(data.authorization_level) {
                            case 0:
                                var embed = new Discord.RichEmbed()
                                .setTitle(`Profil de ${personn} (noreqs)`)
                                .setThumbnail(`${infos.photo}?size=200`)
                                .setColor(color)
                                .addField('Niveau de partage des données', 'Ne rien partager')
                                .addField('Informations générales', `ID : ${infos.id}\nPseudonyme : ${infos.username}\nRang : ${rank}`)
                                break;
                            case 1:
                                var embed = new Discord.RichEmbed()
                                .setTitle(`Profil de ${personn} (noreqs)`)
                                .setThumbnail(`${infos.photo}?size=200`)
                                .setColor(color)
                                .addField('Niveau de partage des données', 'Uniquement le status du compte')
                                .addField('Informations générales :', `ID : ${infos.id}\nPseudonyme : ${infos.username}\nRang : ${rank}\n Email : ${infos.email}`, true)
                                .addField('Flags :', `Membre de l'association : ${assos_member}\nBug Hunter : ${bug_hunter}\nMembre premium : ${premium}`, true)
                                .addField('Divers :', `Compte vérifié : ${verified}\nControl parental : ${control}\nID du parent : ${parent}\nCGU acceptés : ${cgu}`, true)
                                .addField('Sanctions :', `Banni : ${ban}\nJusqu'a : ${time}\nRaison: ${reason}`, true)
                                break;
                            case 2:
                                var embed = new Discord.RichEmbed()
                                .setTitle(`Profil de ${personn} (noreqs)`)
                                .setThumbnail(`${infos.photo}?size=200`)
                                .setColor(color)
                                .addField('Niveau de partage des données', 'Uniquement le status du compte + Données annexes')
                                .addField('Informations générales :', `ID : ${infos.id}\nPseudonyme : ${infos.username}\nRang : ${rank}\n Email : ${infos.email}`, true)
                                .addField('Flags :', `Membre de l'association : ${assos_member}\nBug Hunter : ${bug_hunter}\nMembre premium : ${premium}`, true)
                                .addField('Divers :', `Compte vérifié : ${verified}\nA2F : ${adf}\nControl parental : ${control}\nID du parent : ${parent}\nCGU acceptés : ${cgu}`, true)
                                .addField('Ecoles :', schoolsString, true)
                                .addField('Methodes de connection :', `Google : ${google}\nDiscord : ${discord}\nEntmip : ${entmip}`, true)
                                .addField('Sanctions :', `Banni : ${ban}\nJusqu'a : ${time}\nRaison: ${reason}`, true)
                                break;
                            case 3:
                                var embed = new Discord.RichEmbed()
                                .setTitle(`Profil de ${personn} (noreqs)`)
                                .setThumbnail(`${infos.photo}?size=200`)
                                .setColor(color)
                                .addField('Niveau de partage des données', 'Toutes les données')
                                .addField('Informations générales :', `ID : ${infos.id}\nPseudonyme : ${infos.username}\nRang : ${rank}\n Email : ${infos.email}`, true)
                                .addField('Informations personelles :', `Prénom : ${infos.first_name}\nNom : ${infos.last_name}\nDate de naissance : ${infos.birthday}\nNiveau scolaire : ${classroom}`, true)
                                .addField('Flags :', `Membre de l'association : ${assos_member}\nBug Hunter : ${bug_hunter}\nMembre premium : ${premium}`, true)
                                .addField('Divers :', `Compte vérifié : ${verified}\nA2F : ${adf}\nControl parental : ${control}\nID du parent : ${parent}\nCGU acceptés : ${cgu}`, true)
                                .addField('Ecoles :', schoolsString, true)
                                .addField('Methodes de connection :', `Google : ${google}\nDiscord : ${discord}\nEntmip : ${entmip}`, true)
                                .addField('Sanctions :', `Banni : ${ban}\nJusqu'a : ${time}\nRaison: ${reason}`, true)
                                break;
                            }
                            break;
                        case true:
                            // Public mode
                            switch(response.data.authorization_level) {
                            case 0:
                                var embed = new Discord.RichEmbed()
                                .setTitle(`Profil de ${personn}`)
                                .setThumbnail(`${infos.photo}?size=200`)
                                .setColor(color)
                                .addField('Niveau de partage des données', 'Ne rien partager')
                                .addField('Informations générales', `ID : ${infos.id}\nPseudonyme : ${infos.username}\nRang : ${rank}`)
                                break;
                            case 1:
                                var embed = new Discord.RichEmbed()
                                .setTitle(`Profil de ${personn}`)
                                .setThumbnail(`${infos.photo}?size=200`)
                                .setColor(color)
                                .addField('Niveau de partage des données', 'Uniquement le status du compte')
                                .addField('Informations générales :', `ID : ${infos.id}\nPseudonyme : ${infos.username}\nRang : ${rank}`, true)
                                .addField('Flags :', `Membre de l'association : ${assos_member}\nBug Hunter : ${bug_hunter}\nMembre premium : ${premium}`, true)
                                .addField('Divers :', `Compte vérifié : ${verified}\nControl parental : ${control}\nCGU acceptés : ${cgu}`, true)
                                .addField('Sanctions :', `Banni : ${ban}`, true)
                                break;
                            case 2:
                                var embed = new Discord.RichEmbed()
                                .setTitle(`Profil de ${personn}`)
                                .setThumbnail(`${infos.photo}?size=200`)
                                .setColor(color)
                                .addField('Niveau de partage des données', 'Uniquement le status du compte + Données annexes')
                                .addField('Informations générales :', `ID : ${infos.id}\nPseudonyme : ${infos.username}\nRang : ${rank}`, true)
                                .addField('Flags :', `Membre de l'association : ${assos_member}\nBug Hunter : ${bug_hunter}\nMembre premium : ${premium}`, true)
                                .addField('Divers :', `Compte vérifié : ${verified}\nControl parental : ${control}\nCGU acceptés : ${cgu}`, true)
                                .addField('Sanctions :', `Banni : ${ban}`, true)
                                break;
                            case 3:
                                var embed = new Discord.RichEmbed()
                                .setTitle(`Profil de ${personn}`)
                                .setThumbnail(`${infos.photo}?size=200`)
                                .setColor(color)
                                .addField('Niveau de partage des données', 'Toutes les données')
                                .addField('Informations générales :', `ID : ${infos.id}\nPseudonyme : ${infos.username}\nRang : ${rank}`, true)
                                .addField('Flags :', `Membre de l'association : ${assos_member}\nBug Hunter : ${bug_hunter}\nMembre premium : ${premium}`, true)
                                .addField('Divers :', `Compte vérifié : ${verified}\nControl parental : ${control}\nCGU acceptés : ${cgu}`, true)
                                .addField('Sanctions :', `Banni : ${ban}`, true)
                                break;
                            }
                            break;
                        }
                        message.channel.send(embed);

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
    name: "userinfo",
    aliases: [],
    help: {
        category: "Utilitaires",
        description: "Retourne les informations de l'utilisateur demandé",
        usage: "EF!userinfo {username}"
    }
};