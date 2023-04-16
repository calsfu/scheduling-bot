import { SlashCommandBuilder } from 'discord.js';
import { Calendar, Timezone } from '../dbObjects';
import moment from 'moment-timezone';

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
        
        //Date is currently stored in UTC. I need to convert it to the timezone of the server.
        let timezone = await Timezone.findAll({ //get timezone of server. 
            where: {
                guild : interaction.guild.id
            }
        });
        if(timezone.length == 0){ //if timezone is not set, set it to UTC
            timezone = 'UTC';
        }
        else {
            timezone = timezone[0].timezone;
        }
        //Now that I have the timezone, I need to convert the date to that timezone.
        //need to sort Calendar object so its in order from least to greatest.
        schedule.sort((a:any, b:any) => {
            return a.date - b.date;
        });

        //for each event in the schedule
        //print the event
        // console.log(a.getHours())
        // console.log(schedule[0].date)
        // console.log(schedule[0].date.getTimezoneOffset())
        // console.log(schedule[0].date.getHours());
        // console.log(schedule[0].dataValues.date.getHours())
        // console.log(schedule[0].dataValues.date.getTimezoneOffset())
        // console.log(schedule[0].dataValues.date.getTimezoneOffset())
        //schedule.date.setUTCHours(0);
        //console.log(schedule[3].dataValues.date.getDay())
        let counter = 1;
        for (let event of schedule) {
            let date = moment(event.date).tz(timezone);
            let month = parseInt(date.format('MM')) - 1;
            let day = date.format('DD');
            let time = date.format('h:mm a');
            event.update({number : counter});
            
            console.log(date.format('YYYY-MM-DD HH:mm:ss z'));
            message = message + counter + ". " + dow[event.date.getDay()] + ', ' + months[month] + " " + day + ' at '  + time + ": " +  event.name + '\n';
            counter++;
        }
        // console.log(schedule);
        await interaction.reply(message);
    },
}