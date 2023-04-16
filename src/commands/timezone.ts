//take an input from the user and set the timezone to a server
import { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ComponentType, ActionRowBuilder, escapeStrikethrough } from 'discord.js';
import { Timezone, Calendar } from '../dbObjects';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timezone')
        .setDescription('Set the timezone for the server')
        .addStringOption(option =>
            option.setName('timezone')
                .setDescription('The timezone to set')
                .addChoices(
                    { name: 'America/Los_Angeles', value: 'America/Los_Angeles'},
                    { name: 'America/Phoenix', value: 'America/Phoenix'},
                    { name: 'America/Denver', value: 'America/Denver'},
                    { name: 'America/Chicago', value: 'America/Chicago'},
                    { name: 'America/New_York', value: 'America/New_York'},
                    { name: 'America/Puerto_Rico', value: 'America/Puerto_Rico'},
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
                    { name: 'Europe/Stockholm', value: 'Europe/Stockholm'},
                )
                .setRequired(true))
                
            ,
    async execute(interaction : any) {
        const timezone = interaction.options.getString('timezone');
        const guild = interaction.guild.id;
        const guildTimezone = await Timezone.findAll({
            where: {
                guild : interaction.guild.id
            }
        });

        if(guildTimezone.length != 0){ //updates timezone if already set
            if(timezone == guildTimezone[0].timezone){
                await interaction.reply({ content: `Timezone already set to **${timezone}**`, ephemeral: true});
                return;
            }
            const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('primary')
					.setLabel('👍')
					.setStyle(ButtonStyle.Primary),
            );
            const message = await interaction.reply({  ephemeral: true, components: [row], content: `Timezone already set to **${guildTimezone[0].timezone}**. Do you want to change it to **${timezone}**? Warning: Changing timezone will delete all entries in the calendar.`});
            //const filter = (m:any) => m.author.id === interaction.user.id;
            //const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 15000 });
            const filter = (i : any) => {
                i.deferUpdate();
                return i.user.id === interaction.user.id;
            };
            message.awaitMessageComponent({ filter, componentType: ComponentType.Button, time: 60000 })
                .then((interaction : any) => 
                {
                    //interaction.editReply({ content: `Timezone set to ${timezone}`, ephemeral: true});
                    //edit the message to remove the button and have text saying "Timezone set to ${timezone}"

                    //interaction.reply({ content: `Timezone set to ${timezone}`, ephemeral: true});
                    message.edit({ content: `Timezone set to **${timezone}**`, ephemeral: true, components: []});
                    Calendar.destroy({
                        where: {
                            guild: guild
                        }
                    });
                    guildTimezone[0].update({
                        timezone: timezone
                    });
                })
                
                .catch((err : any) => console.log("Unchanged timezone"));
            // collector.on('collect', (i:any) => {
                
            //     //i.deferUpdate();
            //     if (i.customId === 'primary' && i.user.id === interaction.user.id) {
            //         i.reply({ content: `Timezone set to ${timezone}` , ephemeral: true})
            //         Calendar.destroy({
            //             where: {
            //                 guild: guild
            //             }
            //         });
            //         guildTimezone[0].update({
            //             timezone: timezone
            //         });
            //         //message.send({ content: `Timezone set to `, ephemeral: true});
                    
            //     }
            // });
            // collector.on('end', (collected : any) => {
            //     console.log(`Collected ${collected.size} interactions.`);
            // });
            
           return;
        }
        else {
            await Timezone.create({ //adds to database
                timezone: timezone,
                guild: guild,
            });
        }
        await interaction.reply({ content: `Timezone set to **${timezone}**`, ephemeral: true});
    }
}
