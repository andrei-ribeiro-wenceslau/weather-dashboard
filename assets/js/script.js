// Declare global variables
let city = "";
let sCity = [];

// Get DOM elements
let searchCity = document.getElementById("city-input");
let searchButton = document.getElementById("search-button");
let clearButton = document.getElementById("clear-history");
let currentCity = document.getElementById("city-name");
let currentTemperature = document.getElementById("temperature");
let currentHumidity = document.getElementById("humidity");
let currentWSpeed = document.getElementById("wind-speed");

// Function to check if city is already in the search history
function find(c) {
  for (var i = 0; i < sCity.length; i++) {
    if (c.toUpperCase() === sCity[i]) {
      return -1;
    }
  }
  return 1;
}

// API key for OpenWeatherMap
let APIKey = "cc97e839200ca85880e079aae753b777";

// Event handler for displaying weather
function displayWeather(event) {
  event.preventDefault();
  if (searchCity.value.trim() !== "") {
    city = searchCity.value.trim();
    currentWeather(city);
  }
}

// Function to fetch current weather data
function currentWeather(city) {
  const queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&APPID=" +
    APIKey;
  fetch(queryURL)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      return response.json();
    })
    .then(function (response) {
      console.log(response);

      // Extract relevant weather data from response
      const weathericon = response.weather[0].icon;
      const iconurl =
        "https://openweathermap.org/img/wn/" + weathericon + "@2x.png";
      const date = new Date(response.dt * 1000).toLocaleDateString();
      const tempF = ((response.main.temp - 273.15) * 1.8 + 32).toFixed(2);
      const ws = response.wind.speed;
      const windsmph = (ws * 2.237).toFixed(1);

      // Update DOM elements with weather data
      currentCity.innerHTML =
        response.name + " (" + date + ")" + "<img src=" + iconurl + ">";
      currentTemperature.innerHTML = tempF + "&#8457;";
      currentHumidity.innerHTML = response.main.humidity + "%";
      currentWSpeed.innerHTML = windsmph + "MPH";

      // Call forecast function
      forecast(response.id);

      // Update search history
      if (response.cod == 200) {
        sCity = JSON.parse(localStorage.getItem("cityname"));
        console.log(sCity);
        if (sCity == null) {
          sCity = [];
          sCity.push(city.toUpperCase());
          localStorage.setItem("cityname", JSON.stringify(sCity));
          addToList(city);
        } else {
          if (find(city) > 0) {
            sCity.push(city.toUpperCase());
            localStorage.setItem("cityname", JSON.stringify(sCity));
            addToList(city);
          }
        }
      }
    })
    .catch(function (error) {
      console.log("Error: " + error);
    });
}

// Event listener for search button
searchButton.addEventListener("click", displayWeather);

// Function to fetch forecast data
function forecast(cityid) {
  const dayover = false;
  const queryforcastURL =
    "https://api.openweathermap.org/data/2.5/forecast?id=" +
    cityid +
    "&appid=" +
    APIKey;
  fetch(queryforcastURL)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      return response.json();
    })
    .then(function (response) {
      for (i = 0; i < 5; i++) {
        // Extract forecast data for each day
        const date = new Date(
          response.list[((i + 1) * 8) - 1].dt * 1000
        ).toLocaleDateString();
        const iconcode = response.list[((i + 1) * 8) - 1].weather[0].icon;
        const iconurl =
          "https://openweathermap.org/img/wn/" + iconcode + ".png";
        const tempK = response.list[((i + 1) * 8) - 1].main.temp;
        const tempF = (((tempK - 273.5) * 1.8) + 32).toFixed(2);
        const humidity = response.list[((i + 1) * 8) - 1].main.humidity;
        const windSpeed = response.list[((i + 1) * 8) - 1].wind.speed;

        // Update forecast elements in the DOM
        document.getElementById("fDate" + i).innerHTML = date;
        document.getElementById("fImg" + i).innerHTML =
          "<img src=" + iconurl + ">";
        document.getElementById("fTemp" + i).innerHTML = tempF + "&#8457;";
        document.getElementById("fHumidity" + i).innerHTML = humidity + "%";
        document.getElementById("fWind" + i).innerHTML = windSpeed + "MPH";
      }
    })
    .catch(function (error) {
      console.log("Error: " + error);
    });
}

// Function to add city to search history
function addToList(c) {
  const listEl = document.createElement("li");
  listEl.innerHTML = c.toUpperCase();
  listEl.classList.add("list-group-item");
  listEl.setAttribute("data-value", c.toUpperCase());
  document.querySelector(".list-group").appendChild(listEl);
}

// Event handler for past search items
function invokePastSearch(event) {
  const liEl = event.target;
  if (event.target.matches("li")) {
    city = liEl.textContent.trim();
    currentWeather(city);
  }
}

// Event listener for past search items
document
  .querySelector(".list-group")
  .addEventListener("click", invokePastSearch);

// Function to clear search history
function clearHistory(event) {
  event.preventDefault();
  sCity = [];
  localStorage.removeItem("cityname");
  document.querySelector(".list-group").innerHTML = "";
}

// Event listener for clear history button
clearButton.addEventListener("click", clearHistory);

// Event listener when the window loads
window.addEventListener("load", function () {
  sCity = JSON.parse(localStorage.getItem("cityname"));
  if (sCity !== null) {
    sCity.forEach(function (city) {
      addToList(city);
    });
  }
});