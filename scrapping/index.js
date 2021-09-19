const axios = require("axios");
const cheerio = require("cheerio");
const app = require("express")();
const fs = require("fs");
var request = require("request");
const mysql = require("mysql");

const con = mysql.createConnection({
  host: "192.168.5.8",
  user: "dvucom_joel",
  password: "Hoilamcho1010",
  database: "dvucom_ipsupply"
});

// app.get("/", async (req, res) => {

const getData = async url => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const routers = $(".col-xs-12");

    let returnData = [];

    let lastTitle = "";

    for (let i = 0; i < routers.length; i++) {
      //   const model = $(href[i]).text();
      const model = $(routers[i])
        .text()
        .replace("EOS", "");

      const ciscoModelSeries = model.trim();

      const urlLink = $(routers[i])
        .find("a")
        .attr("href");

      //   const nameTitle = $(name[i])
      //     .text()
      //     .trim();

      //   const checkedClass = $(href[i]).hasClass("topLink");

      const isUnnesscery = $(routers[i])
        .find("a")
        .hasClass("topLink");

      const isTitle = $(routers[i])
        .find("h4")
        .hasClass("pciscoswitch-line");

      if (isTitle) {
        lastTitle = ciscoModelSeries;
        // returnData.push({ title: ciscoModelSeries });
      }

      if (model && !isUnnesscery && !isTitle) {
        //          get the children model
        const responseModel = await axios.get(urlLink);
        const $2 = cheerio.load(responseModel.data);
        const modelNameLink = $2("td a");

        let childrenModels = [];
        for (let y = 0; y < modelNameLink.length; y++) {
          const modelName = $2(modelNameLink[y])
            .text()
            .trim();

          const hrefLink = $2(modelNameLink[y]).attr("href");

          const packageResponse = await axios.get(hrefLink);

          const $3 = cheerio.load(packageResponse.data);

          const packages = $3("td a");

        

          const shortDescription = $3("tr td:nth-child(3)");

          let childrens = [];

          for (let k = 0; k < packages.length; k++) {
            const childrenName = $3(packages[k])
              .text()
              .trim();

            const childrenDescription = $3(shortDescription[k])
              .text()
              .trim();

              const packagesLink = $3(packages[k]).attr("href")


   
              // more detail about the model
              const itemDetailResponse = await axios.get(packagesLink)

              const $4 = cheerio.load(itemDetailResponse.data)



              // check if there specification


              const spec = $4('.details-spe').html()

              // if(hasSpec) {
              //   spec = $4('.details-spe').html();
              // }


              // get the product overview

              $4('table tr').slice(2,11).remove()
              const overview = $4('table').html()
              // console.log($4('.table-responsive').html())
            SerialNameDescription = {
              ID: childrenName,
              ShortDescription: childrenDescription,
              Specifications: spec || '',
              Overview: overview
            };

            console.log(SerialNameDescription)

            childrens.push(SerialNameDescription);
          }

          let seriesName = {
            SerialName: modelName,
            SerialChildren: childrens
          };

          childrenModels.push(seriesName);

        }

        returnData.push({
          Title: lastTitle,
          Model: ciscoModelSeries,
          Children: childrenModels
        });
      }
    }
    return returnData;
  } catch (e) {
    console.log(e);
  }
};


const sendTitleData = async fileName => {
  let uniqueTitle = [];
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, "utf8", async (err, res) => {
      if (err) {
        reject(err)
      };
      const data = JSON.parse(res);

      await data.map(async item => {
        const title = item.Title;
        if (!uniqueTitle.includes(title)) {
          uniqueTitle.push(title);
          await update_data(title, 0);
        }
        // post data to the database to the database
        // this is the ROOT
      });

      await resolve("Done");
    });
  });
};

const sendData = async fileName => {
  fs.readFile(fileName, "utf8", async (err, res) => {
    if (err) throw console.log(err);
    const data = JSON.parse(res);

    data.map(async item => {
      const title = item.Title;

      const titleId = await getIdFromCategories(title);

      const models = item.Model;

      await update_data(models, titleId).then(async modelId => {
        console.log("model id " + modelId);
        const children = item.Children;
        children.map(async serial => {
          const serialChildren = serial.SerialChildren;

          update_data(serial.SerialName, modelId).then(async serialId => {
            serialChildren.map(async packagePairName => {

              // ID: childrenName,
              // ShortDescription: childrenDescription,
              // Specifications: spec,
              // Overview: overview

              addProduct(
                packagePairName.ID,
                serialId,
                packagePairName.ShortDescription,
                packagePairName.Specifications,
                packagePairName.Overview
              );


              // update_data(packageName, serialId).then(id =>  console.log("package id " + id));
            });
          });
        });
      });
    });
  });
};

