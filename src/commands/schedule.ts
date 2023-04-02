import { SlashCommandBuilder } from 'discord.js';
const { Calendar  } = require('../../src/dbObjects.ts');
//get the schedule from the database
//print the schedule

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dow = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('schedule')
        .setDescription('Prints the current schedule. ')
        .addRoleOption(option =>
            option
                .setName('role')
                .setDescription('The role to filter by.')
                .setRequired(true)
        )
    ,
    async execute(interaction:any ) {
        //let schedule = await interaction.client.db.getSchedule();
        //let timezone = interaction.client.db.getTimezone();
        
        let role = interaction.options.getRole('role');
        let schedule = await Calendar.findAll({ where: { role: role.id}});
        let message = "**Current Schedule for " + '<@&' + role + '>**' +":\n";
        //for each event in the schedule
        //print the event
        let a = new Date();
        // console.log(a.getHours())
        // console.log(schedule[0].date)
        // console.log(schedule[0].date.getTimezoneOffset())
        // console.log(schedule[0].date.getHours());
        // console.log(schedule[0].dataValues.date.getHours())
        // console.log(schedule[0].dataValues.date.getTimezoneOffset())
        // console.log(schedule[0].dataValues.date.getTimezoneOffset())
        //schedule.date.setUTCHours(0);
        //console.log(schedule[3].dataValues.date.getDay())
        for (let event of schedule) {
            message = message + dow[event.date.getDay()] + ', ' + months[event.date.getMonth()] + " " + event.date.getDate() + ' at '  + event.date.getUTCHours() + ":" +  event.name + '\n';
        }
        // console.log(schedule);
        await interaction.reply(message);
    },
}