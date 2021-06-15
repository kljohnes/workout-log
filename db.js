const Sequelize = require('sequelize');

const sequelize = new Sequelize("postgres://postgres:d4e725d0cb6e4b5ea16d3669e63b1e36@localhost:5432/workout-log");
                                    
module.exports = sequelize;