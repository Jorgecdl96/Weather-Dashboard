var city = document.querySelector('#city');
var searchBtn = document.querySelector('#search-weather');
var nameCity = document.getElementById('name');
var temp = document.getElementById('temp');
var wind = document.getElementById('wind');
var humidity = document.getElementById('humidity');
var uvIndContainer = document.getElementById('uvInd');
var cityNames = document.getElementById('city-names');
var cityForecast = document.getElementById('cityForecast'); 
var cityWeather = document.getElementById('city-specs'); 
var forecast1 = document.querySelector('.Forecast1');
var forecast2 = document.querySelector('.Forecast2');
var forecast3 = document.querySelector('.Forecast3');
var forecast4 = document.querySelector('.Forecast4');
var forecast5 = document.querySelector('.Forecast5');
var currentIcon = document.getElementById('currenticon');

var forecast = [0 , forecast1, forecast2, forecast3, forecast4, forecast5];

var DateTime = luxon.DateTime;

//console.log(DateTime.now().toLocaleString());

var dt = DateTime.now().plus({days: 1}).toLocaleString();


//console.log(dt);

searchBtn.addEventListener('click',function weatherApi() {

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.value}&units=imperial&appid=5249a5b3e7ab32499252bf3e6aa54bd3`)
    .then(res => res.json())
    .then(data => {
        currentWeather(data);
        cityHistorial();
        
        city.value = '';
    })
    .catch(err => {
        console.error(err);
        city.value = '';
        alert('This city does not exists, please submit a new city.');
    });
    
    
});


// current weather is pulled and printed in html
function currentWeather (specs) {


    var lattitude = specs.coord.lat;
    var longitude = specs.coord.lon;
    //console.log(specs);

    currentIcon.setAttribute('src', 'https://openweathermap.org/img/wn/' + specs.weather[0].icon + '@2x.png')
    currentIcon.setAttribute('alt', 'wheater icon');
    nameCity.textContent = specs.name + '  ' + '(' + DateTime.now().toLocaleString() + ')';
    temp.textContent = 'Temp: ' + specs.main.temp + ' °F';
    wind.textContent = 'Wind: ' + specs.wind.speed + ' MPH';
    humidity.textContent = 'Humidity: ' + specs.main.humidity + ' %';
    ;

    //pulling lattitude and longitud city 
    forecastApi(lattitude,longitude);
}

//getting forecasted weather through latitude and longitude
function forecastApi(lattitude, longitude){

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lattitude}&lon=${longitude}&exclude=minutely,hourly&units=imperial&appid=5249a5b3e7ab32499252bf3e6aa54bd3`)
    .then(res => res.json())
    .then(data => forecastWeather(data))
    .catch(err => console.error(err));
}

//getting forecasted weather
function forecastWeather(specs){

    //console.log(specs);
    const {daily} = specs;

    //printing UV index on current weather
    uvIndContainer.innerHTML = `<p>UV Index: <i id="uvi"> ${specs.current.uvi}</i></p>`;

    var uvIndex = document.getElementById('uvi');
    var uvBgColor = specs.current.uvi;

    //changing color according to UV index parameter
    uvBgColor <= 2 ? uvIndex.setAttribute('class', 'green rounded') : uvBgColor <= 7 ? uvIndex.setAttribute('class', 'yellow rounded') : uvIndex.setAttribute('class', 'red rounded');

    //printing the next 5 days of the current day 
    for (let i = 1; i < 6; i++) {
        
        forecast[i].innerHTML = 
        `<p style="font-weight: bold">${DateTime.now().plus({days: i}).toLocaleString()}</p>
        <img src="https://openweathermap.org/img/wn/${daily[i].weather[0].icon}@2x.png">
        <p>Temp: ${daily[i].temp.day} °F</p>
        <p>Wind: ${daily[i].wind_speed} MPH</p>
        <p>Humidity: ${daily[i].humidity} %</p>`
    }
}

var cities = JSON.parse(localStorage.getItem('cities')) || [];
let i = 0;

function cityHistorial (){
    
    cities.push(city.value.toLowerCase());
    localStorage.setItem('cities',JSON.stringify(cities));
    
    //printing every city searched
    for (; i < cities.length; i++) {
        var cityEl = document.createElement('p');
        cityEl.innerHTML = cities[i];
        cityNames.appendChild(cityEl);
        localStorage.clear();
    }
    
    //show the weather of the city by clicking on <p> element previously created.
    cityEl.addEventListener('click',
    function (e){
        var cityHistory = e.target.textContent;

        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityHistory}&units=imperial&appid=5249a5b3e7ab32499252bf3e6aa54bd3`)
        .then(res => res.json())
        .then(data => currentWeather(data))
        .catch(err => console.error(err));
    })

}
