const axios = require("axios");
const _ = require("lodash");
const fs = require("fs");

var hotels = [];
async function getHotel(cityId, hotelId) {
  // uri = `https://vn.trip.com/hotels/Detail/GetNearbyHotelsJson?cityid=${cityId}&checkin=2019/03/25&CheckOut=2019/03/26&hotel=${hotelId}`;
  uri = `https://vn.trip.com/hotels/Detail/GetNearbyHotelsJson?cityid=${cityId}&checkin=2019/03/27&CheckOut=2019/03/28&hotel=${hotelId}`;
  const response = await axios.default.get(uri);
  return response.data;
}
(async () => {
  const max = 1000;
  // 286
  // // 6150611
  // // 2533663
  // // 24386775
  // // 2832275
  // 1356
  // // 9628497
  // // 16012426
  // // 12377318
  // // 2647148
  // // 6062703
  // // 5895862
  // // 713598
  // // 23151826
  // // 1902230
  // // 9594008
  // // 8981025
  // // 2098810
  // // 9046120
  // // 2199746
  // // 13683692
  // // 5032421
  // // 11988625
  // // 11072414
  // // 2199352
  // // 4600932
  // // 24219433
  // // 24738646
  // // 1418702
  // // 713941
  // // 2864037
  // // 11988625
  var data = await getHotel(1356, 11988625);
  hotels.push(...data.HotelList);
  var hotelIds = hotels.map(hotel => hotel.hotelId);
  var idFounds = hotelIds;
  while (hotels.length < max && hotelIds.length) {
    for (let id of hotelIds) {
      data = await getHotel(286, id);
      hotels.push(...data.HotelList);
    }
    hotels = _.uniqBy(hotels, function(hotel) {
      return hotel.hotelId;
    });
    var newIds = hotels.map(hotel => hotel.hotelId);
    hotelIds = newIds.filter(id => !_.includes(idFounds, id));
    idFounds.push(...hotelIds);
    console.log(hotelIds);
  }
  fs.writeFileSync("./danang_hotel_1.json", JSON.stringify(hotels));
})();
