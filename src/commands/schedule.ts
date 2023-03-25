import { SlashCommandBuilder } from 'discord.js';
const { Calendar  } = require('../../src/dbObjects.ts');
//get the schedule from the database
//print the schedule



module.exports = {
    data: new SlashCommandBuilder()
        .setName('schedule')
        .setDescription('Prints the current schedule. ')
        .addRoleOption(option =>
            option
                .setName('role')
                .setDescription('The role to filter by.')
                .setRequired(false)
        )
    ,
    async execute(interaction:any ) {
        //let schedule = await interaction.client.db.getSchedule();
        let role = interaction.options.getRole('role');
        let schedule = await Calendar.findAll({ where: { role: role.id}});
        console.log(schedule);
        await interaction.reply('Pong!');
    },
}