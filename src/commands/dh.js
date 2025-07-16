// commands/dh.js

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dh')
        .setDescription('Rola os dados de Daggerheart com a opção de um modificador.')
        .addIntegerOption(option =>
            option.setName('modificador')
                .setDescription('O bônus ou penalidade a ser somado ao resultado (ex: 2, -1).')
                .setRequired(false)), // O modificador é opcional

    async execute(interaction) {
        const modifier = interaction.options.getInteger('modificador') ?? 0;

        const hopeDie = Math.floor(Math.random() * 12) + 1;
        const fearDie = Math.floor(Math.random() * 12) + 1;

        let resultMessage = '';
        let finalResult = 0;
        let embedColor = '#808080';

        if (hopeDie === fearDie) { // Critico, dois valores iguais
            finalResult = hopeDie + fearDie + modifier;
            resultMessage = `⚔️ **Critou!** ⚔️`;
            embedColor = '#ff0000'; 
        } else if (hopeDie > fearDie) { // Hope saiu maior
            finalResult = hopeDie + fearDie + modifier;
            resultMessage = "✨ **Rolada com Hope!**";
            embedColor = '#eccb38'; 
        } else { // Fear saiu maior
            finalResult = hopeDie + fearDie + modifier;
            resultMessage = "🔥 **Rolada com Fear!**";
            embedColor = '#ae42ed';
        }

        const description = `
            **🎲 Dado da Esperança:** ${hopeDie}
            **💀 Dado do Medo:** ${fearDie}
            **⚖️ Modificador:** ${modifier > 0 ? `+${modifier}` : modifier}
            
            # ${resultMessage}
            
            ## Resultado Final: ${finalResult}
        `;

        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle('Rolagem de Daggerheart')
            .setDescription(description)
            .setTimestamp()
            .setFooter({ text: `Rolado por: ${interaction.user.username}` });

        await interaction.reply({ embeds: [embed] });
    },
}