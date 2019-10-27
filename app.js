const Discord = require("discord.js");
const request = require("request-promise")
const fs = require("fs");
const bot = new Discord.Client();
const config = require("./botconfig.json");
let prefix = ("EF!");
let banbdd = JSON.parse(fs.readFileSync("./bdd/ban.json", "utf8"));

bot.login(config.token)
const key = config.api_key

bot.on("ready", async () => {
    console.log(`Edu-Focus, tout le monde a le droit d'apprendre !`);
    bot.user.setGame("Edu-Focus, tout le monde a le droit d'apprendre !")
});

bot.on ("message", message => {
    if (message.author.bot || message.channel.type === "dm" || banbdd[message.author.id])
        return;

    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if(cmd === (prefix + "ping"))return message.channel.send("Pong")

    if(cmd === (prefix + "discord") || cmd === (prefix + "support")) return message.channel.send("Notre serveur discord : <https://edu-foc.us/discord> (ou edu-foc.us/ds)\nLe serveur discord test (attention spam) : <https://edu-foc.us/discord-sandbox>")

    if(cmd === (prefix + 'help')){
        const embed = new Discord.RichEmbed({
            "title": "Page d'aide",
            "color": 0x4527A0,
            "fields": [
                {
                    "name": "Utilitaires :",
                    "value": `**EF!userinfo {username} (mode)**\nPermet de chercher des informations avec l'API d'Edu-Focus sur l'utilisateur\n**EF!staff**\nPermet d'avoir la liste du staff (avec leurs id discord)\n**EF!discord (ou EF!support)**\nEnvoie les liens d'invitations pour les serveurs discord d'Edu-Focus`,
                },
            ],
            "footer": 'Légnede : {} = Obligatoire || () = Optionnel'
        })
        return message.channel.send(embed)
    }

    if(cmd === (prefix + 'userinfo')){
        if(args[0]){
            var personn = args[0];
    
            if(!/^[A-Za-z0-9_-sáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]{4,40}$/.test(personn)) {
                return message.channel.send(`La recherche \`${args[0]}\` ne peut être effectuée car elle contient des caractères invalides et/ou est trop courte.`)
                .catch(function (err) {
                    return message.channel.send(`Ouah ! 2 Erreurs en même temps !\n\nLa première :\nLa recherche ne peut être effectuée car elle contient des caractères invalides et/ou est trop courte.\n\nLa Seconde :\n${err}`)
                })
            }            
    
            if(args[1]) var mode = args[1]
            
            var restriction = 1
            //Vérif des ids dynamiques (c'est le bordelje rangerais plus tard)
            retreiveStaffList(key).then(function(list){
                Object(list).forEach(function(list) {
                    if(!list.misc.discord_id != null && !list.profile.rank === 'system_main_admin') return

                    if(mode === '-noreqs' && message.author.id == list.misc.discord_id){
                        restriction = 0
                    }

                    if(message.author.id == list.misc.discord_id && message.guild.id == "528679953399676938" && message.channel.id == "602277789349052426"){
                        restriction = 0
                    }
                    
                });     
            })

            //Message d'erreur noreqs xDD (Je le met ici prck fuck)
            if(mode === '-noreqs' && restriction === 1) return message.channel.send("L'option ``-noreqs`` est réservée aux ``Administrateur Système`` d'Edu-Focus.\nSi jamais vous êtes un ``Administrateurs Système``, merci de relier vorte compte discord a votre compte Edu-Focus pour faire fonctionner cette option")

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
                        var data = response.data;
                        var infos = data.informations;

                        //Primièrement, on regarde quel est le rôle de l'utilisateur.
                        switch(infos.rank){
                            case 'user':
                                var rank = 'Utilisateur'
                                var color = 0x616161
                                break;
                            case 'validated':
                                var rank = 'Membre Agréé'
                                var color = 0xFFB300
                                break;
                            case 'moderator':
                                var rank = 'Modérateur'
                                var color = 0x4CAF50
                                break;
                            case 'administrator':
                                var rank = 'Administrateur'
                                var color = 0xF44336
                                break;
                            case 'system_main_admin':
                                var rank = 'Administrateur Système'
                                var color = 0xD32F2F
                                break;
                            case 'system':
                                var rank = 'Système'
                                var color = 0x546E7A
                                break;
                        }

                        if(data.authorization_level > 0){
                            var assos_member = infos.flags.is_assoc_member?':white_check_mark:':':x:';
                            var bug_hunter = infos.flags.is_bug_hunter?':white_check_mark:':':x:';
                            var premium = infos.flags.is_premium?':white_check_mark:':':x:';
                            var ban = infos.ban.banned?':white_check_mark:':':x:';
                            var verified = infos.verified ==='1'?':white_check_mark:':':x:';
                            var control = infos.parental_control.status==='yes'?':white_check_mark:':':x:'
                            var parent = infos.parental_control.parent_id==='yes'?infos.parental_control.parent_id:':x:'
                            var cgu = infos.cgu_accepted === true?':white_check_mark:':':x:';
                            var time = infos.ban.banned?infos.ban.until:':x:';
                            var reason = infos.ban.banned?infos.ban.reason:':x:';    

                            if(data.authorization_level > 1){                                                           
                                var adf = infos['2fa_enabled']?':white_check_mark:':':x:';
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
                                if(schoolsString == "") schoolsString = "Aucune école"     
                                var login_methods = response.data.login_method;
                                var google = login_methods.google?':white_check_mark:':':x:';
                                var discord = login_methods.discord?':white_check_mark:':':x:';
                                var entmip = login_methods.entmip?':white_check_mark:':':x:';

                                if(data.authorization_level > 2){                            
                                    if(infos.classroom){
                                        var level = infos.classroom
                                        var classroom = (level=='-2'?'Autre':
                                                        (level=='-1'?'Personnel d\'établissement':
                                                        (level=='0'?'Terminale':
                                                        (level=='1'?'Première':
                                                        (level=='2'?'Seconde':
                                                        (level=='3'?'Troisième':
                                                        (level=='4'?'Quatrième':
                                                        (level=='5'?'Cinquième':
                                                        (level=='6'?'Sixième':'Enseignement primaire'
                                        )))))))));
                                    }
                                }
                            }
                        }
                    
                        //Maintenant on peut commencer a construire notre embed 
                        switch(restriction){
                            case 0:
                                //NOREQS
                                switch(data.authorization_level) {
                                    case 0:
                                        var embed = new Discord.RichEmbed({
                                            "title": `Profil de ${personn} (noreqs)`,
                                            "thumbnail": {
                                                "url": `${infos.photo}?size=200`
                                            },
                                            "color": `${color}`,
                                            "fields": [
                                                {
                                                    "name": "Niveau de partage des données",
                                                    "value": "Ne rien partager",
                                                },
                                                {
                                                    "name": "Informations générales :",
                                                    "value": `ID : ${infos.id}\nPseudonyme : ${infos.username}\nRang : ${rank}`,
                                                }
                                            ]
                                        })
                                        message.channel.send(embed)
                                        break;
                                    case 1:            
                                        var embed = new Discord.RichEmbed({
                                            "title": `Profil de ${personn} (noreqs)`,
                                            "thumbnail": {
                                                "url": `${infos.photo}?size=200`
                                            },
                                            "color": `${color}`,
                                            "fields": [
                                                {
                                                    "name": "Niveau de partage des données",
                                                    "value": "Uniquement le status du compte",
                                                    "inline": false
                                                },
                                                {
                                                    "name": "Informations générales :",
                                                    "value": `ID : ${infos.id}\nPseudonyme : ${infos.username}\nRang : ${rank}\n Email : ${infos.email}`,
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
                                        message.channel.send(embed)
                                        break; 
                                    case 2:
                                        var embed = new Discord.RichEmbed({
                                            "title": `Profil de ${personn} (noreqs)`,
                                            "thumbnail": {
                                                "url": `${infos.photo}?size=200`
                                            },
                                            "color": `${color}`,
                                            "fields": [
                                                {
                                                    "name": "Niveau de partage des données",
                                                    "value": "Uniquement le status du compte + Données annexes",
                                                    "inline": false
                                                },
                                                {
                                                    "name": "Informations générales :",
                                                    "value": `ID : ${infos.id}\nPseudonyme : ${infos.username}\nRang : ${rank}\n Email : ${infos.email}`,
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
                                        message.channel.send(embed);
                                        break;
                                    case 3:              
                                        var embed = new Discord.RichEmbed({
                                            "title": `Profil de ${personn} (noreqs)`,
                                            "thumbnail": {
                                                "url": `${infos.photo}?size=200`
                                            },
                                            "color": `${color}`,
                                            "fields": [
                                                {
                                                    "name": "Niveau de partage des données",
                                                    "value": "Toutes les données",
                                                    "inline": false
                                                },
                                                {
                                                    "name": "Informations générales :",
                                                    "value": `ID : ${infos.id}\nPseudonyme : ${infos.username}\nRang : ${rank}\n Email : ${infos.email}`,
                                                    "inline": true
                                                },
                                                {
                                                    "name": "Informations personnelles :",
                                                    "value": `Prénom : ${infos.first_name}\nNom : ${infos.last_name}\nDate de naissance : ${infos.birthday}\nNiveau scolaire : ${classroom}`,
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
                                        message.channel.send(embed)
                                        break;  
                                }
                                break;
                            case 1:
                                //Public mode
                                switch(response.data.authorization_level) {
                                    case 0:
                                        var embed = new Discord.RichEmbed({
                                            "title": `Profil de ${personn}`,
                                            "thumbnail": {
                                                "url": `${infos.photo}`
                                            },
                                            "color": `${color}`,
                                            "fields": [
                                                {
                                                    "name": "Niveau de partage des données",
                                                    "value": "Ne rien partager",
                                                },
                                                {
                                                    "name": "Informations générales :",
                                                    "value": `ID : ${infos.id}\nPseudonyme : ${infos.username}\nRang : ${rank}`,
                                                }
                                            ]
                                        })
                                        message.channel.send(embed)
                                        break;
                                    case 1:
                                        var embed = new Discord.RichEmbed({
                                            "title": `Résultats de recherche pour : ${personn}`,
                                            "thumbnail": {
                                                "url": `${infos.photo}?size=200`
                                            },
                                            "color": `${color}`,
                                            "fields": [
                                                {
                                                    "name": "Niveau de partage des données",
                                                    "value": "Uniquement le status du compte",
                                                    "inline": false
                                                },
                                                {
                                                    "name": "Informations générales :",
                                                    "value": `ID : ${infos.id}\nPseudonyme : ${infos.username}\nRang : ${rank}\n`,
                                                    "inline": true
                                                },
                                                {
                                                    "name": "Flags :",
                                                    "value": `Membre de l'association : ${assos_member}\nBug Hunter : ${bug_hunter}\nMembre premium : ${premium}`,
                                                    "inline": true
                                                },
                                                {
                                                    "name": "Divers :",
                                                    "value": `Compte vérifié : ${verified}\nControl parental : ${control}\nCGU acceptés : ${cgu}`,
                                                    "inline": true
                                                },
                                                {
                                                    "name": "Sanctions :",
                                                    "value": `Banni : ${ban}`,
                                                    "inline": true
                                                }
                                            ]
                                        })
                                        message.channel.send(embed)
                                        break; 
                                    case 2:
                                        var embed = new Discord.RichEmbed({
                                            "title": `Résultats de recherche pour : ${personn}`,
                                            "thumbnail": {
                                                "url": `${infos.photo}?size=200`
                                            },
                                            "color": `${color}`,
                                            "fields": [
                                                {
                                                    "name": "Niveau de partage des données",
                                                    "value": "Uniquement le status du compte + Données annexes",
                                                    "inline": false
                                                },
                                                {
                                                    "name": "Informations générales :",
                                                    "value": `ID : ${infos.id}\nPseudonyme : ${infos.username}\nRang : ${rank}`,
                                                    "inline": true
                                                },
                                                {
                                                    "name": "Flags :",
                                                    "value": `Membre de l'association : ${assos_member}\nBug Hunter : ${bug_hunter}\nMembre premium : ${premium}`,
                                                    "inline": true
                                                },
                                                {
                                                    "name": "Divers :",
                                                    "value": `Compte vérifié : ${verified}\nA2F : ${adf}\nControl parental : ${control}\nCGU acceptés : ${cgu}`,
                                                    "inline": true
                                                },
                                                {
                                                    "name": "Sanctions :",
                                                    "value": `Banni : ${ban}`,
                                                    "inline": true
                                                }
                                            ]
                                        })
                                        message.channel.send(embed);
                                        break;
                                    case 3:
                                        var embed = new Discord.RichEmbed({
                                            "title": `Résultats de recherche pour : ${personn}`,
                                            "thumbnail": {
                                                "url": `${infos.photo}?size=200`
                                            },
                                            "color": `${color}`,
                                            "fields": [
                                                {
                                                    "name": "Niveau de partage des données",
                                                    "value": "Toutes les données",
                                                    "inline": false
                                                },
                                                {
                                                    "name": "Informations générales :",
                                                    "value": `ID : ${infos.id}\nPseudonyme : ${infos.username}\nRang : ${rank}`,
                                                    "inline": true
                                                },
                                                {
                                                    "name": "Flags :",
                                                    "value": `Membre de l'association : ${assos_member}\nBug Hunter : ${bug_hunter}\nMembre premium : ${premium}`,
                                                    "inline": true
                                                },
                                                {
                                                    "name": "Divers :",
                                                    "value": `Compte vérifié : ${verified}\nA2F : ${adf}\nControl parental : ${control}\nCGU acceptés : ${cgu}`,
                                                    "inline": true
                                                },
                                                {
                                                    "name": "Sanctions :",
                                                    "value": `Banni : ${ban}`,
                                                    "inline": true
                                                }
                                            ]
                                        })
                                        message.channel.send(embed)
                                        break;     
                                }
                            break;
                        }
                        
                        }else if(response.message === "no user found"){
                            var embed = new Discord.RichEmbed({
                                "fields": [
                                    {
                                        "name": "OHH ! Une erreur est survenue !",
                                        "value": `Hmmmm... Il semblerait que notre superbe API n'ait trouvé aucun utilisateur avec un pseudonyme de "${personn}"`,
                                    }
                                ]
                            })
                            message.channel.send(embed)
                        }else{
                            var embed = new Discord.RichEmbed({
                                "fields": [
                                {
                                "name": "OHH ! Une erreur est survenue !",
                                "value": `J'ai buggé... Je suis désolé mais voici la raison de mon bug : ${response.message}`,
                                "inline": true
                                }
                                ]
                            })
                            message.channel.send(embed)
                        }
                        
                    }
                })
                .catch(function (err) {
                    return message.channel.send(`Error : ${err}`)
                })
            })
        }else{
            message.channel.send(`Désolé ${message.author} mais vous avez oublié d'ajouter le pseudonyme de la personne à chercher dans la base de donnée d'Edu-Focus`)
        }
    }

    if(cmd === (prefix + 'staff')){
        retreiveStaffList(key).then(function(list){
            var adminsys = ''
            var admin = ''
            var modo = ''
            Object(list).forEach(function(list) {
                if(list.profile.rank === 'system') return

                if(list.misc.discord_id != null){
                    var id_discord = `(<@${list.misc.discord_id}>)`
                }else{
                    var id_discord = "(Aucun compte discord relié)"
                }

                switch (list.profile.rank) {                    
                    case 'system_main_admin':
                        adminsys += `${list.profile.username} ${id_discord}\n`
                        break;
                    case 'administrator':
                        admin += `${list.profile.username} ${id_discord}\n`
                        break;
                    case 'moderator':
                        modo += `${list.profile.username} ${id_discord}\n`
                        break;
                }                
            });

            var embed = new Discord.RichEmbed({
                "title": "Liste des membres du staff d'Edu-Focus",
                "fields": [
                    {
                        "name": "Administrateurs systèmes",
                        "value": `${adminsys}`,
                    },
                    {
                        "name": "Administrateurs",
                        "value": `${admin}`,
                    },
                    {
                        "name": "Modérateurs",
                        "value": `${modo}`,
                    }
                ]
            })
            message.channel.send(embed)
        }).catch(function(err){
            console.log(err)
        })
    }

    if(cmd === (prefix + 'sysban')){
        let mention = message.mentions.users.first();
        if(!mention) return message.channel.send('Tu as oublié de mentionner un utilisateur...')
        if(mention.id === '498570647124049942') return message.channel.send("Je ne peux pas m'auto bannir...")
        if(mention.id === message.author.id) return message.channel.send("Tu ne peux pas t'auto bannir...")

        if(args[1]){
            var raison = message.content.split(' ').slice(2).join(' ')
        }else{
            return message.channel.send('Une raison doit être fournie...')
        }

        var restriction = 1
        var staffmention = 0
        retreiveStaffList(key).then(function(list){
            for(i = 0; i < list.length ; i++){
                if(list[i].misc.discord_id != null){
                    if(mention.id == list[i].misc.discord_id) staffmention = 1
                    if(message.author.id == list[i].misc.discord_id && list[i].profile.rank === 'system_main_admin') restriction = 0
                }
            }
            if(restriction === 1) return message.channel.send("Cette commande est réservée aux ``Administrateurs Système`` d'Edu-Focus")
            if(staffmention === 1) return message.channel.send("Tu ne peux pas bannir un membre du staff d'Edu-Focus")

            banbdd[mention.id] = {
                "username": mention.username,
                "banni": "1",
                "time": dateFr(),
                "reason": raison
            }
            fs.writeFile("./bdd/ban.json", JSON.stringify(banbdd, null, 4), (err) => {
                if(err) message.channel.send("Une erreur est survenue");
            });
            message.channel.send('Utilisateur blacklisté avec succès.')
        })
    }
});

var staffList = null;
var fallbackOccurences = 0;
var doRequest = true;

function retreiveStaffList(key) {
    return new Promise(function(resolve, reject){
        if (doRequest) {
            request({
                uri: 'https://edu-focus.org/api/discord/staff',
                json: true,
                qs: {
                    key: key
                }
            }).then(function (response) {

                doRequest = false;
                fallbackOccurences = 0;
                setTimeout(function(){
                    doRequest = true
                }, 10000);

                if (response.status === 'success') {
                    staffList = response.data.staff_members;

                    resolve(staffList);
                } else {
                    if (staffList === null) {
                        console.error('Error: The api refused to retrive data (reason: ' + response.message + '), unable to continue due to absence of cache.');
                        reject('refused_then_no_cache')
                    } else if (fallbackOccurences < 3) {
                        console.warn('Warning: The api refused to retrive data (reason: ' + response.message + '), using cached datas to continue.');
                        fallbackOccurences++;
                        resolve(staffList);
                    } else {
                        console.error('Error: The api refused to retrive data (reason: ' + response.message + '), unable to continue due to outdated cache.');
                        reject('refused_then_outdated_cache');
                    }
                }
            }).catch(function (err) {
                if (staffList === null) {
                    console.error('Error: Failed to retreive datas, unable to continue due to absence of cache.');
                    reject('fail_then_no_cache')
                } else if (fallbackOccurences < 3) {
                    console.warn('Warning: Failed to retreive datas, using cached datas to continue.');
                    fallbackOccurences++;
                    resolve(staffList);
                } else {
                    console.error('Error: Failed to retreive datas, unable to continue due to outdated cache.');
                    reject('fail_then_outdated_cache');
                }
            });
        } else {
            resolve(staffList);
            return;
        }
    });
}

function dateFr(){
    var jours = new Array("Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi");
    var mois = new Array("Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre");
    var date = new Date();
    var heure = date.getHours();
    var minutes = date.getMinutes();
    var rep = jours[date.getDay()] + " ";
    rep += date.getDate() + " ";
    rep += mois[date.getMonth()] + " ";
    rep += date.getFullYear() + " ";

    if(minutes < 10){
    rep += heure + "h"
    rep += '0' + minutes
    }else{
    rep += heure + "h"
    rep += minutes
    }
    return rep;
}