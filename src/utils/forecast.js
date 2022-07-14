const request = require("postman-request");

const forecast = (latitude, longitude, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=21314e5692462bf985409b1f55196548&query=${latitude},${longitude}`;

  request({ url, json: true }, function (error, response, body) {
    if (error) {
      callback("Unable to connect to weather service!", undefined);
    } else if (body.error) {
      callback("Unable to find location for weather...", undefined);
    } else {
      const weatherImage = body.current.weather_icons[0];
      const forecastDesc = `${body.current.weather_descriptions[0]}. It's currently ${body.current.temperature} degress out. It feels like ${body.current.feelslike} degress out.`;
      callback(undefined, forecastDesc, weatherImage);
    }
  });
};

module.exports = forecast;
