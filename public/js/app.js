"use strict";

const addressForm = document.querySelector("form");
const searchElement = document.querySelector("input");
const messageOne = document.querySelector("#message-1");
const messageTwo = document.querySelector("#message-2");
const weatherImageEl = document.querySelector("#image-weather");

//Load the forecast weather data for a specific location
const loadWeatherData = function (apiURL) {
  messageOne.textContent = "";
  messageTwo.textContent = "";
  weatherImageEl.style.display = "block";
  weatherImageEl.src = "../gif/loading_icon.gif";
  fetch(apiURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      messageOne.textContent = data.error ? "Error" : data.location;
      messageTwo.textContent = data.error || data.forecast || "Undefined";
      if (data.error) {
        weatherImageEl.style.display = "none";
      } else {
        weatherImageEl.style.display = "block";
        weatherImageEl.src = data.weatherImage;
      }
    });
};

addressForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  const location = searchElement.value;
  loadWeatherData(`/weather?address=${location}`);
});

(function () {
  if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(function (position) {
      loadWeatherData(`/current-weather?latitude=${position?.coords?.latitude}&longitude=${position?.coords?.longitude}`);
    });
})();
