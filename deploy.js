// deploy.js

require('dotenv').config();
const { REST, Routes } = require('discord.js');
const { CLIENT_ID: clientId, GUILD_ID: guildId, DISCORD_TOKEN: token } = process.env;
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const commandsPath = path.join(__dirname, 'src', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
    } else {
        console.log(`[AVISO] O comando em ${filePath} está faltando a propriedade "data" ou "execute".`);
    }
}

const rest = new REST().setToken(token);

(async () => {
    try {
        console.log(`Iniciando a atualização de ${commands.length} comandos (/) da aplicação.`);

        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log(`Foram recarregados com sucesso ${data.length} comandos (/) da aplicação.`);
    } catch (error) {
        console.error(error);
    }
})();