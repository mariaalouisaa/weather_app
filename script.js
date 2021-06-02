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
  document.querySelector("h1").innerHTML = response.data.name;
  document.querySelector("h2").innerHTML = `${Math.round(
    response.data.main.temp
  )}º`;
}

function showCityTemp(response) {
  let temp = Math.round(response.data.main.temp);
  document.querySelector("h2").innerHTML = `${temp}º`;
}

function citySearch(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-search");
  document.querySelector("#city-title").innerHTML = cityInput.value;
  let city = cityInput.value;
  axios
    .get(`${apiFront}q=${city}&appid=${apiKey}&units=metric`)
    .then(showCityTemp);
}

function convertFahrenheit(event) {
  event.preventDefault();

  let cityInput = document.querySelector("#city-search");
  document.querySelector("#city-title").innerHTML = cityInput.value;
  let city = cityInput.value;
  axios
    .get(`${apiFront}q=${city}&appid=${apiKey}&units=imperial`)
    .then(showCityTemp);

  document.querySelector(".farenButton").classList.add("buttonClicked");
  document.querySelector(".celciusButton").classList.remove("buttonClicked");
  document.querySelector(".celciusButton").classList.add("buttonUnclicked");
}

function convertCelcius(event) {
  event.preventDefault();

  let cityInput = document.querySelector("#city-search");
  document.querySelector("#city-title").innerHTML = cityInput.value;
  let city = cityInput.value;
  axios
    .get(`${apiFront}q=${city}&appid=${apiKey}&units=metric`)
    .then(showCityTemp);

  document.querySelector(".celciusButton").classList.add("buttonUnclicked");
  document.querySelector(".farenButton").classList.remove("buttonClicked");
  document.querySelector(".celciusButton").classList.add("buttonClicked");
}

function changeBackground() {
  if ((hour) => 20) document.querySelector("body").classList.add("night-bg");
  if ((hour) => 20)
    document.getElementById("main-image").src = "images/moon.png";
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
changeBackground();
