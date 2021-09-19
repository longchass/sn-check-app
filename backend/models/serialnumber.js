'use strict';
module.exports = (sequelize, DataTypes) => {
  const SerialNumber = sequelize.define('SerialNumber', {
    serialNumber: {
      type:DataTypes.STRING,
      primaryKey:true
    },
    dataId:DataTypes.STRING,
    status:DataTypes.STRING,
    quantity:DataTypes.INTEGER,
    poNumber:DataTypes.STRING,
    soNumber:DataTypes.STRING,
    itemTypeFlag:DataTypes.STRING,
    dnrFlag:DataTypes.BOOLEAN,
    instanceNumber:DataTypes.STRING,
    lastDateOfSupport:DataTypes.STRING,
    hostId:DataTypes.STRING,
    parentInstanceId: DataTypes.STRING,
    contractAccess:DataTypes.BOOLEAN,
    serviceLevel:DataTypes.STRING,
    disabledLineReasons:DataTypes.STRING,
    disabledLineFlagMsgs:DataTypes.STRING
  }, {});
  SerialNumber.associate = function(models) {
    // associations can be defined here
    SerialNumber.belongsTo(models.EndCustomer)
    SerialNumber.belongsTo(models.Product)
  };
  return SerialNumber;
};