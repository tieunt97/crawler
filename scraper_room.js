const fs = require("fs");
const puppeteer = require("puppeteer");

const data = JSON.parse(
  fs.readFileSync("./data/ho_chi_minh.json").toString("utf8")
);

function extractItems() {
  const extractedElements = document.querySelectorAll(".hotel-type__list");
  const items = [];
  for (let element of extractedElements) {
    const image = element
      .querySelector("img.lazyLoad")
      .getAttribute("data-ub_value");
    const roomName = element
      .querySelector(".h-type__name.is-link")
      .innerText.trim();
    const acreage = element
      .querySelector(".o-fi-txt>li:first-child")
      .innerText.trim();
    const hotelTypeItems = element.querySelectorAll(
      ".hotel-type__item:not(.hotel-type__more)"
    );
    const beds = Array.from(hotelTypeItems, hotel => {
      const bedType = hotel.querySelector(".room-bedinfo").textContent.trim();
      const facilities = Array.from(
        hotel.querySelectorAll(".h-facilities ul li"),
        e => e.textContent.trim()
      );
      const policies = Array.from(
        hotel.querySelectorAll(".h-policy ul li span"),
        e => e.textContent.trim()
      );
      const price = hotel.querySelector(".o-price__num").innerText.trim();
      return {
        bedType,
        facilities,
        policies,
        price
      };
    });
    items.push({
      image: `https:${image}`,
      roomName,
      acreage,
      beds
    });
  }
  return items;
}

async function scrapeInfiniteScrollItems(page, extractItems) {
  let items = [];
  try {
    await page.waitFor(200);
    items = await page.evaluate(extractItems);
  } catch (error) {
    console.log("error:", error);
  }
  return items;
}

const getData = async (file, url) => {
  const brwoser = await puppeteer.launch();
  const page = await brwoser.newPage();
  page.setViewport({ width: 1280, height: 926 });

  await page.goto(url);

  const items = await scrapeInfiniteScrollItems(page, extractItems);
  await brwoser.close();
  return items;
};

(async function() {
  const datas = [];
  for (let i = 114, len = data.length; i < 260; i++) {
    try {
      const rooms = await getData("", data[i].hotelUrl);
      console.log("hotelId: ", data[i].hotelId, " - total: ", i + 1);
      data[i].rooms = rooms;
      // console.log(JSON.stringify(rooms));
      datas.push(data[i]);
    } catch (error) {
      console.log("error 1: ", error);
      break;
    }
  }
  // console.log(JSON.stringify(datas[0]));
  fs.writeFileSync("./ho_chi_minh_hotel_2.json", JSON.stringify(datas));
})();
