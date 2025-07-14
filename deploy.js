// deploy.js

require('dotenv').config();
const { REST, Routes } = require('discord.js');
const { CLIENT_ID: clientId, GUILD_ID: guildId, DISCORD_TOKEN: token } = process.env;
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
// Pega todos os arquivos de comando do diretório 'commands'
const commandsPath = path.join(__dirname, 'commands');
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

// Constrói e prepara uma instância do módulo REST
const rest = new REST().setToken(token);

// E faz o deploy dos seus comandos!
(async () => {
    try {
        console.log(`Iniciando a atualização de ${commands.length} comandos (/) da aplicação.`);

        // O método put é usado para atualizar todos os comandos da guilda com o conjunto atual
        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId), // Use applicationCommands(clientId) para comandos globais
            { body: commands },
        );

        console.log(`Foram recarregados com sucesso ${data.length} comandos (/) da aplicação.`);
    } catch (error) {
        console.error(error);
    }
})();