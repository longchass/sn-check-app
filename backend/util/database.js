const Product = require('../models').Product;
const fs = require('fs');


const exportAsFile = async (dump) => {
   
    let date = new Date()
    let fileName = date.getTime()
    await fs.writeFile(`fileData/${fileName}.txt`, JSON.stringify(dump), 'utf8')
    return products
}

module.exports.exportAsFile = exportAsFile
