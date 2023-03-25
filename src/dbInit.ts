import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Calendar = require('./models/Calendar.ts')(sequelize, DataTypes);


const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
	console.log('Database synced');


    //await Promise.all(Calender);
	sequelize.close();
}).catch(console.error);
