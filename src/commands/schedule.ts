import { SlashCommandBuilder } from 'discord.js';

let dateTime = new Date();
dateTime.getDay();
module.exports = {
	data: new SlashCommandBuilder()
		.setName('schedule')
		.setDescription('Adds an event to the schedule.')
        .addStringOption(option => 
            option
                .setName('name')
                .setDescription('The name of the event.')
                .setRequired(true)
                .addChoices(
                    { name: 'match', value: 'match'},
                    { name: 'scrim', value: 'scrim' },
                    { name: 'tournament', value: 'tournament' },
                    { name: 'practice', value: 'practice' },
                    { name: 'other', value: 'other' },
                ))
        .addStringOption(option =>
            option
                .setName('date')
                .setDescription('The date of the event.')
                .setAutocomplete(true)
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('time')
                .setDescription('The time of the event.')
                .setAutocomplete(true)
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('duration')
                .setDescription('The duration of the event.')
                .addChoices(
                    { name: '15 minutes', value: '15 minutes' }, 
                    { name: '30 minutes', value: '30 minutes' },
                    { name: '45 minutes', value: '45 minutes' },
                    { name: '1 hour', value: '1 hour' },
                    { name: '1 hour 15 minutes', value: '1 hour 15 minutes' },
                    { name: '1 hour 30 minutes', value: '1 hour 30 minutes' },
                    { name: '1 hour 45 minutes', value: '1 hour 45 minutes' },
                    { name: '2 hours', value: '2 hours' },
                    { name: '2 hours 15 minutes', value: '2 hours 15 minutes' },
                    { name: '2 hours 30 minutes', value: '2 hours 30 minutes' },
                    { name: '2 hours 45 minutes', value: '2 hours 45 minutes' },
                    { name: '3 hours', value: '3 hours' },
                    { name: '3 hours 15 minutes', value: '3 hours 15 minutes' },
                    { name: '3 hours 30 minutes', value: '3 hours 30 minutes' },
                    { name: '3 hours 45 minutes', value: '3 hours 45 minutes' },
                    { name: '4 hours', value: '4 hours' },
                    { name: '4 hours 15 minutes', value: '4 hours 15 minutes' },
                    { name: '4 hours 30 minutes', value: '4 hours 30 minutes' },
                    { name: '4 hours 45 minutes', value: '4 hours 45 minutes' },
                    { name: '5 hours', value: '5 hours' },
                    { name: '5 hours 15 minutes', value: '5 hours 15 minutes' },
                    { name: '5 hours 30 minutes', value: '5 hours 30 minutes' },
                    { name: '5 hours 45 minutes', value: '5 hours 45 minutes' },
                    { name: '6 hours', value: '6 hours' },
                )
                .setRequired(false)),
	async execute(interaction:any) {
        const name = interaction.options.getString('name');
        const date = interaction.options.getString('date');
        const time = interaction.options.getString('time');
        const duration = interaction.options.getString('duration');

        //tester
        console.log(name);
        console.log(date);
        console.log(time);
        console.log(duration);
        console.log(dateTime.getDay());

		await interaction.reply('Successfuly added ${event} to the schedule on ${date} at ${time}!');
	},
};