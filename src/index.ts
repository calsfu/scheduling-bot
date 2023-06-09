import { config } from 'dotenv';
import { Calendar } from './dbObjects';
import { Sequelize, DataTypes, Op } from 'sequelize';
import fs from 'node:fs';
import path from 'node:path';
import { Collection, Events, GatewayIntentBits } from 'discord.js';
const { Client } = require('discord.js');


// import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';


config();

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions] });



const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file:any) => file.endsWith('.ts'));

client.commands = new Collection();

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}






client.once(Events.ClientReady, (c:any) => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, (interaction:any) => { //button
	if (!interaction.isButton()) return;
	console.log(interaction.id);
});

client.on(Events.InteractionCreate, async (interaction:any)=> { //autocomplete
	if (!interaction.isAutocomplete()) return;
		const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.autocomplete(interaction);
			} catch (error) {
				console.error(error);
			}
		
});


client.on(Events.InteractionCreate, async (interaction:any) => { //nonautocomplete
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);
	console.log('command name: ' + interaction.commandName);
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.on(Events.InteractionCreate, (interaction : any) => {
	if (!interaction.isModalSubmit()) return;
	//console.log(interaction);
});

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);

setInterval(async () => {
	const now = new Date();
	const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
	const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
	
	const oneDay = await Calendar.findAll({
	  where: {
		date: {
		  [Op.lt]: twentyFourHoursFromNow, //equivalent to SQL: date < twentyFourHoursFromNow
		  [Op.gt]: now,
		},
		dayReminder: false,
	  },
	});

	const oneHour = await Calendar.findAll({
		where: {
			date: {
				[Op.lt]: oneHourFromNow, 
				[Op.gt]: now,
			},
			hourReminder: false,	
		}
	});
	const passedTime = await Calendar.findAll({
		where: {
			date: {
				[Op.lt]: now,
			},
		}
	});
	
	passedTime.forEach((event : any) => { //delete events that have passed
		console.log("Event destroyed");
		const channel = client.channels.cache.get(event.channel);
		channel.send(`${event.name} is starting now! <@&${event.role}>`)
		event.destroy();
	});

	if (!oneDay.length && !oneHour.length && !passedTime.length) { 
		console.log("No events found.");
		return;
	}
	
	oneHour.forEach((event : any) => {
		let minutesUntilEvent = event.date.getTime() - now.getTime();
		minutesUntilEvent = Math.floor(minutesUntilEvent / 1000 / 60);
		const channel = client.channels.cache.get(event.channel);
		channel.send(`**Reminder:** ${event.name} is starting soon at ${event.localTime}! <@&${event.role}>`);
		// Mark the event as having had a reminder sent
		event.update({ hourReminder: true });
		event.update({ dayReminder: true });
	});

	oneDay.forEach((event : any) => {
		let timeUntilEvent = event.date.getTime() - now.getTime();
		timeUntilEvent = Math.floor(timeUntilEvent / 1000 / 60);
	  const channel = client.channels.cache.get(event.channel);
	  channel.send(`**Reminder:** ${event.name} is starting tomorrow at ${event.localTime}! <@&${event.role}>`);
  
	  // Mark the event as having had a reminder sent
	  event.update({ dayReminder: true });
	});

	
  },   60 * 1000); // Check every 1 minute
