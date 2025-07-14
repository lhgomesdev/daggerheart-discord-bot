// commands/rolada.js

const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rolar')
        .setDescription('Rola qualquer combinação de dados (ex: 2d6, d20, 3d4).')
        .addStringOption(option =>
            option.setName('dados')
                .setDescription('O tipo e a quantidade de dados a rolar (formato: XdY).')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('modificador')
                .setDescription('O bônus ou penalidade a ser somado ao total.')
                .setRequired(false)),

    async execute(interaction) {
        const diceString = interaction.options.getString('dados').toLowerCase();
        const modifier = interaction.options.getInteger('modificador') ?? 0;

        const parts = diceString.split('d');
        if (parts.length !== 2) {
            return interaction.reply({ content: 'Formato de dado inválido! Use o formato `XdY` (ex: `2d6` ou `d20`).', flags: MessageFlags.Ephemeral });
        }

        const numberOfDice = parts[0] ? parseInt(parts[0]) : 1;
        const numberOfSides = parseInt(parts[1]);

        if (isNaN(numberOfDice) || isNaN(numberOfSides) || numberOfDice < 1 || numberOfSides < 2) {
            return interaction.reply({ content: 'Formato de dado inválido! Verifique os números e use o formato `XdY`.', flags: MessageFlags.Ephemeral });
        }
        if (numberOfDice > 100) {
            return interaction.reply({ content: 'Desculpe, só consigo rolar até 100 dados por vez.', flags: MessageFlags.Ephemeral });
        }

        let rolls = [];
        let sum = 0;
        for (let i = 0; i < numberOfDice; i++) {
            const roll = Math.floor(Math.random() * numberOfSides) + 1;
            rolls.push(roll);
            sum += roll;
        }

        const finalResult = sum + modifier;
        
        const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle(`Rolando ${diceString.toUpperCase()}`)
            .setDescription(`**Resultados:** ${rolls.join(', ')}`)
            .addFields(
                { name: 'Soma dos Dados', value: `🎲 ${sum}`, inline: true },
                { name: 'Modificador', value: `⚖️ ${modifier > 0 ? `+${modifier}` : modifier}`, inline: true },
                { name: 'Resultado Final:', value: `> ${finalResult}` }
            )
            .setTimestamp()
            .setFooter({ text: `Rolado por: ${interaction.user.username}` });

        await interaction.reply({ embeds: [embed] });
    },
};