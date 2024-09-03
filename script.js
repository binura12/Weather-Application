const apiKey = 'a62aebaf0b274d51a16100612242908';
let searchBtn = document.getElementById("searchBtn");
const temp = document.getElementById("temp");
const conditionImg = document.getElementById("conditionImg");
const conditionTxt = document.getElementById("conditionTxt");
const rainTxt = document.getElementById("rainTxt");
const windTxt = document.getElementById("windTxt");
const locationTxt = document.getElementById("locationTxt");
const monthAndYear = document.getElementById("monthAndYear");
const clock = document.getElementById("clock");

//Weather Search
function SearchWeather() {
    let searchInput = document.getElementById("SearchBar").value;
    if (searchInput != "") {
        fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${searchInput}&days=8&aqi=no&alerts=no`)
            .then(res => res.json())
            .then(data => {
                updateWeather(data);
                updateForecastWeather(data.forecast.forecastday);

                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayDate = formatDateForAPI(yesterday);

                fetch(`https://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${searchInput}&dt=${yesterdayDate}`)
                    .then(res => res.json())
                    .then(yesterdayDate =>{
                        updateYesterdayWeather(yesterdayDate);
                    })
            })
            .catch(error => console.error('Error fetching weather data:', error));
        document.getElementById("SearchBar").value = "";;
    }
}

function formatDateForAPI(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

//Yesterday Weather
function updateYesterdayWeather(data) {
    if (data && data.forecast && data.forecast.forecastday && data.forecast.forecastday[0]) {

        const yesterdayData = data.forecast.forecastday[0];

        document.getElementById("weather1Content1").innerText = "Yesterday";
        document.getElementById("weather1Content2").src = `https:${yesterdayData.day.condition.icon}`;
        document.getElementById("weather1Content3").innerText = getTwoWords(yesterdayData.day.condition.text);
        document.getElementById("weather1Content4").innerText = `${yesterdayData.day.avgtemp_c}℃`;
    }
}

//Update Weather
function updateWeather(data) {
    if (data && data.current && data.location) {
        temp.innerText = `${data.current.temp_c} ℃`;
        conditionTxt.innerText = getTwoWords(data.current.condition.text);
        rainTxt.innerText = `${data.current.humidity}%`;
        windTxt.innerText = data.current.wind_kph;
        locationTxt.innerText = `${data.location.name}, ${data.location.country}`;

        const formattedDate = formatDate(data.location.localtime);
        monthAndYear.innerText = formattedDate;

        const formattedTime = formatTime(data.location.localtime);
        clock.innerText = formattedTime;

        if (data.current.condition.icon) {
            conditionImg.src = `https:${data.current.condition.icon}`;
            conditionImg.alt = data.current.condition.text;
        }
    }
}

//Update Forecast Weather to Two words
function getTwoWords(text) {
    const words = text.split(' ');
    return words.slice(0, 2).join(' ');
}

//Update city or country date for my style
function formatDate(date) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const d = new Date(date);
    const month = months[d.getMonth()];
    const day = d.getDate();
    const year = d.getFullYear();
    return `${month}${day}, ${year}`;
}

//Update city or country date for my style
function formatTime(time) {
    const d = new Date(time);
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
}

function formatForecastDate(date){
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const d = new Date(date);
    const month = months[d.getMonth()];
    const day = d.getDate();
    return `${month} ${day}`;
}

//Update forecast weather
function updateForecastWeather(forecastData) {
    for (let i = 1; i < 8; i++) {
        const dayData = forecastData[i];
        if (dayData) {
            const dayTemp = `${dayData.day.avgtemp_c}℃`;
            const dayCondition = getTwoWords(dayData.day.condition.text);
            const dayConditionImg = `https:${dayData.day.condition.icon}`;
            const date = formatForecastDate(dayData.date);

            document.getElementById(`weather${i + 1}Content1`).innerText = date;
            document.getElementById(`weather${i + 1}Content2`).src = dayConditionImg;
            document.getElementById(`weather${i + 1}Content3`).innerText = dayCondition;
            document.getElementById(`weather${i + 1}Content4`).innerText = dayTemp;
        }
    }
}
searchBtn.addEventListener('click', SearchWeather);