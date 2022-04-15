const appKey = "6d351c3069b14584a1a8072cccbd5f34";
// 6d351c3069b14584a1a8072cccbd5f34
let searchButton = document.getElementById("submit");
let celciusButton = document.getElementById("celcius");
let farenButton = document.getElementById("farenheit");
let searchInput = document.getElementById("search-text");
let cityName = document.getElementById("city-name");
let conditionW = document.getElementById("weather-condition");

searchButton.addEventListener("click", findWeatherDetails);
searchInput.addEventListener("keyup", enterPressed);
celciusButton.addEventListener("click", celciusPressed);
farenButton.addEventListener("click", farenPressed);
var faren = false;
var x = 1;
var yAxisTitle = "Celcius";

var d = new Date();
var weekday = new Array(7);
weekday[0] = "Sun";
weekday[1] = "Mon";
weekday[2] = "Tues";
weekday[3] = "Wed";
weekday[4] = "Thurs";
weekday[5] = "Fri";
weekday[6] = "Sat";

function enterPressed(event) {
  if (event.key === "Enter") {
    findWeatherDetails();
  }
}

function celciusPressed() {
	faren = false;
	yAxisTitle = "Celcius";
	findWeatherDetails();
}

function farenPressed() {
	faren = true;
	yAxisTitle = "Farenheit";
	findWeatherDetails();
}

function findWeatherDetails() {
  if (searchInput.value === "") {
  
  }else {
   let api = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput.value + "&appid="+appKey;
   makeRequest(api, theResponse);
   let api2 = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput.value + "&appid="+appKey;
   makeRequest(api2, theResponseForecast);
  }
 }

function theResponse(response) {
  let jsonObject = JSON.parse(response);
  cityName.innerHTML = jsonObject.name;
  icon.src = "http://openweathermap.org/img/w/" + jsonObject.weather[0].icon + ".png";
  humidity.innerHTML = "Humidity: " + jsonObject.main.humidity + "%";
  wind.innerHTML = "Wind: " + jsonObject.wind.speed + " m/s";
  conditionW.innerHTML = jsonObject.weather[0].main ;
  if (faren == false) {
	temp.innerHTML = parseInt(jsonObject.main.temp - 273) + "°C";
  }
  else {
	  temp.innerHTML = parseInt((jsonObject.main.temp * 9/5) - 460) + "°F";
  }
}

function theResponseForecast(response) {
  let jsonObject = JSON.parse(response);
  var n = new Date().getDay();
  var p = Object.keys(jsonObject.list).length;
  for (x = 1; x <= 5 ; x++) {
	  var t = p - ((5 - x) * 8) - 1;
	  document.getElementById("dayf"+x).innerHTML = weekday[(n + x) % 7];
	  if (faren == false) {
	   document.getElementById("tempf"+x).innerHTML = parseInt(jsonObject.list[t].main.temp_min -273)  + "°C" + " " +
	   parseInt(jsonObject.list[t].main.temp_max - 273)  + "°C" ;
	  }
	  else {
	   document.getElementById("tempf"+x).innerHTML = parseInt(jsonObject.list[t].main.temp_min * 9/5 - 460)  + "°F" + " " +
	   parseInt(jsonObject.list[t].main.temp_max * 9/5 - 460)  + "°F" 
	  }
	  document.getElementById("iconf"+x).src = "http://openweathermap.org/img/w/" +  
	  jsonObject.list[t].weather[0].icon + ".png"; 
  }
	  var chart = new CanvasJS.Chart("chart", {
	  animationEnabled: true,
	  theme: "light2",
	  backgroundColor: "#9FFFFF",
	  fontfamily: "Consolas",
	  title:{
		text: "Hourly Forecast"
	  },
	  axisY:{
		title: yAxisTitle
	  },
	  axisX:{
		title: "Hour",
		includeZero: false
	  },
	  data: [{        
		type: "line",       
	  dataPoints: [
	  ]
	  }]
   });
  for (x = 0; x < p ; x++) {
	  if (faren == false) {
	  var datatemp = parseInt(jsonObject.list[x].main.temp_min -273) 
	  }
	  else  {
	  var datatemp = parseInt(jsonObject.list[x].main.temp_min * 9/5 - 460) 
	  }
	  chart.options.data[0].dataPoints.push( { x: 3 *( x+1 ), y: datatemp} );
  }
	chart.render();
}

function makeRequest(url, callback)
{
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = () => { 
        if (httpRequest.readyState == 4 && httpRequest.status == 200)
            callback(httpRequest.responseText);
    }
    httpRequest.open("GET", url, true);
    httpRequest.send();
}