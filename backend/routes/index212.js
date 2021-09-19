const express = require("express");
const router = express.Router();
const pupperteer = require("../util/pupperteer");
const request = require("request");
const Product = require("../models").Product;
const database = require("../util/database");
const logger = require("../util/winston-logger");
const { generate_token_and_getdata } = require("../middleware/product");

const { updateSmartNet, look_up_sn_array } = require("../util/mongoDB");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.send("403");
});

router.get("/authToken", pupperteer.readSession, async (req, res) => {
  console.log('auth token')
  res.send(req.auth);
});


// check the SN, the readSession function is to read the Authorization code that has been stored
// when login to cisco site 
router.get(
  "/check-sn/:sn",
  pupperteer.readSession,

  async (req, res, next) => {
    
    const query = await req.params.sn;
    const auth = await req.auth;
    let limit = req.query.limit ? req.query.limit : "200";
    const url ="https://ccrc.cisco.com/ServiceContract/ccrcsearch/oneview/lines";

    var bodyJsonObj = {
      "expandAllMinorToMajor": false,
    "fields": [],
    "filters": {
    "aggregationsOnly": false,
    "includeUncoveredLines": false,
    "lastFilter": null,
    "showAggregations": true,
    "values": {},
    "viewAllContractItems": false
    },
    "page": 1,
    "pageSize": 25,
    "search": {"key": "serialNumber", "value": `${query}`},
    "sort": {"key": "CONTRACT_NUMBER", "value": "ASC"}
  };

  const header = {
    'authorization':auth,
    'Request-Id': 123456
  }
    const options = {
      method: "POST",
      url: url,
      json: true,
      headers:header,
      body: bodyJsonObj
      
    };

    await request(options, async (error, response, body) => {
      //console.log('response hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee:'+JSON.stringify(response))
      if (error) {
        return res.status(500).end('Got request Cisco error');
      }
      if (response.statusCode === 401) {
        
         return res.status(500).end('Error 401. Can not generate new token. Check crontask login');
        //  
        // return res.status(401).end(req.auth);
      }
      //console.log('body: '+JSON.parse(body))
      //let bodyParser = JSON.parse(body);
      let jsonBody = await body;

      for(const data in jsonBody) {
        try {
          Product.create(data);
        } catch (error) {
          console.log("product already created");
        }
      }

      await res.send(jsonBody);

      try {
        await look_up_sn_array(jsonBody);
      } catch (e) {
        logger.error(e);
      }

      await database.exportAsFile(bodyParser);
    });
  }
);




router.get(
  "/auth",
  pupperteer.autoLogin,
  // pupperteer.readCookie,
  (req, res, next) => {
    res.status(201).send({
      success: "The authorization code has been generated"
    });
  }
);

module.exports = router;
