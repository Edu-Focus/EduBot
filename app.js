const Discord = require("discord.js");
const request = require("request-promise")
//const fs = require("fs");
const bot = new Discord.Client();
const config = require("./botconfig.json");
//bot.commands = new Discord.Collection();
let prefix = ("EF!");

/*fs.readdir("./commandes/", (err, files) => {
    if(err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0){
        console.log("Les fichiers commandes n'ont pas été trouvés");
        return;
    }

    jsfile.forEach((f, i) =>{
        let props = require(`./commandes/${f}`);
        console.log(`${f} a bien été chargé`)
        bot.commands.set(props.help.name, props);
    });
});*/

bot.login(config.token)
const key = config.api_key

bot.on("ready", async () => {
    console.log('Fichier \'app.js\' chargé !')
    console.log(`${bot.user.username} est maintenant en ligne`);
    bot.user.setGame("Edu-Focus, tout le monde a le droit d'apprendre !")
});

bot.on ("message", message => {
    if (message.author.bot || message.channel.type === "dm") return

    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    /*let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if(commandfile) commandfile.run(bot,message,args,key);*/

    if(cmd === (prefix + "ping")){
        message.channel.send("Pong")
    }
    
    if(cmd === (prefix + 'userinfo')){
        if(args[0]){
            var personn = args[0];
    
            if(!/^[A-Za-z0-9_-sáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]{4,40}$/.test(personn)) {
                return message.channel.send(`La recherche \`${args[0]}\` ne peut être effectuée car elle contient des caractères invalides.`);
            }
    
            if(args[1]) var mode = args[1]
    
            var restriction = 1
            if(message.author.id === "254567903742001153" || message.author.id === "300910791362740224"){
                //On est en mode "ADMIN"
                if(message.guild.id == "528679953399676938"){
                    //On est dans le bon serveur, possibilitée d'exécuter la commande sans restriction
                    if(message.channel.id == "602277789349052426"){
                        //POWWWWWWWWWEEEEEEEEEEEEEEEER
                        var restriction = 0
                    }else if(mode && mode === "-noreqs") {
                        var restriction = 0
                    }
                }
            }
            //message.channel.send(`\`\`\`INFOS :\nAUTH : ${message.author.id}\nGUILD : ${message.guild.id}\nCHAN : ${message.channel.id}\nRESTRIC : ${restriction}\`\`\``)
    
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
    
                        switch(response.data.informations.rank){
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
    
                        switch(restriction){
                            case 0:
                                //Uncensored
                                switch(response.data.authorization_level) {
                                    case 0:
    
                                        var embedd = new Discord.RichEmbed({
                                            "title": `Profil de ${personn}`,
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
                                                    "value": `ID : ${response.data.informations.id}\nPseudonyme : ${response.data.informations.username}\nRang : ${rank}`,
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
                                        var control = infos.parental_control.status==='yes'?':white_check_mark:':':x:'
                                        var parent = infos.parental_control.parent_id==='yes'?infos.parental_control.parent_id:':x:'
                                        var cgu = infos.cgu_accepted === true?':white_check_mark:':':x:';
                                        var verified = infos.verified === true?':white_check_mark:':':x:';
            
                                        var embedd = new Discord.RichEmbed({
                                            "title": `Résultats de recherche pour : _${personn}_`,
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
                                                    "value": `ID : ${response.data.informations.id}\nPseudonyme : ${response.data.informations.username}\nRang : ${rank}\n Email : ${response.data.informations.email}`,
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
                                        var control = infos.parental_control.status==='yes'?':white_check_mark:':':x:'
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
    
                                        if(schoolsString == "") schoolsString = "Aucune école"
            
                                        var embedd = new Discord.RichEmbed({
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
                                                    "value": `ID : ${response.data.informations.id}\nPseudonyme : ${response.data.informations.username}\nRang : ${rank}\n Email : ${response.data.informations.email}`,
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
                                        var control = infos.parental_control.status==='yes'?':white_check_mark:':':x:'
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
    
                                        if(schoolsString == "") schoolsString = "Aucune école"
    
                                            var level = response.data.informations.classroom
    
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
            
                                        var embedd = new Discord.RichEmbed({
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
                                                    "value": `ID : ${response.data.informations.id}\nPseudonyme : ${response.data.informations.username}\nRang : ${rank}\n Email : ${response.data.informations.email}`,
                                                    "inline": true
                                                },
                                                {
                                                    "name": "Informations personnelles :",
                                                    "value": `Prénom : ${response.data.informations.first_name}\nNom : ${response.data.informations.last_name}\nDate de naissance : ${response.data.informations.birthday}\nNiveau scolaire : ${classroom}`,
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
                                break;
                            case 1:
                                //Censured
                                switch(response.data.authorization_level) {
                                    case 0:
                                        var embedd = new Discord.RichEmbed({
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
                                                    "value": `ID : ${response.data.informations.id}\nPseudonyme : ${response.data.informations.username}\nRang : ${rank}`,
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
                                        //var time = infos.ban.banned?infos.ban.until:':x:';
                                        //var reason = infos.ban.banned?infos.ban.reason:':x:';
                                        var control = infos.parental_control.status==='yes'?':white_check_mark:':':x:'
                                        //var parent = infos.parental_control.parent_id==='yes'?infos.parental_control.parent_id:':x:'
                                        var cgu = infos.cgu_accepted === true?':white_check_mark:':':x:';
                                        var verified = infos.verified === true?':white_check_mark:':':x:';
            
                                        var embedd = new Discord.RichEmbed({
                                            "title": `Résultats de recherche pour : _${personn}_`,
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
                                                    "value": `ID : ${response.data.informations.id}\nPseudonyme : ${response.data.informations.username}\nRang : ${rank}\n`,
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
                                        message.channel.send(embedd)
                                        break; 
                                    case 2:
                                        var assos_member = infos.flags.is_assoc_member?':white_check_mark:':':x:';
                                        var bug_hunter = infos.flags.is_bug_hunter?':white_check_mark:':':x:';
                                        var premium = infos.flags.is_premium?':white_check_mark:':':x:';
                                        var ban = infos.ban.banned?':white_check_mark:':':x:';
                                        //var time = infos.ban.banned?infos.ban.until:':x:';
                                        //var reason = infos.ban.banned?infos.ban.reason:':x:';
                                        var control = infos.parental_control.status==='yes'?':white_check_mark:':':x:'
                                        //var parent = infos.parental_control.parent_id==='yes'?infos.parental_control.parent_id:':x:'
                                        var cgu = infos.cgu_accepted === true?':white_check_mark:':':x:';
                                        var verified = infos.verified === true?':white_check_mark:':':x:';
                                        var adf = infos['2fa_enabled']?':white_check_mark:':':x:';
                                        /*var login_methods = response.data.login_method;
                                        var google = login_methods.google?':white_check_mark:':':x:';
                                        var discord = login_methods.discord?':white_check_mark:':':x:';
                                        var entmip = login_methods.entmip?':white_check_mark:':':x:';*/
            
                                        /*var schools = response.data.schools;
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
                                        schoolsString = schoolsString.substr(0, schoolsString.length-2);*/
            
                                        var embedd = new Discord.RichEmbed({
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
                                                    "value": `ID : ${response.data.informations.id}\nPseudonyme : ${response.data.informations.username}\nRang : ${rank}`,
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
                                                /*{
                                                    "name": "Ecoles :",
                                                    "value": schoolsString,
                                                    "inline": true
                                                },*/
                                                /*{
                                                    "name": "Methodes de connection :",
                                                    "value": `Google : ${google}\nDiscord : ${discord}\nEntmip : ${entmip}`,
                                                    "inline": true
                                                },*/
                                                {
                                                    "name": "Sanctions :",
                                                    "value": `Banni : ${ban}`,
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
                                        //var time = infos.ban.banned?infos.ban.until:':x:';
                                        //var reason = infos.ban.banned?infos.ban.reason:':x:';
                                        var control = infos.parental_control.status==='yes'?':white_check_mark:':':x:'
                                        //var parent = infos.parental_control.parent_id==='yes'?infos.parental_control.parent_id:':x:'
                                        var cgu = infos.cgu_accepted === true?':white_check_mark:':':x:';
                                        var verified = infos.verified === true?':white_check_mark:':':x:';
                                        var adf = infos['2fa_enabled']?':white_check_mark:':':x:';
                                        /*var login_methods = response.data.login_method;
                                        var google = login_methods.google?':white_check_mark:':':x:';
                                        var discord = login_methods.discord?':white_check_mark:':':x:';
                                        var entmip = login_methods.entmip?':white_check_mark:':':x:';*/
    
                                        /*var schools = response.data.schools;
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
                                        schoolsString = schoolsString.substr(0, schoolsString.length-2);*/
            
                                        var embedd = new Discord.RichEmbed({
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
                                                    "value": `ID : ${response.data.informations.id}\nPseudonyme : ${response.data.informations.username}\nRang : ${rank}`,
                                                    "inline": true
                                                },
                                                /*{
                                                    "name": "Informations personnelles :",
                                                    "value": `Prénom : ${response.data.informations.first_name}\nNom : ${response.data.informations.last_name}\nDate de naissance : ${response.data.informations.birthday}\nClasse : ${response.data.informations.classroom}eme`,
                                                    "inline": true
                                                },*/
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
                                                /*{
                                                    "name": "Etablissements scolaires :",
                                                    "value": schoolsString,
                                                    "inline": true
                                                },*/
                                                /*{
                                                    "name": "Methodes de connection :",
                                                    "value": `Google : ${google}\nDiscord : ${discord}\nEntmip : ${entmip}`,
                                                    "inline": true
                                                },*/
                                                {
                                                    "name": "Sanctions :",
                                                    "value": `Banni : ${ban}`,
                                                    "inline": true
                                                }
                                            ]
                                        })
                                        message.channel.send(embedd)
                                        break;     
                                }
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
                            /*var embedd = new Discord.RichEmbed({
                                "fields": [
                                {
                                "name": "OHH ! Une erreur est survenue !",
                                "value": `J'ai buggé... Je suis désolé mais voici la raison de mon bug : ${response.message}`,
                                //"inline": true
                                }
                                ]
                            })*/
                            message.channel.send(embedd)
                        }
                        
                    }
                })
                .catch(function (err) {
                    return message.channel.send(`ERREUR #B002\nDebug : ${err}`)
                })
            })
        }else{
            message.channel.send(`Désolé ${message.author} mais vous avez oublié d'ajouter le pseudonyme de la personne à chercher dans la base de donnée d'Edu-Focus`)
        }
    }

    if(cmd === (prefix + 'staff')){
        retreiveStaffList(key).then(function(list){
            /*console.log('SUCCES')
            console.log("Réponse du serveur: \`\`\`json\n"+JSON.stringify(list,null)+"\n\`\`\`");*/

            var staff = '';
            var adminsys = ''
            var admin = ''
            var modo = ''
            Object(list).forEach(function(list) {
                //console.log(list)
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
});

var staffList = null;
var fallbackOccurences = 0;
var doRequest = true;

function retreiveStaffList(apiKey) {
    return new Promise(function(resolve, reject){
        if (doRequest) {
            request({
                uri: 'https://edu-focus.org/api/discord/staff',
                json: true,
                qs: {
                    key: apiKey
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
