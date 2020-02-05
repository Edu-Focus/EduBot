const Discord = require("discord.js");
const Enmap = require("enmap");

const {promisify} = require("util");
const readdir = promisify(require("fs").readdir);

const client = new Discord.Client();
client.config = require("./config/config.js");

require("./utils/manager")(client);
require("./utils/process_commands")(client);

client.commands = new Enmap();
client.aliases = new Enmap();

const init = async () => {
    const cmdFiles = await readdir("./commands/");
    cmdFiles.forEach(f => {
        if (!f.endsWith(".js")) return;

        const response = client.loadCommand(f);

        if (response) console.log(response)
    });

    console.log("\nConnection...");
    await client.login(client.config.token)
};

init().then(() => console.log("\nEdu-Focus, tout le monde a le droit d\'apprendre !"));

client.on("ready", () => {
  client.user.setActivity(`Edu-Focus, tout le monde a le droit d\'apprendre !`);             
});