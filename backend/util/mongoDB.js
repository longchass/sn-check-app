const MongoClient = require('mongodb').MongoClient;
const logger = require('./winston-logger')


const updateSmartNet = (sn, SmartNet) => {
  const url = process.env.MONGODB;

  if (sn) {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      const dbo = db.db("inventory");

      // put serial number here to search
      const SerialNumber = sn;

      const FindBySerialNumber = { SerialNumber }

      const changeToClean = { SmartNet }
      const updateSmartNet = { $set: changeToClean }
      dbo.collection("inventory").updateOne(FindBySerialNumber, updateSmartNet, function (err, result) {
        if (err) {
          // for logging
       
          logger.error(err)
        }

        if(result) {
          console.log("Updated")
        }
        db.close();
      });
      db.close();
    });
  }
}


// the parameter should be an array
const look_up_sn_array = async (arrayObject) => {
  let tempSn = []
  if (typeof arrayObject === "object") {
    if (arrayObject.length > 0) {
      arrayObject.forEach((data) => {
        const { SERIAL_NUMBER } = data
        if(!tempSn.includes(SERIAL_NUMBER)) {

          tempSn.push(SERIAL_NUMBER)

          try {
            const { SERVICE_LINE_NAME } = data
            if (SERVICE_LINE_NAME.length > 0) {
              console.log("Serial number below should be clean")
              console.log(SERIAL_NUMBER)
              updateSmartNet(SERIAL_NUMBER, "Clean")
            } else {
              console.log("Serial number below should not be clean in if statement")
              console.log(SERIAL_NUMBER)
            }
          } catch (e) {
            console.log("Serial number below should not be clean")
            console.log(SERIAL_NUMBER)
            updateSmartNet(SERIAL_NUMBER, "NC")
            console.log(e)
          }



        }
       
      });
    }
  }
}

module.exports.updateSmartNet = updateSmartNet
module.exports.look_up_sn_array = look_up_sn_array
