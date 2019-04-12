const fs = require("fs");
const _ = require("lodash");

const filterData = filePath => {
  const datas = JSON.parse(fs.readFileSync(filePath).toString("utf8"));
  const newDatas = _.filter(datas, data => data.rooms.length > 0);
  fs.writeFileSync(filePath, JSON.stringify(newDatas));
};

filterData("./ho_chi_minh_hotel_1.json");
