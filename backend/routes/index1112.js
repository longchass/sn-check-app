const express = require("express");
const router = express.Router();
const pupperteer = require("../util/pupperteer");
const request = require("request");
const Product = require("../models").Product;
const SerialNumber = require('../models').SerialNumber;
const EndCustomer = require('../models').EndCustomer;
const database = require("../util/database");
const logger = require("../util/winston-logger");
const { generate_token_and_getdata } = require("../middleware/product");

const { updateSmartNet, look_up_sn_array } = require("../util/mongoDB");

function isEmpty(obj) {
  for(var key in obj) {
    if(obj.hasOwnProperty(key))
      return false;
  }
  return true;
}

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
    const querySN = await SerialNumber.findOne({
      where:{
        serialNumber:query,
      },
      include:['Product','EndCustomer']
    })
    if(isEmpty(querySN)){
      await request(options, async (error, response, body) => {
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
        console.log("json Body hereeee"+JSON.stringify(jsonBody.data[0]))
        
        
        
        // try {
        //   await look_up_sn_array(jsonBody);
        // } catch (e) {
        //   logger.error(e);
        // }
  
        //await database.exportAsFile(bodyParser);
      
      let serialNumber = {
        serialNumber: jsonBody.data[0].serialNumber,
        dataId:jsonBody.data[0].id,
        status:jsonBody.data[0].status,
        quantity:jsonBody.data[0].quantity,
        poNumber:jsonBody.data[0].poNumber,
        soNumber:jsonBody.data[0].soNumber,
        itemTypeFlag:jsonBody.data[0].itemTypeFlag,
        dnrFlag:jsonBody.data[0].dnrFlag,
        instanceNumber:jsonBody.data[0].instanceNumber,
        lastDateOfSupport:jsonBody.data[0].lastDateOfSupport,
        hostId:jsonBody.data[0].hostId,
        parentInstanceId:jsonBody.data[0].parentInstanceId,
        contractAccess:jsonBody.data[0].contractAccess, 
        ProductId:jsonBody.data[0].product.id,
        EndCustomerId:jsonBody.data[0].endCustomer.id
      }
      if(jsonBody.data[0].serviceLevel){
        serialNumber = {...serialNumber, serviceLevel: jsonBody.data[0].serviceLevel.name +' '+jsonBody.data[0].serviceLevel.description}
      }
      const queryProduct = await Product.findOne({
        where:{
          id:serialNumber.ProductId+""
        }
      })
      if(isEmpty(queryProduct)){
        try{
            await Product.create({
              id:jsonBody.data[0].product.id,
              name:jsonBody.data[0].product.name,
              description:jsonBody.data[0].product.description,
            })
          } 
          catch (error){
            console.log('Error when creating new product: '+error)
          }
      }
      const queryEndCustomer = await EndCustomer.findOne({
        where:{
          id:serialNumber.EndCustomerId+""
        }
      })
      if(isEmpty(queryEndCustomer)){
        try{
          await EndCustomer.create({
            id:jsonBody.data[0].endCustomer.id,
            customerName:jsonBody.data[0].endCustomer.name,
            orgId:jsonBody.data[0].endCustomer.orgId,
            orgName:jsonBody.data[0].endCustomer.orgName,
            globalUltimateId:jsonBody.data[0].endCustomer.globalUltimateId,
            globalUltimateName:jsonBody.data[0].endCustomer.globalUltimateName,
            address:jsonBody.data[0].endCustomer.address.address1,
            state:jsonBody.data[0].endCustomer.address.state,
            city:jsonBody.data[0].endCustomer.address.city,
            postalCode:jsonBody.data[0].endCustomer.address.postalCode,
            country:jsonBody.data[0].endCustomer.address.country
          })
        } 
        catch (error){
          console.log('Error when creating new End customer: '+error)
        }
      }
      try{
      await SerialNumber.create(serialNumber)
      .then(async(newSN)=>{
        let sn = newSN.serialNumber
        resultSN = await SerialNumber.findOne({
          where:{
            serialNumber:sn
          },
          include:['Product','EndCustomer']
        })
      })
      res.send(resultSN)
      .catch(err=>console.log('cai gi z maaaaaaaaaaaaaaaa',err))
      } catch(err){
      console.log('Error when creating new Serial Number: '+error)
      }
    });
    } else{ // If found QuerySN
      res.send(querySN)
    }
    
  }
);

