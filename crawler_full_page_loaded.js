const { Builder, until } = require("selenium-webdriver");
const cheerio = require("cheerio");
const fs = require("fs");
var driver = new Builder()
  .forBrowser("firefox")
  .usingServer("http://localhost:4444/wd/hub")
  .build();

driver
  .get("https://tiki.vn/dien-thoai-smartphone/c1795/samsung?src=mega-menu")
  .then(() =>
    driver.wait(
      until.titleContains(
        "Điện thoại Samsung Galaxy | Chính hãng, Giá rẻ hơn Tại Tiki.vn"
      )
    )
  )
  .then(() => driver.getTitle())
  .then(title => {
    console.log(title);
  })
  .then(() => driver.getPageSource())
  .then(body => {
    var $ = cheerio.load(body);
    const list = $(".product-item");
    console.log(list.length);
    list.each(function() {
      var image = $(this)
        .find(".product-image.img-responsive")
        .attr("src")
        .trim();
      var name = $(this)
        .find(".title")
        .text()
        .trim();
      var price = $(this)
        .find(".final-price")
        .text()
        .trim()
        .replace(/ ₫/, "");
      fs.appendFile("tiki.txt", `${image} tpt ${name} tpt ${price}\n`);
    });
  })
  .then(() => {
    driver.quit();
  })
  .catch(error => {
    console.log("error: ", error);
    driver.quit();
  });
