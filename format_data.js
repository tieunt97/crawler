const fs = require("fs");

function formatData(path) {
  const datas = JSON.parse(fs.readFileSync(path).toString("utf8"));

  datas.forEach(data => {
    delete data.hotelAmountL10n;
    delete data.rateClassName;
    delete data.OriginalStartPriceL10n;
    delete data.lat;
    delete data.lng;
    data.reviewUrl = "https:" + data.reviewUrl;
    data.hotelSmallPic = "https:" + data.hotelSmallPic;
    data.hotelUrl = "https:" + data.hotelUrl;
  });

  fs.writeFileSync(path, JSON.stringify(datas));
}

files = [
  "./danang_hotel.json"
  //   "./hanoi_hotel.json", OK
  //   "./ho_chi_minh.json" OK
];

files.forEach(file => {
  formatData(file);
});