router.get("/query/:sn",async function(req,res,next){
  const query = await req.params.sn;

  const sn = await SerialNumber.findOne({
    where:{
      serialNumber:"23456123"
    },
    include:['Product','EndCustomer']
  })
  
  res.send(isEmpty(sn))
})

router.get("/reload/:sn", pupperteer.readSession, async function (req, res, next){
  const query = await req.params.sn
  const auth = await req.auth;
  
  const options = {
    method: "GET",
    url: `https://yt1jbzwf4l.execute-api.us-east-1.amazonaws.com/dev/?sn=${query}&auth=${auth}`,
    json: true,
  };
  await request(options, async (error, response, body) =>{
    if (error) {
      return res.status(500).end('Got request Cisco error from reload');
    }
    if (response.statusCode === 401) {
       return res.status(500).end('Error 401. Can not generate new token. Check crontask login');
    }
    let jsonBody = await body;
    const serialNumber = {
      serialNumber: jsonBody[0].SERIAL_NUMBER,
      dataId:jsonBody[0].INSTANCE_ID,
      status:jsonBody[0].STS_CODE,
      quantity:jsonBody[0].QUANTITY,
      poNumber:jsonBody[0].PO_NUMBER,
      soNumber:jsonBody[0].SO_NUMBER,
      itemTypeFlag:jsonBody[0].ITEM_TYPE_FLAG,
      dnrFlag:jsonBody[0].IS_LINE_DISABLED,
      instanceNumber:jsonBody[0].INSTANCE_NUMBER,
      lastDateOfSupport:jsonBody[0].END_DATE,
      hostId:jsonBody[0].HOST_ID,
      parentInstanceId:jsonBody[0].INSTANCE_ID,
      contractAccess:jsonBody[0].CONTRACT_ACCESS,
      serviceLevel: jsonBody[0].SERVICE_LINE_NAME + ' '+jsonBody[0].DESCRIPTION,
      ProductId:jsonBody[0].INVENTORY_ITEM_ID,
      EndCustomerId:jsonBody[0].CONTRACT_SITE_USE_ID
    }
    const product = {
      id:jsonBody[0].INVENTORY_ITEM_ID,
      name: jsonBody[0].ITEM_NAME,
      description:jsonBody[0].ITEM_DESCRIPTION
    }

    const endCustomer = {
      id:jsonBody[0].CONTRACT_SITE_USE_ID,
      customerName:jsonBody[0].CONTRACT_SITE_CUSTOMER_NAME,
      orgId:0,
      orgName:jsonBody[0].CONT_SITE_ORG_NAME,
      globalUltimateId:jsonBody[0].INSTALL_GU_ID,
      globalUltimateName:jsonBody[0].INSTALL_GU_NAME,
      address:jsonBody[0].CONT_SITE_ADDRESS1,
      state:jsonBody[0].CONTRACT_SITE_STATE_PROV,
      city:jsonBody[0].CONTRACT_SITE_CITY,
      postalCode:jsonBody[0].CONTRACT_SITE_POSTAL_CODE,
      country:jsonBody[0].CONTRACT_SITE_COUNTRY
    }
    
    //res.send(JSON.stringify(jsonBody[0], undefined, 4))
    res.send(serialNumber)
  })

  
  //res.send(serialNumber)
})

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
router.get(
  "/check-sn-2/:sn",
  pupperteer.readSession,

  async (req, res, next) => {
    
    const query = await req.params.sn;
    const auth = await req.auth;
    let limit = req.query.limit ? req.query.limit : "200";
    const url ="https://ccrc.cisco.com/ServiceContract/ccrcsearch/oneview/lines";

    
  const options = {
    method: "GET",
    url: `https://yt1jbzwf4l.execute-api.us-east-1.amazonaws.com/dev/?sn=${query}&auth=${auth}`,
    json: true,
  };
    const querySN = await SerialNumber.findOne({
      where:{
        serialNumber:query,
      },
      include:['Product','EndCustomer']
    })
    if(isEmpty(querySN)){
      await request(options, async (error, response, body) => {
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
        //console.log("json Body hereeee"+JSON.stringify(jsonBody.data[0]))
        
        
        
        // try {
        //   await look_up_sn_array(jsonBody);
        // } catch (e) {
        //   logger.error(e);
        // }
        if(jsonBody[0] === undefined) {
          return res.status(500).end('SN not found in Cisco');
        }
        
        //await database.exportAsFaile(bodyParser);
      
      let serialNumber = {
        serialNumber: jsonBody[0].SERIAL_NUMBER,
      dataId:jsonBody[0].INSTANCE_ID,
      status:jsonBody[0].STS_CODE,
      quantity:jsonBody[0].QUANTITY,
      poNumber:jsonBody[0].PO_NUMBER,
      soNumber:jsonBody[0].SO_NUMBER,
      itemTypeFlag:jsonBody[0].ITEM_TYPE_FLAG,
      dnrFlag:jsonBody[0].IS_LINE_DISABLED,
      instanceNumber:jsonBody[0].INSTANCE_NUMBER,
      lastDateOfSupport:jsonBody[0].END_DATE,
      hostId:jsonBody[0].HOST_ID[0],
      parentInstanceId:jsonBody[0].INSTANCE_ID,
      contractAccess:jsonBody[0].CONTRACT_ACCESS,
      serviceLevel: jsonBody[0].SERVICE_LINE_NAME + ' '+jsonBody[0].DESCRIPTION,
      ProductId:jsonBody[0].INVENTORY_ITEM_ID,
      EndCustomerId:jsonBody[0].CONTRACT_SITE_USE_ID
      }
      // if(jsonBody.data[0].serviceLevel){
      //   serialNumber = {...serialNumber, serviceLevel: jsonBody.data[0].serviceLevel.name +' '+jsonBody.data[0].serviceLevel.description}
      // }
      const queryProduct = await Product.findOne({
        where:{
          id:serialNumber.ProductId+""
        }
      })
      if(isEmpty(queryProduct)){
        try{
            await Product.create({
              id:jsonBody[0].INVENTORY_ITEM_ID,
              name: jsonBody[0].ITEM_NAME,
              description:jsonBody[0].ITEM_DESCRIPTION
            })
          } 
          catch (error){
            console.log('Error when creating new product: '+error)
          }
      }
      const queryEndCustomer = await EndCustomer.findOne({
        where:{
          id:serialNumber.EndCustomerId+""
        }
      })
      if(isEmpty(queryEndCustomer)){
        try{
          await EndCustomer.create({
            id:jsonBody[0].CONTRACT_SITE_USE_ID,
            customerName:jsonBody[0].CONTRACT_SITE_CUSTOMER_NAME,
            orgId:0,
            orgName:jsonBody[0].CONT_SITE_ORG_NAME,
            globalUltimateId:jsonBody[0].INSTALL_GU_ID,
            globalUltimateName:jsonBody[0].INSTALL_GU_NAME,
            address:jsonBody[0].CONT_SITE_ADDRESS1,
            state:jsonBody[0].CONTRACT_SITE_STATE_PROV,
            city:jsonBody[0].CONTRACT_SITE_CITY,
            postalCode:jsonBody[0].CONTRACT_SITE_POSTAL_CODE,
            country:jsonBody[0].CONTRACT_SITE_COUNTRY
          })
        } 
        catch (error){
          console.log('Error when creating new End customer: '+error)
        }
      }
      try{
      await SerialNumber.create(serialNumber)
      .then(async(newSN)=>{
        let sn = newSN.serialNumber
        resultSN = await SerialNumber.findOne({
          where:{
            serialNumber:sn
          },
          include:['Product','EndCustomer']
        })
      })
      res.send(resultSN)
      .catch(err=>console.log('cai gi z maaaaaaaaaaaaaaaa',err))
      } catch(err){
      console.log('Error when creating new Serial Number: '+err)
      //res.send(serialNumber)
      }
    });
    } else{ // If found QuerySN
      res.send(querySN)
    }
    
  }
);
module.exports = router;
