exports.run = async (client, message, args, key) => {
    const msg = await message.channel.send("Pong!");
    await msg.edit(`Pong! *(Latency: ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency: ${Math.round(client.ping)}ms*)`);
};

exports.conf = {
    name: "ping",
    aliases: [],
    help: {
        category: "Utilitaires",
        description: "Retourne le ping du bot",
        usage: "EF!ping"
    }
};