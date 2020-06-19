const request = require("request-promise");
const cheerio = require("cheerio");

async function scrapFertilisez(req, res) {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
  const result = await request.get(
    "https://africafertilizer.org/internationalprices/"
  );
  const $ = cheerio.load(result);
  const scrapedData = [];
  const tableHeaders = [];
  $("#tab-id-1-container > div > div.scrollit > table > tbody > tr ").each(
    (index, element) => {
      if (index === 0) {
        const ths = $(element).find("th");
        $(ths).each((i, element) => {
          tableHeaders.push($(element).text().toLowerCase());
        });
        return true;
      }
      const tds = $(element).find("td");
      const tableRow = {};
      $(tds).each((i, element) => {
        tableRow[tableHeaders[i]] = $(element).text();
      });
      scrapedData.push(tableRow);
    }
  );
  //   console.log(scrapedData);
  res.json(scrapedData);
}

async function scrapAgricultural(req, res) {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
  const result = await request.get(
    "https://markets.businessinsider.com/commodities"
  );
  const $ = cheerio.load(result);
  const scrapedData = [];
  const tableHeaders = [];
  $(
    "body > main > div > div > div > div.row.equalheights > div > div:nth-child(37) > div.table-responsive > table > tbody > tr "
  ).each((index, element) => {
    if (index === 0) {
      const ths = $(element).find("th");
      $(ths).each((i, element) => {
        tableHeaders.push($(element).text().toLowerCase());
      });
      return true;
    }
    const tds = $(element).find("td");
    const tableRow = {};
    $(tds).each((i, element) => {
      tableRow[tableHeaders[i]] = $(element).text();
    });
    scrapedData.push(tableRow);
  });
  console.log(scrapedData);
  res.json(scrapedData);
}
module.exports = { scrapFertilisez, scrapAgricultural };
// main().catch((e) => console.log("e", e));
