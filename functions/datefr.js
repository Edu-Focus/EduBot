module.exports = async (client) => {
    var jours = new Array("Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi");
    var mois = new Array("Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre");
    var date = new Date();
    var heure = date.getHours();
    var minutes = date.getMinutes();
    var rep = jours[date.getDay()] + " ";
    rep += date.getDate() + " ";
    rep += mois[date.getMonth()] + " ";
    rep += date.getFullYear() + " ";

    rep += heure + "h"

    if(minutes < 10){
        rep += '0' + minutes
    }else{
        rep += minutes
    }

    return rep;
}