const fs = require("fs");
const puppeteer = require("puppeteer");

function extractItems() {
  const extractedElements = document.querySelectorAll(".hotel-link.clearfix");
  const items = [];
  var pos = 0;
  try {
    for (let element of extractedElements) {
      const image = element.querySelector(".hotel-img img").getAttribute("src");
      const aTitle = element.querySelector(".hotel-info .hotel-name a");
      const level = element
        .querySelector(".level i")
        .getAttribute("class")
        .trim()
        .split(/\s/)[2]
        .split("-")[2];
      const score = element
        .querySelector(".hotel-info .score")
        .innerText.trim();
      const price = element
        .querySelector(".hotel-info .price-num")
        .innerText.trim();
      const priceCurrency = element
        .querySelector(".hotel-info .price-currency")
        .innerText.trim();
      if (/pic/.test(image)) continue;
      items.push({
        pos: ++pos,
        name: aTitle.innerText.trim(),
        level: parseInt(level),
        image: `https:${image}`,
        detail: `https:${aTitle.getAttribute("href")}`,
        score: parseFloat(score),
        price: parseInt(price),
        priceCurrency
      });
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

// getData(
//   "nha_trang_5_star.json",
//   "https://vn.trip.com/hotels/list?city=1777&checkin=2019-03-24&checkout=2019-03-25&pageno=1&hotelid=&allianceid=&sid=&adult=1&children=0&ages=&starlist=5&filterhotels=&sort=sr1&filterHotels="
// );

const datas = [
  {
    name: "da_nang",
    baseUrl:
      "https://vn.trip.com/hotels/list?city=1356&checkin=2019-03-24&checkout=2019-03-25&hotelname=&searchboxarg=t&optionid=1356&optiontype=Intlcity&display=%C4%90%C3%A0%20N%E1%BA%B5ng%20(Da%20Nang)%2C%20Vi%E1%BB%87t%20Nam&markland=&adult=1&children=0&ages=&label=YE1SJGSgjUOcLQ0_fh0iJA&pageno=1&hotelid=&allianceid=&sid=&sort=sr1&starlist=5&filterHotels="
  },
  {
    name: "ha_noi",
    baseUrl:
      "https://vn.trip.com/hotels/list?city=286&checkin=2019-03-24&checkout=2019-03-25&hotelname=&searchboxarg=t&optionid=286&optiontype=Intlcity&display=H%C3%A0%20N%E1%BB%99i%20(Hanoi)%2C%20Vi%E1%BB%87t%20Nam&markland=&adult=1&children=0&ages=&label=YE1SJGSgjUOcLQ0_fh0iJA&pageno=1&hotelid=&allianceid=&sid=&sort=sr1&starlist=5&filterHotels="
  },
  {
    name: "hue",
    baseUrl:
      "https://vn.trip.com/hotels/list?city=-1&checkin=2019-03-24&checkout=2019-03-25&hotelname=&searchboxarg=t&optionid=11213&optiontype=Province&optionname=T%E1%BB%89nh%20Th%E1%BB%ABa%20Thi%C3%AAn-Hu%E1%BA%BF&display=T%E1%BB%89nh%20Th%E1%BB%ABa%20Thi%C3%AAn-Hu%E1%BA%BF&markland=T%E1%BB%89nh%20Th%E1%BB%ABa%20Thi%C3%AAn-Hu%E1%BA%BF%20(Tinh%20Thua%20Thien-Hue)&adult=1&children=0&ages=&label=YE1SJGSgjUOcLQ0_fh0iJA&pageno=1&hotelid=&allianceid=&sid=&optionId=11213&optionName=T%E1%BB%89nh%20Th%E1%BB%ABa%20Thi%C3%AAn-Hu%E1%BA%BF&optionType=Province&starlist=5&sort=sr1&filterHotels="
  },
  {
    name: "ho_chi_minh",
    baseUrl:
      "https://vn.trip.com/hotels/list?city=301&checkin=2019-03-24&checkout=2019-03-25&hotelname=&searchboxarg=t&optionid=301&optiontype=Intlcity&display=Ho%20Chi%20Minh%20City%2C%20Vietnam&markland=&adult=1&children=0&ages=&label=YE1SJGSgjUOcLQ0_fh0iJA&pageno=1&hotelid=&allianceid=&sid=&sort=sr1&starlist=5&filterHotels="
  },
  {
    name: "binh_duong",
    baseUrl:
      "https://vn.trip.com/hotels/list?city=-1&checkin=2019-03-24&checkout=2019-03-25&hotelname=&searchboxarg=t&optionid=11242&optiontype=Province&optionname=B%C3%ACnh%20D%C6%B0%C6%A1ng&display=B%C3%ACnh%20D%C6%B0%C6%A1ng&markland=B%C3%ACnh%20D%C6%B0%C6%A1ng%20(Binh%20Duong)&adult=1&children=0&ages=&label=YE1SJGSgjUOcLQ0_fh0iJA&pageno=1&hotelid=&allianceid=&sid=&optionId=11242&optionName=B%C3%ACnh%20D%C6%B0%C6%A1ng&optionType=Province&starlist=5&sort=sr1&filterHotels="
  },
  {
    name: "can_tho",
    baseUrl:
      "https://vn.trip.com/hotels/list?city=36145&checkin=2019-03-24&checkout=2019-03-25&hotelname=&searchboxarg=t&optionid=36145&optiontype=Intlcity&display=C%E1%BA%A7n%20Th%C6%A1%20(Can%20Tho)%2C%20Vi%E1%BB%87t%20Nam&markland=&adult=1&children=0&ages=&label=YE1SJGSgjUOcLQ0_fh0iJA&pageno=1&hotelid=&allianceid=&sid=&starlist=5&sort=sr1&filterHotels="
  }
];

const getUrls = cityInfo => {
  const urls = [cityInfo.baseUrl];

  [4, 3, 2].map(val => {
    const url = cityInfo.baseUrl.replace(/starlist=5/, `starlist=${val}`);
    urls.push(url);
  });
  return urls;
};

const data = datas[2];
// fs.mkdirSync(`./${data.name}`);
const urls = getUrls(data);
getData(`./${data.name}/${data.name}_3_star.json`, urls[2]);
