const apiKey = "d8f501a3e4cd48ee8649518a4dc9a58a";
const body = document.getElementById("body");
const bgChange = document.getElementById("bg-change");
const bgimages = ['bg1', 'bg2', 'bg3', 'bg4']
const otherDays=document.getElementById('other-days');
const searchBtn = document.getElementById("search");
const firstDay = document.getElementById("first-day");
const rainIcons = ['clear', 'cloud', 'cold', 'misc', 'rain', 'snow', 'thunderstorm', 'wind']

let counter = 0;

function getDay(day) {

    const date = new Date(day);

    // Array of weekday names
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    // Array of month names
    const months = [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ];

    // Get the weekday name
    const weekday = weekdays[date.getUTCDay()];
    // Get the month name
    const month = months[date.getUTCMonth()];
    // Get the year
    const year = date.getUTCFullYear();

    // Format the date as "Sunday, June 2024"
    return `${weekday}`;
}
function getInfo(day){
    let weatherDes = day.weather.description;
    let indexImage = rainIcons.findIndex(icon => weatherDes.toLowerCase().includes(icon))
    if (indexImage===-1) indexImage=3
    return [weatherDes,indexImage]
}
function getApiData(city){
    let url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${apiKey}`;
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                if (response.status === 403) throw Error(`You don't have access to this file`);
                if (response.status === 404) throw Error('The requested location was not found');
                // add some other status codes ...
                throw Error('Something went wrong with your request');
            }
            return response.json();  //we only get here if there is no error
        })
        .then((res) => {
            let city = res.city_name;
            let country = res.country_code;
            let totalDays = res.data.length;
            console.log(totalDays)
            let day = res.data[0]
            let thisDay = getDay(day.datetime);
            let info=getInfo(day)
            console.log(info[1])
            firstDay.innerHTML = `
            <p  class="text-center text-uppercase">${thisDay}</p>
            <hr>
<!--            temp and pic-->
            <div class="row align-content-center justify-content-center align-items-center px-3">
                <img src="images/rainicons/${rainIcons[info[1]]}.png" alt="" class="text-center w-25 col-6 ">
                <h2 class="text-center col-6 fw-bold">${day.temp} °C</h2>
                <p class=" col-6 text-center fw-bold">${city}, ${country}</p>
            </div>
            <hr>
<!--            windspeed and humidity, min,max-->
            <div class="row justify-content-evenly">
                <div class="col-5 p-2 blue">
                    <p class="text-center fw-bold">Wind Speed</p>
                    <p class="fw-lighter text-center">${day.wind_spd} km/h</p>
                </div>
                <div class="col-5 p-2 green">
                    <p class="text-center fw-bold">Pres</p>
                    <p class="fw-lighter text-center">${day.pres}</p>
                </div>
                <div class="row col-12 p-2 mt-4">
                    <p class="col-6 text-center">Visibility</p>
                    <p class=" col-6  text-center">${day.vis}</p>
                </div>
                <div class="row col-12 p-2 ">
                    <p class="col-6 text-center">Min Temp</p>
                    <p class=" col-6  text-center">${day.min_temp} °C</p>
                </div>
                <div class="row col-12 p-2 ">
                    <p class="col-6 text-center">Max Temp</p>
                    <p class=" col-6  text-center">${day.max_temp} °C</p>
                </div>
            </div>
            <hr>
            <h4 class="text-center">${info[0]}</h4>

            `
            let moreDays='';
            for(i=1;i<7;i++){
                day=res.data[i]
                thisDay=getDay(day.datetime);
                info=getInfo(day)
                moreDays+=`
            <div class="col-12 col-sm-6 col-lg-4  my-3">
                    <div class="m-1 p-1 box text-center">
                        <p class="text-center">${thisDay}</p>
                        <hr>
                        <img src="images/rainicons/${rainIcons[info[1]]}.png" alt="" class="w-50">
                        <p class="fw-bold">${info[0]}</p>
                        <hr>
                        <h4>${day.temp} °C</h4>
                    </div>
                </div>
            `
            }
            otherDays.innerHTML=moreDays;

        })
        .catch((error) => console.error(error.message));
}

getApiData("brussels");
searchBtn.addEventListener('click', () => {
  let  searchText = document.getElementById("form1").value;
    console.log(searchText)
    getApiData(searchText);
})
bgChange.addEventListener('click', ev => {
    ev.preventDefault();
    counter++;
    if (counter > 3)
        counter = 0;
    body.style.backgroundImage = `url('../images/bg/${bgimages[counter]}.jpg')`
    console.log("pic changed")
})
