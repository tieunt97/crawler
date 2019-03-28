const fs = require("fs");
const _ = require("lodash");
const data = JSON.parse(
  fs.readFileSync("./danang_hotel.json").toString("utf8")
);
const data1 = JSON.parse(
  fs.readFileSync("./danang_hotel_1.json").toString("utf8")
);
const newData = _.unionBy(data, data1, "hotelId");
console.log(newData.length);
fs.writeFileSync("./danang_hotel.json", JSON.stringify(newData));
