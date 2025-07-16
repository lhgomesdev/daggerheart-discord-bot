// events/interactionCreate.js
const { MessageFlags } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (interaction.isAutocomplete()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.autocomplete(interaction);
            } catch (error) {
                console.error("Erro no autocompletar:", error);
            }
            return;
        }

        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Erro ao executar o comando '${interaction.commandName}' por '${interaction.user.tag}'.`, error);
                
                // Verifica se a interação já foi respondida ou deferida
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'Houve um erro ao executar este comando!', flags: MessageFlags.Ephemeral });
                } else {
                    await interaction.reply({ content: 'Houve um erro ao executar este comando!', flags: MessageFlags.Ephemeral });
                }
            }
        }
    },
};