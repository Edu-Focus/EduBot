const Discord = require("discord.js");

exports.run = async (client, message, args, key) => {
    let categories = [];
    client.commands.array().forEach(command => {
        if (categories[command.conf.help.category] === undefined) categories[command.conf.help.category] = [];
        categories[command.conf.help.category].push(command)
    });

    const e = new Discord.RichEmbed();
    e.title = "Page d'aide";
    e.color = 0x4527A0;
    let fields = [];

    for (let category in categories) {
        let field = {
            name: `**__${category}__**`,
            value: ""
        };

        for (let command of categories[category]) {
            field.value += `**__${command.conf.name}__**: ${command.conf.help.description} (usage: \`${command.conf.help.usage}\``;
            field.value += command.conf.aliases.length > 0 ? ` | alias: ${command.conf.aliases.join(", ")})\n` : `)\n`
        }
        fields.push(field)
    }

    e.fields = fields;
    e.footer = {text: "{} = Obligatoire ---- () = Optionnel"};
    await message.channel.send(e)
};

exports.conf = {
    name: "help",
    aliases: [],
    help: {
        category: "Utilitaires",
        description: "Affiche les informations sur les commandes",
        usage: "EF!help"
    }
};