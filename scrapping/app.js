const app = require("express")();
const request = require("request");
const cheerio = require("cheerio");
app.get("/", (req, res) => {
  const id = req.query.id || ""
  var options = {
    method: "POST",
    url: "https://www.mlcp.com/search_result.php",
    headers: {
      "cache-control": "no-cache",
      "content-type":
        "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"
    },
    formData: { searchvalue: id }
  };

  request(options, async (error, response, body) => {
    if (error) throw new Error(error);

    const $ = cheerio.load(body);

    const id = $("tr td:nth-child(1)");

    const idLink = $("tr td:nth-child(1) a");

    const description = $("tr td:nth-child(2)");

    let returnData = [];
    const fullUrl = req.protocol + "://" + req.get("host");

    for (let index = 0; index < id.length; index++) {
      returnData.push({
        id: $(id[index]).text(),
        description: $(description[index]).text(),

        link: `${fullUrl}/detail?url=https://www.mlcp.com${$(
          idLink[index]
        ).attr("href")}`
      });
    }

    await res.send(returnData);
  });
});

app.get("/detail", async (req, res) => {
  var options = {
    method: "GET",
    url: req.query.url,
    headers: {
      "cache-control": "no-cache",
      "content-type":
        "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"
    }
  };

  request(options, function(error, response, body) {
    if (error) throw new Error(error);

    const $ = cheerio.load(body);
    const detail = $(".techspecstable").html();
    console.log(detail);
    res.send(`<table>${detail}</table>`);
  });
});

app.get("/listprice", async (req, res) => {
  const q = req.query.q || ''
  var options = {
    method: "GET",
    url: "https://itprice.com/index-search",
    qs: { q: q, brand: "cisco", is_real_search: "1" },
    headers: {
      "cache-control": "no-cache",
      "content-type":
        "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"
    }
  };

  request(options, function(error, response, body) {
    if (error) throw new Error(error);
    const $ = cheerio.load(body);

    const id = $(".search-eos");
    const description = $("tr td:nth-child(3)");
    const listprice = $("tr td:nth-child(4)");

    let returnData = [];

    for (let index = 0; index < id.length; index++) {
      returnData.push({
        id: $(id[index]).text().trim(),
        description: $(description[index]).text().trim(),
        listprice: $(listprice[index]).text().replace("$", '').replace(",","").trim()
      });
    }

    return res.send(returnData);
  });
});

app.listen(3002);
