const fs = require('fs');

module.exports = (client) => {
    client.on('message', async message => {
        const ignore_users = JSON.parse(fs.readFileSync("./config/ignore_users.json", "utf8"));

        if (message.author.bot) return;
        if (
            !/^[🌵🎄🌲🌳🌴🌱🌿☘️🍀🎍🎋🍃🍂🍁🌾🌺🌻🌹🌷🌼🌸💐🍄🌰🎃🥀🍏🍎🍐🍊🍋🍌🍉🍇🍓🍈🍒🍑🍍🍅🍆🌶️🌽🍠🥑🥒🥔🥕🍫]+$/.test(message.content)
            && message.channel.id === '540528057379717120'
        ){
            message.delete()
            return message.channel.send('Que des emojis autorisés').then(message => {
                setTimeout(() => {
                    message.delete()
                },5000)
            }) 
        }
        if (ignore_users[message.author.id]) return /*message.channel.send('NOP')*/;
        if (message.content.indexOf(client.config.defaultSettings.prefix) !== 0) return;

        const args = message.content.slice(client.config.defaultSettings.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        const key = client.config.api_key

        const cmd = client.commands.get(command);
        if (!cmd) return;

        await cmd.run(client, message, args, key)
    });
};