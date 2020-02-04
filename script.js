let latitude = "42.7654";
let longitude = "-71.4676";

let darkSkyKey = "9450f4544fe3b3a90153d0ae75dd26b4";
//let queryURL = "https://api.darksky.net/forecast/" + [darkSkyKey] + "/" + [latitude] + "," + [longitude];
//let queryURL = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=76ccf41f859d4c3ba1e1bebd2d7d68c6&pretty=1`

let openSourceKey = "385f1fe6754a2d060b415c44e6a80bb220c25dfae2dcfbf05dfbffd6";
let openCageKey = "76ccf41f859d4c3ba1e1bebd2d7d68c6";

//get state from geolocation and plug that in as the state//

// navigator.geolocation.getCurrentPosition(function(location){
//     console.log(location);
//     latitude = location.coords.latitude;
//     longitude = location.coords.longitude;
//     console.log(latitude, longitude);

// })

$(".btn").on("click", function() {
  const input = $("#city").val();

  $.ajax({
    url: `https://api.opencagedata.com/geocode/v1/json?q=${input}&key=76ccf41f859d4c3ba1e1bebd2d7d68c6&pretty=1`,
    method: "GET"
  }).then(function(response) {
    const state = response.results[0].components.state_code;
    const city = response.results[0].components.city;

    $.ajax({
      url: `https://api.weatherbit.io/v2.0/current?city=${city},${state}&key=18d2f52e38b340edbcffc0bc40a9555e&units=I`,
      method: "GET"
    }).then(function(response) {
        console.log(response)
        const date = response.data[0].datetime
        const temp = response.data[0].temp
        const humidity = response.data[0].rh
        const windSpeed = response.data[0].wind_spd
        const uV = response.data[0].uv;
        const iconCode = response.data[0].weather.icon
        //console.log(temp, humidity, windSpeed, uV, iconCode)
        

    });
  });
});
