// events/interactionCreate.js
const { MessageFlags } = require('discord.js');
module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) return;
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Erro ao executar o comando '${interaction.commandName}' por '${interaction.user.tag}'.`, error);
            await interaction.reply({ content: 'Houve um erro ao executar este comando!', flags: MessageFlags.Ephemeral });
        }
    },
};