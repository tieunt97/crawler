const fs = require("fs");
const puppeteer = require("puppeteer");

function extractItems() {
  const extractedElements = document.querySelectorAll(".hotel-link.clearfix");
  const ids = [];
  var pos = 0;
  try {
    for (let element of extractedElements) {
      const id = element
        .querySelector(".hotel-info .hotel-name a")
        .getAttribute("data-ubttrace-hotel");
      ids.push(id);
    }
  } catch (ex) {
    console.log(ex);
  }
  return items;
}

async function scrapeInfiniteScrollItems(
  page,
  extractItems,
  itemTargetCount = 200,
  scrollDelay = 1000
) {
  let items = [];
  try {
    let previousHeight;
    while (items.length < itemTargetCount) {
      await page.waitFor(2000);
      items = await page.evaluate(extractItems);
      previousHeight = await page.evaluate("document.body.scrollHeight");
      await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
      await page.waitForFunction(
        `document.body.scrollHeight > ${previousHeight}`
      );
      await page.waitFor(scrollDelay);
      try {
        await page.waitForSelector(".c-btn.btn-flat.btn-more", {
          timeout: 500
        }); //this thing might be flaky. Not sure it is a good idea!!!
        await page.click(".c-btn.btn-flat.btn-more");
      } catch (e) {}
    }
  } catch (e) {
    console.log("error: ", e);
  }
  return items;
}

const getData = async (file, url) => {
  // Set up browser and page.
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 926 });

  // Navigate to the demo page.
  await page.goto(url);

  // Scroll and extract items from the page.
  const items = await scrapeInfiniteScrollItems(page, extractItems);

  // Save extracted items to a file.
  fs.writeFileSync(file, JSON.stringify(items));

  // Close the browser.
  await browser.close();
};

getData(
  "danang_hotel_id.js",
  "https://vn.trip.com/hotels/list?city=1356&checkin=2019-03-27&checkout=2019-03-28&hotelname=&searchboxarg=t&optionid=1356&optiontype=Intlcity&display=%C4%90%C3%A0%20N%E1%BA%B5ng%20(Da%20Nang)%2C%20Vi%E1%BB%87t%20Nam&markland=&adult=1&children=0&ages=&label=YE1SJGSgjUOcLQ0_fh0iJA&pageno=1&hotelid=&allianceid=&sid=&starlist=2&filterHotels="
);
