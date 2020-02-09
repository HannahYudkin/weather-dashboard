//let darkSkyKey = "9450f4544fe3b3a90153d0ae75dd26b4";
//let queryURL = "https://api.darksky.net/forecast/" + [darkSkyKey] + "/" + [latitude] + "," + [longitude];
//let queryURL = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=76ccf41f859d4c3ba1e1bebd2d7d68c6&pretty=1`

let openSourceKey = "385f1fe6754a2d060b415c44e6a80bb220c25dfae2dcfbf05dfbffd6";
let openCageKey = "76ccf41f859d4c3ba1e1bebd2d7d68c6";

let cityArray = [];

if (localStorage.getItem("cityArray") === null) {
  localStorage.setItem("cityArray", JSON.stringify(cityArray));
} else {
  cityList = JSON.parse(localStorage.getItem("cityArray"));
  console.log(cityList);
  appendList();
}
function appendList() {
  $(".city-unordered-list").empty();
  for (var property in cityList) {
    $(".city-unordered-list").append(`
            <button value = ${cityList[property]} class= "btn city-btn" >${cityList[property]} </button>
            `);
  }
}

function getLocation(input) {
  return $.ajax({
    url: `https://api.opencagedata.com/geocode/v1/json?q=${input}&key=76ccf41f859d4c3ba1e1bebd2d7d68c6&pretty=1`,
    method: "GET"
  }).then(function(response) {
    const state = response.results[0].components.state_code;
    const city = response.results[0].components.city;

    return Promise.resolve({ state, city });
  });
}

function forcast(city, state) {
  $.ajax({
    url: `https://api.weatherbit.io/v2.0/current?city=${city},${state}&key=18d2f52e38b340edbcffc0bc40a9555e&units=I`,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    const temp = response.data[0].temp;
    const humidity = response.data[0].rh;
    const windSpeed = response.data[0].wind_spd;
    const uV = response.data[0].uv;
    const iconCode = response.data[0].weather.icon;

    clear();
    $(".current-weather").append(`

        <img class = iconWeather src="assets/icons/${iconCode}.png" height="auto" width="25%">
        <h6 class=weatherLable>
        Temperature: ${temp} °F
        <br>
        Humidity: ${humidity}
        <br>
        Wind Speed: ${windSpeed}
        <br>
        UV Index: <span class="uVSpan"> ${uV} </span>
        </h6>
        `);

    if (uV < 3) {
      $(".uVSpan").addClass(`favorable`);
    } else if (uV > 2 && uV < 8) {
      $(".uVSpan").addClass(`moderate`);
    } else {
      $(".uVSpan").addClass(`severe`);
    }
    return city;
  });
}

function fiveDayForecast(city, state) {
  $.ajax({
    url: `https://api.weatherbit.io/v2.0/forecast/dailycurrent?city=${city},${state}&key=18d2f52e38b340edbcffc0bc40a9555e&units=I&days=6`,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    const date = response.data[0].datetime;

    $(".current-weather").prepend(`
    <h2 class=dateLable> ${city}: (${date})</h2>
    `);

    for (let i = 1; i < 6; i++) {
      const datei = response.data[i].datetime;
      const tempi = response.data[i].temp;
      const humidityi = response.data[i].rh;
      const windSpeedi = response.data[i].wind_spd;
      const uVi = response.data[i].uv;
      const iconCodei = response.data[i].weather.icon;

      $(".five-day").append(`
        <div class=card col">
        <h3>(${datei})</h3>
        <h6>
        <img class = iconWeather src="assets/icons/${iconCodei}.png" height="auto" width="15%">
        Temperature: ${tempi} °F
        <br>
        Humidity: ${humidityi}
        <br>
        Wind Speed: ${windSpeedi}
        <br>
        UV Index: ${uVi}
        </h6>
        </div>`);
    }
  });
}

function clear() {
  $(".dateLable").empty();
  $(".weatherLable").empty();
  $(".iconWeather").remove();
  $(".five-day").empty();
}

$(document).on("click", ".submit", function() {
  const input = $("#city").val();
  cityArray = JSON.parse(localStorage.getItem("cityArray"));
  cityArray.push(input);
  localStorage.setItem("cityArray", JSON.stringify(cityArray));
  cityList = JSON.parse(localStorage.getItem("cityArray"));
  appendList();

  getLocation(input).then(function(locationObj) {
    forcast(locationObj.city, locationObj.state);
    fiveDayForecast(locationObj.city, locationObj.state);
  });
});

$(document).on("click", ".city-btn", function() {
  const input = $(this).val();
  getLocation(input).then(function(locationObj) {
    forcast(locationObj.city, locationObj.state);
    fiveDayForecast(locationObj.city, locationObj.state);
  });
});
