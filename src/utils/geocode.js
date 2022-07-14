const request = require("postman-request");

const forwardGeocode = (address, callback) => {
  const url = `http://api.positionstack.com/v1/forward?access_key=124243b906e95b62f321d2640c6b8e58&query=${encodeURIComponent(address)}`;

  request({ url, json: true }, function (error, response, body) {
    if (error) {
      callback("Unable to connect to location service!", undefined);
    } else if (body.error || body.data.length === 0) {
      callback("Unable to find cordinates based on the given location...Try another search!", undefined);
    } else {
      latitude = body?.data[0]?.latitude;
      longitude = body?.data[0]?.longitude;
      callback(undefined, { latitude, longitude, location: body?.data[0]?.label });
    }
  });
};

const reverseGeocode = (latitude, longitude, callback) => {
  const url = `http://api.positionstack.com/v1/reverse?access_key=124243b906e95b62f321d2640c6b8e58&query=${latitude},${longitude}`;

  request({ url, json: true }, function (error, response, body) {
    if (error) {
      callback("Unable to connect to location service!", undefined);
    } else if (body.error || body.data.length === 0) {
      callback("Unable to find location based on the given coords...Try another query!", undefined);
    } else {
      callback(undefined, body?.data[0]?.label);
    }
  });
};

module.exports = {
  forwardGeocode: forwardGeocode,
  reverseGeocode: reverseGeocode,
};
