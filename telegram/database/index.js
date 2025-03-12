const { Sequelize } = require("sequelize")


// Create a new Sequelize instance
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: process.env.PGSSLMODE === 'require' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
  });

sequelize
    .authenticate()
    .then(async () => {
        console.log("Connection has been established successfully.")
        sequelize.sync({ force: true })
    })
    .catch(error => console.log("Unable to connect to the database", error))

module.exports = sequelize
