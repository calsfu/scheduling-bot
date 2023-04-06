module.exports = (sequelize : any, DataTypes : any) => { 
    return sequelize.define('timezone', {
        timezone: {
            type: DataTypes.STRING,
            unique: false,
        },
        guild: {
            type: DataTypes.STRING,
            unique: true,
        }
    });
};