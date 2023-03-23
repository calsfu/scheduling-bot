import { Events } from 'discord.js';

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction:any) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
		}
	},
};

rest.delete(Routes.applicationGuildCommand(clientId, guildId, '1088322176622542888'))
	.then(() => console.log('Successfully deleted guild command'))
	.catch(console.error);

// for global commands
rest.delete(Routes.applicationCommand(clientId, '1088322176622542888'))
	.then(() => console.log('Successfully deleted application command'))
	.catch(console.error);
