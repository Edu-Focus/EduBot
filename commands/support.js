exports.run = async (client, message, args, level) => {
    await message.channel.send("Notre serveur discord : <https://edu-foc.us/discord> (ou edu-foc.us/ds)\n" +
        "Le serveur discord test (attention spam) : <https://edu-foc.us/discord-sandbox>");
};

exports.conf = {
    name: "support",
    aliases: ["discord"],
    help: {
        category: "Utilitaires",
        description: "Envoie les liens d'invitations pour les serveurs discord d'Edu-Focus",
        usage: "discord"
    }
};