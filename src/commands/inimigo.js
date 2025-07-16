// commands/inimigo.js
const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { readData, writeData } = require('../utils/database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inimigo')
        .setDescription('Gerencia os inimigos de um encontro.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('adicionar')
                .setDescription('Adiciona um novo inimigo ao combate.')
                .addStringOption(option => option.setName('nome').setDescription('O nome do inimigo (ex: Goblin, Chefe Orc).').setRequired(true))
                .addIntegerOption(option => option.setName('hp').setDescription('Os pontos de vida do inimigo.'))
                .addIntegerOption(option => option.setName('stress').setDescription('Os pontos de estresse do inimigo.'))
                .addIntegerOption(option => option.setName('difficulty').setDescription('A Dificuldade para acertar o inimigo.'))
                .addStringOption(option => option.setName('thresholds').setDescription('Os thresholds do inimigo (formato: ex, "8/14").')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remover')
                .setDescription('Remove um inimigo do combate.')
                .addStringOption(option => option.setName('id').setDescription('O inimigo a ser removido (use o autocompletar).').setRequired(true).setAutocomplete(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('editar')
                .setDescription('Edita os status de um inimigo existente.')
                .addStringOption(option => option.setName('id').setDescription('O inimigo a ser editado (use o autocompletar).').setRequired(true).setAutocomplete(true))
                .addIntegerOption(option => option.setName('hp').setDescription('O novo HP do inimigo.'))
                .addIntegerOption(option => option.setName('stress').setDescription('O novo stress do inimigo.')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('listar')
                .setDescription('Lista todos os inimigos ativos no combate.')),
    
    async autocomplete(interaction) {
        const db = readData();
        const guildId = interaction.guildId;
        const focusedValue = interaction.options.getFocused();
        
        const enemyObjects = db[guildId]?.enemies ? Object.values(db[guildId].enemies) : [];
        const filtered = enemyObjects.filter(enemy => enemy.name.toLowerCase().startsWith(focusedValue.toLowerCase()));

        await interaction.respond(
            filtered.slice(0, 25).map(enemy => ({ 
                name: `${enemy.name} (HP: ${enemy.hp}, ID: ${enemy.id})`,
                value: enemy.id
            })),
        );
    },

    async execute(interaction) {
        const db = readData();
        const guildId = interaction.guildId;
        const subcommand = interaction.options.getSubcommand();

        if (!db[guildId] || !db[guildId].enemies) {
            db[guildId] = { ...db[guildId], enemies: {} };
        }
        
        if (subcommand === 'adicionar') {
            const enemyName = interaction.options.getString('nome');
            const hp = interaction.options.getInteger('hp') ?? 5;
            const stress = interaction.options.getInteger('stress') ?? 3;
            const difficulty = interaction.options.getInteger('difficulty') ?? 12;
            const thresholds = interaction.options.getString('thresholds') ?? '8/14';
            
            const enemyId = Math.random().toString(36).substring(2, 8);

            db[guildId].enemies[enemyId] = { id: enemyId, name: enemyName, hp, stress, difficulty, thresholds, effects: [] };
            writeData(db);
            
            // note to self: lembrar sempre de usar o messageFlags pra ephemeral!!!

            return interaction.reply({ content: `Inimigo **${enemyName}** Id: \`${enemyId}\` (HP: ${hp}, Stress: ${stress}, Dificuldade: ${difficulty}, Thresholds: ${thresholds}) foi adicionado ao combate!`, flags: MessageFlags.Ephemeral });
        }
        
        if (subcommand === 'listar') {
            const enemyList = Object.values(db[guildId].enemies);
            if (enemyList.length === 0) {
                return interaction.reply({ content: 'Não há inimigos no combate no momento.'});
            }

            const embed = new EmbedBuilder()
                .setColor('Random')
                .setTitle('Inimigos no Combate');

            for (const e of enemyList) {
                embed.addFields({
                    name: `${e.name} (ID: \`${e.id}\`)`,
                    value: `❤️ HP: **${e.hp}** | 🔥 Stress: **${e.stress}**\n🎯 Dificuldade: **${e.difficulty}** |  Thresholds: **${e.thresholds}**`,
                    inline: false
                });
            }
            return interaction.reply({ embeds: [embed]}); 
        }

        const enemyId = interaction.options.getString('id');
        const enemy = db[guildId].enemies[enemyId];

        if (!enemy) {
            return interaction.reply({ content: `Não foi encontrado um inimigo com o ID fornecido. Use o autocompletar.`, flags: MessageFlags.Ephemeral });
        }

        if (subcommand === 'remover') {
            delete db[guildId].enemies[enemyId];
            writeData(db);
            return interaction.reply({ content: `Inimigo **${enemy.name}** (ID: \`${enemy.id}\`) foi removido.`, flags: MessageFlags.Ephemeral });
        }

        if (subcommand === 'editar') {
            const newHp = interaction.options.getInteger('hp');
            const newStress = interaction.options.getInteger('stress');

            if (newHp === null && newStress === null) {
                return interaction.reply({ content: 'Você precisa fornecer um novo valor para HP ou Stress para editar.', flags: MessageFlags.Ephemeral });
            }

            if (newHp !== null) enemy.hp = newHp;
            if (newStress !== null) enemy.stress = newStress;
            
            writeData(db);
            return interaction.reply({ content: `Status do inimigo **${enemy.name}** atualizados.`, flags: MessageFlags.Ephemeral });
        }
    },
};