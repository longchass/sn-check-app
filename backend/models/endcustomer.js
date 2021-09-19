'use strict';
module.exports = (sequelize, DataTypes) => {
  const EndCustomer = sequelize.define('EndCustomer', {
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true
    },
    customerName:DataTypes.STRING,
    orgId:DataTypes.INTEGER,
    orgName:DataTypes.STRING,
    globalUltimateId:DataTypes.INTEGER,
    globalUltimateName:DataTypes.STRING,
    address:DataTypes.STRING,
    state:DataTypes.STRING,
    city:DataTypes.STRING,
    postalCode:DataTypes.STRING,
    country:DataTypes.STRING
  }, {});
  EndCustomer.associate = function(models) {
    // associations can be defined here
    EndCustomer.hasMany(models.SerialNumber)
  };
  
  return EndCustomer;
};