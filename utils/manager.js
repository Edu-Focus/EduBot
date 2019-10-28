module.exports = (client) => {
    client.loadCommand = (commandName) => {
        try {
            const props = require(`../commands/${commandName}`);
            if (props.init) {
                props.init(client);
            }

            client.commands.set(props.conf.name, props);
            props.conf.aliases.forEach(alias => {
                client.aliases.set(alias, props.conf.name);
            });

            console.log(`Command ${commandName} loaded !`);
            return false
        } catch (e) {
            return `Failed to load command ${commandName}: ${e}`;
        }
    };

    client.on('ready', async () => {
        await client.user.setPresence('Edu-Focus, tout le monde a le droit d\'apprendre !');
        console.log(client.commands.array().length + " commands loaded")
    });
};