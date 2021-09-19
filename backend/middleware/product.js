const Product = require('../models').Product;
const pupperteer = require('../util/pupperteer');
const request = require("request");


const checkProductName = (req, res, next) => {
  let responseResult = []
  Product.findAll({
    where: {
      SERIAL_NUMBER: '123'
    }
  })
}



const generate_token_and_getdata = async (req, res, next) => {

  const query = await req.params.sn
  const auth = await req.auth
  let limit = await req.query.limit ? req.query.limit : '10'

  pupperteer.autologinPromise()
    .then(() => {
      pupperteer.readCookiePromise()
        .then((data) => {
          fetch_api(query, data, limit)
            .then(async (response) => {
              let bodyParser = JSON.parse(response)
              let jsonBody = await bodyParser.contractsData
              await res.send(jsonBody);
            })
        })
    })
    .catch((err) => console.log(err))



}


const fetch_api = (sn, token, limit) => {
  return new Promise(async (resolve, reject) => {
    const query = sn
    const auth = token
    const url = 'https://ccrc.cisco.com/ServiceContract/ccrcesservices/contracts/lines'
    const options = {
      method: 'GET',
      url: url,
      qs:
      {
        initialLoad: 'false',
        lastFilter: '',
        limit: limit,
        offset: '1',
        order: 'ASC',
        query: `%serialNumber=${query}%`,
        searchKey: 'serialNumber',
        showAggregations: 'true',
        sort: 'SERIAL_NUMBER'
      },
      headers:
      {
        'cache-control': 'no-cache',
        Subscriber: 'ui',
        'Request-Id': '1564105885828',
        Authorization: auth
      },
      form: { undefined: undefined }
    };

    await request(options, async (error, response, body) => {

      if (error)
        reject(error)
      else if (body.status === 401)
        reject("Error")
      else
        resolve(body)
    });
  })
}

module.exports = {
  checkProductName,
  generate_token_and_getdata,
  fetch_api

}