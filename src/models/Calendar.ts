module.exports = (sequelize : any, DataTypes : any) => { 
    return sequelize.define('calendar', {
        name: {
            type: DataTypes.STRING,
            unique: false,
        },
        description: DataTypes.TEXT,
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        role: DataTypes.STRING,
        guild: DataTypes.STRING,
        channel: DataTypes.STRING,
        localTime: DataTypes.STRING,
        number: DataTypes.INTEGER,
        dayReminder: DataTypes.BOOLEAN,
        hourReminder: DataTypes.BOOLEAN,
    });
};

// module.exports = (sequelize : any, DataTypes : any) => {
// 	return sequelize.define('users', {
// 		user_id: {
// 			type: DataTypes.STRING,
// 			primaryKey: true,
// 		},
// 		balance: {
// 			type: DataTypes.INTEGER,
// 			defaultValue: 0,
// 			allowNull: false,
// 		},
// 	}, {
// 		timestamps: false,
// 	});
// };