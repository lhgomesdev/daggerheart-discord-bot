// commands/ficha.js

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { readData, writeData } = require('../database.js');

const statusFields = ['hp', 'shield', 'stress', 'hope'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ficha')
        .setDescription('Gerencia a ficha do seu personagem ou de outros.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('ver')
                .setDescription('Mostra a ficha de um personagem.')
                .addUserOption(option => option.setName('usuario').setDescription('O usuário cuja ficha você quer ver.')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('definir')
                .setDescription('Define os status da sua ficha (ou de outro jogador, se for o Mestre).')
                .addUserOption(option => option.setName('usuario').setDescription('O jogador cuja ficha você quer modificar (Apenas para Mestres).'))
                .addIntegerOption(option => option.setName('hp').setDescription('Pontos de Vida.'))
                .addIntegerOption(option => option.setName('shield').setDescription('Pontos de Escudo (Shield).'))
                .addIntegerOption(option => option.setName('stress').setDescription('Pontos de Estresse (Stress).'))
                .addIntegerOption(option => option.setName('hope').setDescription('Pontos de Esperança (Hope).'))),

    async execute(interaction) {
        const db = readData();
        const guildId = interaction.guildId;
        const subcommand = interaction.options.getSubcommand();

        if (!db[guildId]) {
            db[guildId] = { serverData: { fear: 0 }, users: {} };
        }

        if (subcommand === 'definir') {
            const targetUser = interaction.options.getUser('usuario');
            const userToUpdate = targetUser || interaction.user;
            const userId = userToUpdate.id;

            if (targetUser && targetUser.id !== interaction.user.id) {
                // verificamos se quem usou o comando tem o cargo "Mestre".
                if (!interaction.member.roles.cache.some(role => role.name === 'Mestre')) {
                    return interaction.reply({ content: 'Você não tem permissão para modificar a ficha de outros jogadores.', ephemeral: true });
                }
            }
            
            if (!db[guildId].users[userId]) {
                db[guildId].users[userId] = { hp: 0, shield: 0, stress: 0, hope: 0 };
            }

            let responseMessage = `Ficha de **${userToUpdate.username}** atualizada:\n`;
            let changes = 0;

            statusFields.forEach(field => {
                const value = interaction.options.getInteger(field);
                if (value !== null) {
                    db[guildId].users[userId][field] = value;
                    responseMessage += `**${field.charAt(0).toUpperCase() + field.slice(1)}**: ${value}\n`;
                    changes++;
                }
            });

            if (changes === 0) {
                return interaction.reply({ content: 'Você precisa fornecer pelo menos um status para definir.', ephemeral: true });
            }

            writeData(db);
            await interaction.reply({ content: responseMessage, ephemeral: true });

        } else if (subcommand === 'ver') {
            const targetUser = interaction.options.getUser('usuario') || interaction.user;
            const userId = targetUser.id;
            const userData = db[guildId].users[userId];

            if (!userData) {
                return interaction.reply({ content: `O usuário **${targetUser.username}** ainda não tem uma ficha salva.`, ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setColor('Random')
                .setTitle(`Ficha de ${targetUser.username}`)
                .addFields(
                    { name: '❤️ HP', value: `${userData.hp || 0}`, inline: true },
                    { name: '🛡️ Shield', value: `${userData.shield || 0}`, inline: true },
                    { name: '🔥 Stress', value: `${userData.stress || 0}`, inline: true },
                    { name: '✨ Hope', value: `${userData.hope || 0}`, inline: true },
                )
                .setThumbnail(targetUser.displayAvatarURL());
            
            await interaction.reply({ embeds: [embed] });
        }
    },
};