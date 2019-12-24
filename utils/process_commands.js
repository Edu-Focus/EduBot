module.exports = (client) => {
    client.on('message', async message => {
        if (message.author.bot) return;
        if (message.content.indexOf(client.config.defaultSettings.prefix) !== 0) return;

        const args = message.content.slice(client.config.defaultSettings.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        const key = client.config.api_key

        const cmd = client.commands.get(command);
        if (!cmd) return;

        await cmd.run(client, message, args, key)
    });
};