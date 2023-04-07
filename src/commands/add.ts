import { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, EmbedBuilder,  TextInputStyle, StringSelectMenuBuilder } from 'discord.js';
import { Calendar } from '../dbObjects';
import { Timezone } from '../dbObjects';
import { SlashCommandBuilder } from 'discord.js';
import { error } from 'console';
import moment from 'moment-timezone';
//import '../../moment-timezone-with-data';
moment().tz("America/Los_Angeles").format();
const fs = require('fs');
//import { dateTime } from '../index';
//const Calender = require('../index.ts');
/*
TODO
- Timezones
- Autocomplete for time
- Saving data
- Displaying data through embed
- Editing data
- Deleting data
- Linking to data to channel/server


Optional TODO
- Linking to calender
- Linking to google sheets

*/

let monthNumbers: {[key: string]: string} = {
    "jan": "01",
    "feb": "02",
    "mar": "03",
    "apr": "04",
    "may": "05",
    "jun": "06",
    "jul": "07",
    "aug": "08",
    "sep": "09",
    "oct": "10",
    "nov": "11",
    "dec": "12",

}
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dow = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];



module.exports = {
	data: new SlashCommandBuilder()
		.setName('add')
		.setDescription('Adds an event to the schedule.')
        .addRoleOption(option => 
            option
                .setName('role')
                .setDescription('The role that can see this event.')
                .setRequired(true)
        )   
        ,
            
	async execute(interaction:any) {
        const guildTimezone = await Timezone.findAll({
            where: {
                guild : interaction.guild.id
            }
        });
        if(guildTimezone.length == 0){ //returns if timezone is not set
            await interaction.reply("Please set the timezone for this server using /timezone.");
            return;
        }
        const timezone = guildTimezone[0].timezone; //0 not needed since guildid is unique
        console.log(
            "Timezone: " + timezone
        );
        const modal = new ModalBuilder() 
            .setCustomId('add')
            .setTitle('Add Event');

        const nameInput: TextInputBuilder = new TextInputBuilder() 
            .setCustomId('nameInput')
            .setPlaceholder('scrim, match, tournament, ...')
            .setLabel('Name')
            .setMaxLength(25)
            .setRequired(true)
            .setStyle(TextInputStyle.Short);

        const dateInput: TextInputBuilder = new TextInputBuilder()
            .setCustomId('dateInput')
            .setPlaceholder('mm/dd, March 30th, ...')
            .setLabel('Date')
            .setMaxLength(20)
            .setRequired(true)
            .setStyle(TextInputStyle.Short);;

        const timeInput : TextInputBuilder= new TextInputBuilder()
            .setCustomId('timeInput')
            .setPlaceholder('1230 AM, 12:30pm, ...')
            .setLabel('Time')
            .setMaxLength(20)
            .setRequired(true)
            .setStyle(TextInputStyle.Short);;

        const descriptionInput: TextInputBuilder = new TextInputBuilder()
            .setCustomId('descriptionInput')
            .setPlaceholder('Playing against ...')
            .setLabel('Description')
            .setMaxLength(50)
            .setRequired(false)
            .setStyle(TextInputStyle.Paragraph);;

        const select = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('select')
					.setPlaceholder('Role')
					.addOptions(
						{
							label: 'Select me',
							description: 'This is a description',
							value: 'first_option',
						},
						{
							label: 'You can select me too',
							description: 'This is also a description',
							value: 'second_option',
						},
					),
			);        
        
        const firstActionRow: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder();
        const secondActionRow: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder()
        const thirdActionRow : ActionRowBuilder<TextInputBuilder>= new ActionRowBuilder()
        const fourthActionRow: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder()
        firstActionRow.addComponents(nameInput);
        secondActionRow.addComponents(dateInput);
        thirdActionRow.addComponents(timeInput);
        fourthActionRow.addComponents(descriptionInput);
        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow);
            
        await interaction.showModal(modal);

        const submitted = await interaction.awaitModalSubmit({
            // Timeout after a minute of not receiving any valid Modals
            time: 60000,
            // Make sure we only accept Modals from the User who sent the original Interaction we're responding to
            filter: (i : any) => i.user.id === interaction.user.id,
          }).catch((error : any) => {
            // Catch any Errors that are thrown (e.g. if the awaitModalSubmit times out after 60000 ms)
            console.error(error)
            return null
          })
        // const collector = interaction.channel.createMessageComponentCollector({ time: 15000 });

        // collector.on('collect', async (i : any) => {
        //     await i.update({ content: 'A button was clicked!', components: [] });
        // });

        // collector.on('end', (collected : any) => console.log(`Collected ${collected.size} items`));
        //const showModal = await interaction.reply({ content: 'Add Event', components: [modal], fetchReply: true, type:modal });
        console.log("Passed submitted");
        if(submitted) {
            try {
                const name = submitted.fields.getTextInputValue('nameInput');
                const date = submitted.fields.getTextInputValue('dateInput');
                const time = submitted.fields.getTextInputValue('timeInput');
                const description = submitted.fields.getTextInputValue('descriptionInput');
                const role = interaction.options.getRole('role');
                
                
            
                //date will be in in the form mm/dd or month day. Need to convert to 2023-mm-dd format
                //time will be in the form 1230 AM or 12:30pm. Need to convert to 24 hour format
                let timeString = time.replace(/[\s:]/g, ""); //gets rid of spaces and colons
                let timeArray = timeString.split(/(\d+)/); //splits into time and am/pm
                let filteredTimeArray = timeArray.filter(Boolean); //removes empty strings
                //let firstLetter = filteredTimeArray[1].charAt(0);//gets first letter of am/pm
                let firstLetter;
                if (filteredTimeArray[1] && filteredTimeArray[1] !== '') {
                    firstLetter = filteredTimeArray[1].charAt(0);
                } else {
                    firstLetter = 'p';
                }
                console.log("time " + filteredTimeArray[0]);
                let hour = filteredTimeArray[0].substring(0, filteredTimeArray[0].length - 2);
                let minute = filteredTimeArray[0].substring(filteredTimeArray[0].length - 2);
                console.log("before check:", hour);
                if (hour === "" ) {
                  console.log("hour is NaN");
                  hour = minute;
                  minute = "00";
                }
                console.log("after check:", hour);
                //minute = parseInt(minute);
                if (firstLetter.toLowerCase() === 'p' && hour !== "12") {
                    hour = (parseInt(hour) + 12).toString();
                }
                else {
                    if(hour === "12") {
                        hour = "00";
                    }
                }
                let dateString = date.replace(/ /g, '');//either in March30 or 03/30 format
                let splitDigits = dateString.split(/(\d+)/); //either in [March, 30] or [03, /, 30] format
                let filteredDateArray = splitDigits.filter((item:string) => !item.includes("/")); //removes / from [03, /, 30] format
                filteredDateArray = filteredDateArray.filter((str: string) => str !== "");
                //let dateArray = dateString.split('/');//either in [March30] or [03, 30] format
                let month = filteredDateArray[0];
                let monthNumber : string | undefined;
                console.log("month " + month);
                console.log("filtered date array: " + filteredDateArray);
                if(isNaN(month)) {
                    month = month.substring(0, 3);
                    monthNumber = monthNumbers[month.toLowerCase()];
                    if (monthNumber === undefined) {
                        // Handle invalid month name here
                        console.log("Invalid month name:");
                        
                        throw(error);
                    }
                }
                else {
                    monthNumber = month.toString().padStart(2, '0');
                }
                console.log(monthNumber)
                let day = filteredDateArray[1];
                //monthNumber = monthNumber.toString().padStart(2, '0');
                hour = hour.padStart(2, '0');
                day = day.padStart(2, '0'); 
                minute = minute.padStart(2, '0');
                console.log("month " + monthNumber);
                console.log("day " + day);
                console.log("hour " + hour);
                console.log("minute " + minute);

                //let finalDate = new Date(2023, monthNumber, day, hour, minute);
                let ISOdate = "2023-" + monthNumber + "-" + day + "T" + hour + ":" + minute + ":00";
                const momentDate = moment.tz(ISOdate, timezone);
                console.log(momentDate);
                console.log(momentDate.format());
                let finalDate = new Date(momentDate.format());
                if(isNaN(finalDate.getTime())) {
                    console.log("Invalid Date");
                    throw(error);
                }
                console.log(finalDate);
                
                let currentDate = new Date();
                console.log(currentDate); 

                if(finalDate < currentDate) {
                    console.log("Date is in the past");
                    return submitted.reply({ content: 'Invalid Date: Date is in the past', ephemeral: true });
                }

                const event = await Calendar.create({ //adds to database
                    name: name,
                    description: description,
                    date: finalDate,
                    role: role.id,
                    guild: interaction.guildId,
                    channel: interaction.channelId,
                    dayReminder: false,
                    hourReminder: false,
                });

                if(event) { 
                    console.log("added to calender");
                }

                let returnTime = function(time:Date) {
                    let hours = time.getUTCHours();
                    let minutes = time.getMinutes();
                    let ampm = hours >= 12 ? 'pm' : 'am';
                    hours = hours % 12;
                    hours = hours ? hours : 12; // the hour '0' should be '12'
                // let minminutes = minutes < 10 ? '0' + minutes : minutes;
                    minute = minute.padStart(2, '0');
                    let strTime = hours + ':' + minute + ' ' + ampm;
                    return strTime;
                }

                // let embed = new EmbedBuilder() 
                //     .setColor(0x0099FF)
                //     .setTitle("New Event Created")
                //     .setDescription('React to this message to join ' + name + ' with')
                //     .addFields( 
                //         {name: 'Event Type', value:name, inline:true},
                //         {name: 'day', value: date, inline: true},
                //         {name: 'time', value: returnTime(finalDate), inline: true},
                //     )    
                //     .setTimestamp();

                let reply = 'Successfuly added **' + name + '** to the schedule on **' + date + '** at **' + returnTime(finalDate) + " " + timezone + '**' + ' for <@&' + role.id +  '>';
                await submitted.reply(reply); //replies to text
            } catch (error) {
                console.log(error);
                return submitted.reply({ content: 'Invalid Date. If this an error, please dm calsfu#9126', ephemeral: true });
            }
        }
        
        
	},
    async autocomplete(interaction:any) {
		const focusedValue = interaction.options.getFocused(true);
        let choices = ['failed'];
        if(focusedValue.name == 'name') {
            choices = ['match', 'scrim', 'practice', 'tournament', 'other'];
        }
        if(focusedValue.name == 'time') {
            choices = ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM'];

        }
		const filtered = choices.filter(choice => choice.startsWith(focusedValue.value));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
    },
}