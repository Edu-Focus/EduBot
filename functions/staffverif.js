const stafflist = require("./stafflist.js")

//rank_verif = le rang pour le quel on est ok
//false = OK l'user discord fait parti du staff d'EF
//false = l'user discord NE FAIT PAS PARTI du staff d'EF
module.exports = async (rank_verif, auth) => {
    var verif = false
    await stafflist().then(function(list) {
        for(let i = 0; i<list.length; i++){
            let id = list[i].misc.discord_id;
            if(id === auth && list[i].profile.rank === rank_verif){
                verif = false;
                return;
            }
        }
    })
    return verif
}