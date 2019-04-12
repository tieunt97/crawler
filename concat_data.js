const fs = require("fs");

const data1 = JSON.parse(
  fs.readFileSync("./ho_chi_minh_hotel_1.json").toString("utf8")
);
const data2 = JSON.parse(
  fs.readFileSync("./ho_chi_minh_hotel_2.json").toString("utf8")
);

fs.writeFileSync(
  "./ho_chi_minh_hotel_1.json",
  JSON.stringify([...data1, ...data2])
);
