const reqStatus = document.getElementById("status");
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const city = document.getElementById("city");
const temperature = document.getElementById("temperature");
const feelsLike = document.getElementById("feels-like");
const locationButton = document.getElementById("location-button");
const weatherDescription = document.getElementById("weather-description");
const unitsCheckbox = document.getElementById("units");
const weatherIcon = document.getElementById("weather-icon");

const API_KEY = "b0a418437ecc894460a78d050cf22eb5";

let weatherData = [];
let units = "metric";
let prevCity = "";
let defaultFunction = () => getDataByGeo();

async function getDataByName(name) {
  const resp = await fetch(
    "https://api.openweathermap.org/data/2.5/weather?units=" +
      units +
      "&q=" +
      name +
      "&appid=" +
      API_KEY
  );
  const data = await resp.json();
  weatherData = data;
  displayData();
}

function getCoordinates() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

async function getDataByGeo() {
  let loc = [];
  if (navigator.geolocation) {
    try {
      const position = await getCoordinates();
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      loc = [latitude, longitude];
    } catch {
      reqStatus.textContent =
        "Location unavailable. Displaying default location: London";
    }
    if (loc.length != 2) loc = ["51.5085", "-0.1257"];
    const resp = await fetch(
      "https://api.openweathermap.org/data/2.5/weather?units=" +
        units +
        "&lat=" +
        loc[0] +
        "&lon=" +
        loc[1] +
        "&appid=" +
        API_KEY
    );
    const data = await resp.json();
    weatherData = data;
  } else {
    reqStatus.textContent = "Location is Disabled or isn't Supported!";
  }
  displayData();
}

function currentUnit() {
  if (units == "imperial") {
    return "F";
  } else {
    return "C";
  }
}

function displayData() {
  if (weatherData != undefined) {
    console.log(weatherData);
    city.textContent = weatherData.name + ", " + weatherData.sys.country;
    temperature.textContent =
      Math.round(weatherData.main.temp) + "°" + currentUnit();
    feelsLike.textContent =
      "Feels like " +
      Math.round(weatherData.main.feels_like) +
      "°" +
      currentUnit();
    weatherDescription.textContent = weatherData.weather[0].description;
    weatherIcon.src =
      "http://openweathermap.org/img/wn/" +
      weatherData.weather[0].icon +
      "@4x.png";
  } else {
    reqStatus.textContent = "error!";
  }
}

unitsCheckbox.addEventListener("click", () => {
  if (unitsCheckbox.checked) {
    units = "imperial";
  } else {
    units = "metric";
  }
  defaultFunction();
});

searchButton.addEventListener("click", () => {
  reqStatus.textContent = "";
  if (searchInput.value != "") {
    getDataByName(searchInput.value);
    prevCity = searchInput.value;
    searchInput.value = "";
    defaultFunction = () => getDataByName(prevCity);
  }
});

locationButton.addEventListener("click", () => {
  reqStatus.textContent = "";
  getDataByGeo();
  defaultFunction = () => getDataByGeo();
});

getDataByGeo();