const addProduct = (name, parent_id, ShortDescription, Specifications, Overview) => {
  console.log("add product");

  var today = new Date();
  var date =
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1) +
    "-" +
    today.getDate() +
    "  " +
    today.getHours() +
    ":" +
    today.getMinutes() +
    ":" +
    today.getSeconds();

  const updateColumn =
    "(products_more, products_title, products_code, categories_id, manufacturers_id, users_id, website_id, users_fullname, products_alias, products_description, products_longdescription, bao_hanh, is_published, is_delete, is_new, is_hot, is_available, is_goingon, is_sellonline, tra_gop, date_create, hide_price, wholesale, price, price_sale, ordering, quantity, number_views, rating, number_like, total_sale, convert_search, is_viewed, position_view, youtube_video, price_total , convert_sitemap, convert_images, tags, type_view, publisher_id)";
  const valuesUpdate = 
  `( ${Overview}  ,'${ShortDescription}','${name}',  ${parent_id},     1,             1,          1,        'VietnamEcom','${name +"-" +parent_id}','${ShortDescription}', '${Specifications}',          '${name}',    0,          0,          0,      0,        0,            0,          1,            0,      '${date}',    0,          0,       0.0,     0.0,        0,        0,          0,        0,        0,            0,          0,           0,          0,              '',           0,            0,                0,         '',       0,        '')`;
  const query = `INSERT INTO products ${updateColumn} VALUES ${valuesUpdate}`;
  con.query(query, function(err, result, fields) {
    if (err) throw err;

    console.log("update many-to-many");
    const updateTable = "(products_id, categories_id)";
    const updateTableValues = `(${result.insertId}, ${parent_id})`;

    const query2 = `INSERT INTO products_category ${updateTable} VALUES ${updateTableValues}`;

    // insert many-to-many
    con.query(query2, function(err, result, fields) {
      if (err) throw err;
    });

    // insert tranlate table
    updateProductTranlate(result.insertId, name);
  });
};

const updateProductTranlate = (products_id, name) => {
  const updateTable = "(products_id, products_title, products_alias, language)";
  const updateTableValues = `(${products_id}, '${name}', '${name}', 1)`;

  const query2 = `INSERT INTO products_translate ${updateTable} VALUES ${updateTableValues}`;

  con.query(query2, (err, result, fields) => {
    if (err) {
      throw err;
    }
  });
};

const update_data = (name, parent) => {
  return new Promise((resolve, reject) => {
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate() +
      "  " +
      today.getHours() +
      ":" +
      today.getMinutes() +
      ":" +
      today.getSeconds();
    const updateColumn =
      "(website_id, parent_id, categories_title, categories_alias, is_published, is_delete, ordering, addfeature, template_id, date_create)";
    const valuesUpdate = `(1, ${parent}, '${name}','${name
      .replace(/-|\s/g, "")
      .trim()}', 0, 0, 0, 0, 0, '${date}')`;
    const query = `INSERT INTO categories ${updateColumn} VALUES ${valuesUpdate}`;

    con.query(query, function(err, result, fields) {
      if (err) {
        reject(err);
      }

      console.log("SHOULDDDD", result);

      const updateColumn2 =
        "(categories_id, categories_title, categories_alias, language)";
      const valuesUpdate2 = `(${result.insertId}, '${name}', '${name
        .replace(/-|\s/g, "")
        .trim()}', 1)`;
      const queryUpdate = `INSERT INTO categories_translate ${updateColumn2} VALUES ${valuesUpdate2}`;

      // console.log(queryUpdate)
      con.query(queryUpdate, (err, result, fields) => {
        {
          if (err) throw err;
        }
      });

      resolve(result.insertId);
    });
  });
};

const getIdFromCategories = (name, callback) => {
  return new Promise((resolve, reject) => {
    // con.connect(err => {
    // if (err) throw err;

    con.query(
      `SELECT * FROM categories WHERE categories_title = '${name}'`,
      function(err, result, fields) {
        if (err) {
          reject(err);
        }

        resolve(result[0].categories_id);
      }
    );
    // });
  });
};



// ------------ RUN THE PROGRAM ---------------

const urls = [
  // { filename: "switch.txt", url: "https://itprice.com/cisco-switch-1" },
  { filename: "router.txt", url: "https://itprice.com/cisco-routers-2" },
  // { filename: "security.txt", url: "https://itprice.com/cisco-security-3" },
  // { filename: "wireless.txt", url: "https://itprice.com/cisco-wireless-4" },
  // {
  //   filename: "optical.txt",
  //   url: "https://itprice.com/cisco-optical-networking-5"
  // }
];

urls.map(url => {
  getData(url.url).then(res => {

    fs.writeFile(`${url.filename}`, JSON.stringify(res), function(err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
      // the data should change here
    });
  });
});

// try {
//   const fileName = "oldModel.txt";
//   con.beginTransaction(async () => {
//     sendTitleData(fileName)
//       .then((data) => {
//         console.log(data)
//         // sendData(fileName);
      
//       })
//       .catch(err => console.log(err));

//     //     // sendData();

//     await console.log("done");

//     con.commit(() => {
//       console.log("done, commit");
//     });
//   });
// } catch (e) {
//   con.rollback(() => {
//     console.log("error rollback now");
//   });
// }
