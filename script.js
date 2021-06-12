//change nightmode to sunset time
//show time of city displayed, external api?

let apiKey = "a48984de2e1866778622568cbcb97ff1";
let apiFront = "https://api.openweathermap.org/data/2.5/weather?";

function findCurrentGps() {
  navigator.geolocation.getCurrentPosition(findLatLong);
}

function findLatLong(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  axios
    .get(`${apiFront}lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`)
    .then(displayGpsStats);
}

function displayGpsStats(response) {
  document.querySelector("#city-title").innerHTML = response.data.name;
  document.querySelector(
    "#country"
  ).innerHTML = `, ${response.data.sys.country}`;
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("h2").innerHTML = `${Math.round(
    response.data.main.temp
  )}º`;

  getForecast(response.data.coord);
}

function showCityTemp(response) {
  document.querySelector("#city-title").innerHTML = response.data.name;
  document.querySelector(
    "#country"
  ).innerHTML = `, ${response.data.sys.country}`;
  let temp = Math.round(response.data.main.temp);
  document.querySelector("h2").innerHTML = `${temp}º`;
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;

  let iconElement = document.getElementById("main-image");
  let weather = response.data.weather[0].main;
  if (hour > 20) {
    iconElement.src = "images/moon.png";
    iconElement.alt = "Moon emoji";
  } else {
    if (weather === "Clear") {
      iconElement.src = "images/sun.png";
      iconElement.alt = "Sun emoji";
    } else {
      if (weather === "Clouds") {
        iconElement.src = "images/cloud.png";
        iconElement.alt = "Clouds emoji";
      } else {
        if (weather === "Rain" || weather === "Drizzle") {
          iconElement.src = "images/rain.png";
          iconElement.alt = "Clouds with rain emoji";
        } else {
          if (weather === "Thunderstorm") {
            iconElement.src = "images/thunder.png";
            iconElement.alt = "Clouds with lightening emoji";
          } else {
            if (weather === "Snow") {
              iconElement.src = "images/snow.png";
              iconElement.alt = "Snow emoji";
            } else {
              iconElement.src = "images/mist.png";
              iconElement.alt = "Mist emoji";
            }
          }
        }
      }
    }
  }

  getForecast(response.data.coord);
}

function citySearch(event) {
  event.preventDefault();

  let city = document.getElementById("city-search").value;
  document.forms["search-bar"].reset();
  axios
    .get(`${apiFront}q=${city}&appid=${apiKey}&units=metric`)
    .then(showCityTemp);

  document.querySelector(".celciusButton").classList.add("buttonUnclicked");
  document.querySelector(".farenButton").classList.remove("buttonClicked");
  document.querySelector(".celciusButton").classList.add("buttonClicked");
}

function getForecast(coordinates) {
  let city = document.querySelector("#city-title").innerText;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,alerts&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function convertFahrenheit(event) {
  event.preventDefault();

  let city = document.getElementById("city-title");
  axios
    .get(`${apiFront}q=${city.textContent}&appid=${apiKey}&units=imperial`)
    .then(showCityTemp);

  document.querySelector(".farenButton").classList.add("buttonClicked");
  document.querySelector(".celciusButton").classList.remove("buttonClicked");
  document.querySelector(".celciusButton").classList.add("buttonUnclicked");
}

function convertCelcius(event) {
  event.preventDefault();

  let city = document.querySelector("#city-title");
  axios
    .get(`${apiFront}q=${city.textContent}&appid=${apiKey}&units=metric`)
    .then(showCityTemp);

  document.querySelector(".celciusButton").classList.add("buttonUnclicked");
  document.querySelector(".farenButton").classList.remove("buttonClicked");
  document.querySelector(".celciusButton").classList.add("buttonClicked");
}

function displayForecast(response) {
  console.log(response.data.daily);
  let array = response.data.daily;

  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="five-day-container">`;

  array.forEach(function (array, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
    <div class="column">
        <div class="weekly-head day-1">${array.dt}</div>
         <div class="weekly-img img-1">
               <img src="images/sun.png" />
         </div>
         <div class="weekly-low low-1">4°C</div>
         <div class="weekly-high high-1">16°C</div>
         </div>
    `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function formatForcastDay(timestamp) {
  let date = newDate(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function nightMode() {
  if (hour > 20) document.querySelector("body").classList.add("night-bg");
  if (hour > 20) document.querySelector(".main-image").src = "images/moon.png";
}

let now = new Date();

let hour = now.getHours();
if (hour < 10) hour = "0" + now.getHours();
let minute = now.getMinutes();
if (minute < 10) minute = "0" + now.getMinutes();
let date = now.getDate();
if (date < 10) date = "0" + now.getDate();
let months = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];
let month = months[now.getMonth()];
let year = now.getFullYear();

document.querySelector("#current-time").innerHTML = `${hour}:${minute}`;

document.querySelector("#current-date").innerHTML = `${date}/${month}/${year}`;

let searchBar = document.querySelector("#search-bar");
searchBar.addEventListener("submit", citySearch);

let fahrenheitButton = document.querySelector("#fahrenheit-temp");
fahrenheitButton.addEventListener("click", convertFahrenheit);

let celciusButton = document.querySelector("#celcius-temp");
celciusButton.addEventListener("click", convertCelcius);

let currentLocation = document.querySelector("#gps-link");
currentLocation.addEventListener("click", findCurrentGps);

findCurrentGps();
nightMode();

displayForecast();
