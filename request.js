const axios = require("axios");
const _ = require("lodash");
const fs = require("fs");

var hotels = [];
async function getHotel(cityId, hotelId) {
  // uri = `https://vn.trip.com/hotels/Detail/GetNearbyHotelsJson?cityid=${cityId}&checkin=2019/03/25&CheckOut=2019/03/26&hotel=${hotelId}`;
  uri = `https://vn.trip.com/hotels/Detail/GetNearbyHotelsJson?cityid=${cityId}&checkin=2019/03/30&CheckOut=2019/03/31&lat=10.76421&lon=106.68267&star=4&hotel=${hotelId}&showtotalamt=null&FGTaxFee=`;
  const response = await axios.default.get(uri);
  return response.data;
}

async function getAllRelativeHotels(cityId, hotelId) {
  const max = 2000;
  // 286  HN
  // 1356 DN
  // 301  HCM
  var data = await getHotel(cityId, hotelId);
  hotels.push(...data.HotelList);
  var hotelIds = hotels.map(hotel => hotel.hotelId);
  var idFounds = hotelIds;
  while (hotels.length < max && hotelIds.length) {
    for (let id of hotelIds) {
      data = await getHotel(cityId, id);
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
  // return hotels
}

getAllRelativeHotels(1356, 11988625);

module.exports = {
  getAllRelativeHotels
};
