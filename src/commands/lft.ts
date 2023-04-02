import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
const { InteractionOptionTypes } = require('discord-interactions');

function playerString(players:any) {
    let string = '';
    players.forEach((player:any) => {
        string += '<@' + player + '>';
    });
    return string;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lft')
		.setDescription('Puts out an LFT post.')
        .addStringOption(option => 
            option
                .setName('name')
                .setDescription('The name of the event.')
                .setRequired(true)
                // .addChoices(
                //     { name: 'match', value: 'match'},
                //     { name: 'scrim', value: 'scrim' },
                //     { name: 'tournament', value: 'tournament' },
                //     { name: 'practice', value: 'practice' },
                //     { name: 'other', value: 'other' },
                // ))
                .setAutocomplete(true)
        )
        .addIntegerOption(option =>
            option
                .setName('num')
                .setDescription('The number of people.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('rank')
                .setDescription('The rank/skill level needed.')
                .setRequired(false)
        )
        ,
	async execute(interaction:any) {
        
        const name = interaction.options.getString('name');
        const num = interaction.options.getInteger('num');
        const rank = interaction.options.getRole('rank');
        const filter = (i : any) => i.customId === 'primary' && i.user.id === '122157285790187530';
        const user = interaction.user;
        let players = [user.id];
        console.log(name, num, rank)
        const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('primary')
					.setLabel('👍')
					.setStyle(ButtonStyle.Primary),
        );
        let embed = new EmbedBuilder() 
            .setColor(0x0099FF)
            .setTitle(name)
            .setDescription('React to this message to join ' + name + ' with')
            .addFields( 
                {name: 'Number of people', value: '2', inline: true},
                {name: 'Rank/skill level', value: 'rank', inline: true},
                {name: "Players", value: playerString(players), inline: true},
            )    
            .setTimestamp();
        
        //tester
        //let reply = 'Successfuly added **' + name + '** to the schedule on **' + date + '** at **' + time + '**' + ' for <@&' + role + '>';
		const message = await interaction.reply({ embeds: [embed], fetchReply: true, components: [row]  });
        const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 15000 });
        // message.react('👍');
        // message.awaitReactionsRemove({max: 2, time: 60000, errors: ['time'] }, user)
        //     .then((collected : any) => {
        //         const reaction = collected.first();
        //         players.splice(players.indexOf(user.id), 1);
        //         embed = new EmbedBuilder() 
        //                 .setColor(0x0099FF)
        //                 .setTitle(name)
        //                 .setDescription('React to this message to join ' + name + ' with')
        //                 .addFields( 
        //                     {name: 'Number of people', value: '2', inline: true},
        //                     {name: 'Rank/skill level', value: 'rank', inline: true},
        //                     {name: "Players", value: playerString(players), inline: true},
        //                 )  
        //                 .setTimestamp();
        //         message.edit({ embeds: [embed]});
        //     })  
            // .catch((collected : any) => {
            //     message.reply('User not found.');
            // });
        collector.on('collect', (i : any) => {
            i.deferUpdate();
            if(players.includes(user.id)) {
                message.reply({ content: 'You have already joined this event', ephemeral: true });
                return;
            }
            
            if(i.customId === 'primary' && i.user.id === user.id) {
                players.push(user.id);
                embed = new EmbedBuilder() 
                        .setColor(0x0099FF)
                        .setTitle(name)
                        .setDescription('React to this message to join ' + name + ' with')
                        .addFields( 
                            {name: 'Number of people', value: '2', inline: true},
                            {name: 'Rank/skill level', value: 'rank', inline: true},
                            {name: "Players", value: playerString(players), inline: true},
                        )    
                        .setTimestamp();
                if(players.length >= num) {
                    message.edit({ embeds: [embed], components: [] });
                    return;
                }
                message.edit({ embeds: [embed]});
            }
        });
        
        collector.on('end', (collected : any) => {
            console.log(`Collected ${collected.size} interactions.`);
        });
    },
    //     message.awaitMessageComponent({ filter, time: 15000, user: user.id })
    //         .then((collected : any) => {
    //             console.log(collected);
    //             players.push(user.id);
    //             embed = new EmbedBuilder() 
    //                     .setColor(0x0099FF)
    //                     .setTitle(name)
    //                     .setDescription('React to this message to join ' + name + ' with')
    //                     .addFields( 
    //                         {name: 'Number of people', value: '2', inline: true},
    //                         {name: 'Rank/skill level', value: 'rank', inline: true},
    //                         {name: "Players", value: playerString(players), inline: true},
    //                     )    
    //                     .setTimestamp();
    //                 message.edit({ embeds: [embed]});
    //                 })

    //     message.awaitReactions({max: 2, time: 60000, errors: ['time'] }, user)
    //         .then((collected : any) => {
    //             const reaction = collected.first();

    //             if (reaction.emoji.name === '👍') {
    //                 players.push(user.id);
    //                 embed = new EmbedBuilder() 
    //                     .setColor(0x0099FF)
    //                     .setTitle(name)
    //                     .setDescription('React to this message to join ' + name + ' with')
    //                     .addFields( 
    //                         {name: 'Number of people', value: '2', inline: true},
    //                         {name: 'Rank/skill level', value: 'rank', inline: true},
    //                         {name: "Players", value: playerString(players), inline: true},
    //                     )    
    //                     .setTimestamp();
    //                 message.edit({ embeds: [embed]});
    //             }
    //         })
    //         .catch((collected : any) => {
    //             message.reply('You reacted with neither a thumbs up, nor a thumbs down.');
    //         });
	// }
    
    async autocomplete(interaction:any) {
		const focusedValue = interaction.options.getFocused(true);
        let choices = ['failed'];
        if(focusedValue.name == 'name') {
            choices = ['val', 'apex', 'csgo', 'lol', 'ow', 'rl', 'r6', 'tft', 'other'];
        }
		const filtered = choices.filter(choice => choice.startsWith(focusedValue.value));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
    },
}