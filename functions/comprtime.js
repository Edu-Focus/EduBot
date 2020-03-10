module.exports = async (olddate, newdate) => {
    var years = newdate.getFullYear() - olddate.getFullYear()
    var months = (newdate.getMonth() - olddate.getMonth()) + (years * 12)
    var days = newdate.getDate() - olddate.getDate()
    var hours = newdate.getHours() - olddate.getHours()
    var minutes = newdate.getMinutes() - olddate.getMinutes()
    var seconds = newdate.getSeconds() - olddate.getSeconds()
    if(months == 0){ var rep = `${days}j ${hours}h ${minutes}m ${seconds}s`}
    else{ var rep = `${months} mois ${days} jours ${hours}h ${minutes}m ${seconds}s` }
    return rep
}