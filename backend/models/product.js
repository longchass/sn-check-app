'use strict';

const { Sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id:{
      type:DataTypes.INTEGER,
      primaryKey:true
    },
    name: DataTypes.STRING,
    description:DataTypes.STRING,

    // cisco

  }, {});
  Product.associate = function(models) {
    // associations can be defined here
    Product.hasMany(models.SerialNumber)
  };
  return Product;
};