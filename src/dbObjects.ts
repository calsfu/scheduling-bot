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

// const CurrencyShop = require('./models/CurrencyShop.js')(sequelize, DataTypes);
// const UserItems = require('./models/UserItems.js')(sequelize, DataTypes);

// UserItems.belongsTo(CurrencyShop, { foreignKey: 'item_id', as: 'item' });

// Reflect.defineProperty(Users.prototype, 'addItem', {
// 	value: async (item : any) => {
// 		const userItem = await UserItems.findOne({
// 			where: { user_id: this.user_id, item_id: item.id },
// 		});

// 		if (userItem) {
// 			userItem.amount += 1;
// 			return userItem.save();
// 		}

// 		return UserItems.create({ user_id: this.user_id, item_id: item.id, amount: 1 });
// 	},
// });

// Reflect.defineProperty(Users.prototype, 'getItems', {
// 	value: () => {
// 		return UserItems.findAll({
// 			where: { user_id: this.user_id },
// 			include: ['item'],
// 		});
// 	},
// });

