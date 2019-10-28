module.exports = (client) => {
    client.on('message', async message => {
        if (message.author.bot) return;
        if (message.content.indexOf(client.config.defaultSettings.prefix) !== 0) return;

        const args = message.content.slice(client.config.defaultSettings.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
        if (!cmd) return;

        await cmd.run(client, message, args)
    });
};