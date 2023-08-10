const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Calendar = require('./models/Calendar.ts')(sequelize, Sequelize.DataTypes);
const Timezone = require('./models/Timezone.ts')(sequelize, Sequelize.DataTypes);

export { Calendar, Timezone };
