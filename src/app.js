const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("../src/utils/geocode.js");
const forecast = require("../src/utils/forecast.js");

const app = express();
const PORT = process.env.PORT || 3000;

//Define paths for express configs
const publicDirPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory to server
app.use(express.static(publicDirPath));

app.get("", function (req, res) {
  res.render("index", {
    title: "Weather",
    name: "Minas - Theodoros Charakopoulos",
  });
});

app.get("/about", function (req, res) {
  res.render("about", {
    title: "About",
    name: "Minas - Theodoros Charakopoulos",
  });
});

app.get("/help", function (req, res) {
  res.render("help", {
    title: "Help",
    name: "Minas - Theodoros Charakopoulos",
  });
});

app.get("/weather", function (req, res) {
  //address parameter is necessary
  if (!req.query.address) {
    return res.send({
      error: "No address provided!",
      format: "/weather?address=LOCATION",
    });
  }

  geocode.forwardGeocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({
        error,
      });
    }
    forecast(latitude, longitude, (error, weatherData, weatherImage) => {
      if (error) {
        return res.send({
          error,
        });
      }
      // everything went well
      res.send({
        forecast: weatherData,
        location,
        address: req.query.address,
        weatherImage,
      });
    });
  });
});

app.get("/current-weather", function (req, res) {
  if (!req.query.latitude || !req.query.longitude) {
    return res.send({
      error: "No coords for the location provided!",
      format: "/current-weather?latitude=LATITUDE_COORDS&longitude=LONGITUDE_COORDS",
    });
  }

  geocode.reverseGeocode(req.query.latitude, req.query.longitude, (error, location) => {
    if (error) {
      return res.send({
        error,
      });
    }
    forecast(req.query.latitude, req.query.longitude, (error, weatherData, weatherImage) => {
      if (error) {
        return res.send({
          error,
        });
      }
      // everything went well
      res.send({
        forecast: weatherData,
        location,
        latitude: req.query.latitude,
        longitude: req.query.longitude,
        weatherImage,
      });
    });
  });
});

// Errors use the same template and we just change dynamicly only the error message
app.get("/help/*", function (req, res) {
  res.render("404", {
    title: "404",
    errorMessage: "Help article not found",
    name: "Minas - Theodoros Charakopoulos",
  });
});

app.get("*", function (req, res) {
  res.render("404", {
    title: "404",
    errorMessage: "Page not found",
    name: "Minas - Theodoros Charakopoulos",
  });
});

app.listen(PORT, function (error) {
  if (error) {
    console.log("Error in server setup");
  } else {
    console.log(`Server is up on port ${PORT}`);
  }
});
