import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import { Calendar } from '../dbObjects';
module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Removes an event from the database.')
        .addRoleOption(option =>
            option
                .setName('role')
                .setDescription('The role to ping.')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName('id')
                .setDescription('The id of the event.')
                .setRequired(true)
        )
        ,
    async execute(interaction:any) {
        const id = interaction.options.getInteger('id');
        const role = interaction.options.getRole('role');
        const event = await Calendar.findOne({ 
            where: {
                id: id,
                role: role.id
            } 
        });
        if(event) {
            await event.destroy();
            await interaction.reply('Event removed.');
        }
        else {
            await interaction.reply('Event not found.');
        }
    }
}