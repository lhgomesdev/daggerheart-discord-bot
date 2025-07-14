// commands/fear.js

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { readData, writeData } = require('../database.js');

const skullImages = [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Noto_Emoji_v2.034_1f480.svg/1200px-Noto_Emoji_v2.034_1f480.svg.png',
    'https://i.redd.it/vqljhrcu0kie1.png',
    'https://png.pngtree.com/png-vector/20240127/ourmid/pngtree-skull-face-emoji-png-image_11500211.png'
];


module.exports = {
    data: new SlashCommandBuilder()
        .setName('fear')
        .setDescription('Gerencia o nível de Medo da mesa.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('verificar')
                .setDescription('Verifica o nível atual de Medo.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('adicionar')
                .setDescription('Adiciona um valor ao Medo.')
                .addIntegerOption(option => option.setName('valor').setDescription('Quanto Medo adicionar').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remover')
                .setDescription('Remove um valor do Medo.')
                .addIntegerOption(option => option.setName('valor').setDescription('Quanto Medo remover').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('definir')
                .setDescription('Define o Medo para um valor específico.')
                .addIntegerOption(option => option.setName('valor').setDescription('O novo valor do Medo').setRequired(true))),
    async execute(interaction) {
        const db = readData();
        const guildId = interaction.guildId;

        if (!db[guildId]) {
            db[guildId] = {
                serverData: { fear: 0 },
                users: {}
            };
        }
        if (!db[guildId].serverData) {
            db[guildId].serverData = { fear: 0 };
        }


        const subcommand = interaction.options.getSubcommand();
        const valor = interaction.options.getInteger('valor');
        let currentFear = db[guildId].serverData.fear || 0;

        if (subcommand === 'adicionar') {
            currentFear += valor;
        } else if (subcommand === 'remover') {
            currentFear -= valor;
        } else if (subcommand === 'definir') {
            currentFear = valor;
        }
        
        if (currentFear < 0) {
            currentFear = 0;
        }

        db[guildId].serverData.fear = currentFear;
        writeData(db);

        const randomIndex = Math.floor(Math.random() * skullImages.length);
        const randomImage = skullImages[randomIndex];

        const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle('🔥 Rastreador de Medo da Mesa')
            .setDescription(`O nível atual de Medo é: **${currentFear}**`)
            .setThumbnail(randomImage)
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    },
};