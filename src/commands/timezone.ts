//take an input from the user and set the timezone to a server
import { SlashCommandBuilder } from 'discord.js';
const { Timezone } = require('../../src/dbObjects.ts'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timezone')
        .setDescription('Set the timezone for the server')
        .addStringOption(option =>
            option.setName('timezone')
                .setDescription('The timezone to set')
                .addChoices(
                    { name: 'America/Los_Angeles', value: 'America/Los_Angeles'},
                    { name: 'America/Mountain', value: 'Americas/Mountain'},
                    { name: 'America/Central', value: 'Americas/Central'},
                    { name: 'America/New_York', value: 'America/New_York'},
                    { name: 'Asia/Tokyo', value: 'Asia/Tokyo'},
                    { name: 'Asia/Shanghai', value: 'Asia/Shanghai'},
                    { name: 'Asia/Hong_Kong', value: 'Asia/Hong_Kong'},
                    { name: 'Asia/Singapore', value: 'Asia/Singapore'},
                    { name: 'Asia/Taipei', value: 'Asia/Taipei'},
                    { name: 'Asia/Seoul', value: 'Asia/Seoul'},
                    { name: 'Australia/Sydney', value: 'Australia/Sydney'},
                    { name: 'Europe/London', value: 'Europe/London'},
                    { name: 'Europe/Paris', value: 'Europe/Paris'},
                    { name: 'Europe/Moscow', value: 'Europe/Moscow'},
                    { name: 'Europe/Berlin', value: 'Europe/Berlin'},
                    { name: 'Europe/Athens', value: 'Europe/Athens'},
                    { name: 'Europe/Istanbul', value: 'Europe/Istanbul'},
                    { name: 'Europe/Moscow', value: 'Europe/Moscow'},
                    { name: 'Europe/Amsterdam', value: 'Europe/Amsterdam'},
                )
                .setRequired(true))
                
            ,
    async execute(interaction : any) {
        const timezone = interaction.options.getString('timezone');
        const guild = interaction.guild.id;
        const event = await Timezone.create({ //adds to database
            timezone: timezone,
            guild: guild,
        });
        await interaction.reply({ content: `Timezone set to ${timezone}`, ephemeral: true});
    }
}
