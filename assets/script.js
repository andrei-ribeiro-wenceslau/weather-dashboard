let city = "";

let searchCity = document.getElementById("city-input");
let searchButton = document.getElementById("search-button");
let clearButton = document.getElementById("clear-history");
let currentCity = document.getElementById("city-name");
let currentTemperature = document.getElementById("temperature");
let currentHumidity = document.getElementById("humidity");
let currentWSpeed = document.getElementById("wind-speed");
let sCity = [];


function find(c) {
    for (var i = 0; i < sCity.length; i++) {
      if (c.toUpperCase() === sCity[i]) {
        return -1;
      }
    }
    return 1;
  }
  

  let APIKey = "cc97e839200ca85880e079aae753b777";
  

  function displayWeather(event) {
    event.preventDefault();
    if (searchCity.value.trim() !== "") {
      city = searchCity.value.trim();
      currentWeather(city);
    }
  }
  
    function currentWeather(city) {
    const queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey;
      fetch(queryURL)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Network response was not OK");
        }
        return response.json();
      })
      .then(function (response) {

        console.log(response);

        const weathericon = response.weather[0].icon;
        const iconurl = "https://openweathermap.org/img/wn/" + weathericon + "@2x.png";

        const date = new Date(response.dt * 1000).toLocaleDateString();

        currentCity.innerHTML = response.name + " (" + date + ")" + "<img src=" + iconurl + ">";

        const tempF = ((response.main.temp - 273.15) * 1.8 + 32).toFixed(2);
        currentTemperature.innerHTML = tempF + "&#8457;";

        currentHumidity.innerHTML = response.main.humidity + "%";
    
        const ws = response.wind.speed;
        const windsmph = (ws * 2.237).toFixed(1);
        currentWSpeed.innerHTML = windsmph + "MPH";
  
        forecast(response.id);
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
  
  searchButton.addEventListener("click", displayWeather);  
  

  function forecast(cityid) {
      const dayover = false;
      const queryforcastURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityid + "&appid=" + APIKey;
      fetch(queryforcastURL)
        .then(function (response) {
          if (!response.ok) {
            throw new Error("Network response was not OK");
          }
          return response.json();
        })
        .then(function (response) {
          for (i = 0; i < 5; i++) {
            const date = new Date(response.list[((i + 1) * 8) - 1].dt * 1000).toLocaleDateString();
            const iconcode = response.list[((i + 1) * 8) - 1].weather[0].icon;
            const iconurl = "https://openweathermap.org/img/wn/" + iconcode + ".png";
            const tempK = response.list[((i + 1) * 8) - 1].main.temp;
            const tempF = (((tempK - 273.5) * 1.8) + 32).toFixed(2);
            const humidity = response.list[((i + 1) * 8) - 1].main.humidity;
            const windSpeed = response.list[((i + 1) * 8) - 1].wind.speed;
    
            document.getElementById("fDate" + i).innerHTML = date;
            document.getElementById("fImg" + i).innerHTML = "<img src=" + iconurl + ">";
            document.getElementById("fTemp" + i).innerHTML = tempF + "&#8457;";
            document.getElementById("fHumidity" + i).innerHTML = humidity + "%";
            document.getElementById("fWind" + i).innerHTML = windSpeed + "MPH";
          }
        })
        .catch(function (error) {
          console.log("Error: " + error);
        });
  }
  
 
