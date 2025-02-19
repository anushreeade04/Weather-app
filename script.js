const apiKey = "8055fe8315f5afcdab3c59a78e32756a";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

const iconClassMap = {
    "Clear": "wi-day-sunny",
    "Clouds": "wi-cloudy",
    "Rain": "wi-rain",
    "Drizzle": "wi-sprinkle",
    "Thunderstorm": "wi-thunderstorm",
    "Snow": "wi-snow",
    "Mist": "wi-fog",
    "Haze": "wi-day-haze",
    "Smoke": "wi-smoke",
    "Dust": "wi-dust",
    "Fog": "wi-fog",
    "Sand": "wi-sandstorm",
    "Ash": "wi-volcano",
    "Squall": "wi-strong-wind",
    "Tornado": "wi-tornado"
};



function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    return `${hours % 12 || 12}:${minutes} ${ampm}`;
}


async function checkWeather(city) {
    if (!city) return;

    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    if (response.status == 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    } else {
        const data = await response.json();
        console.log(data);

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".weather-condition").innerHTML = data.weather[0].description;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
        document.querySelector(".time").innerText = "Last Updated: " + new Date().toLocaleTimeString();

        document.querySelector(".sunrise-time").innerText = formatTime(data.sys.sunrise);
        document.querySelector(".sunset-time").innerText = formatTime(data.sys.sunset);



        const weatherMain = data.weather[0].main;

        weatherIcon.className = `weather-icon wi ${iconClassMap[weatherMain] || "wi-na"}`;

        updateBackground(weatherMain);

        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";
    }
}

function updateBackground(weather) {
    const body = document.body;
    if (weather.includes("Clear")) {
        body.style.background = "linear-gradient(135deg, #f9d423, #ff4e50)";
    } else if (weather.includes("Clouds")) {
        body.style.background = "linear-gradient(135deg, #bdc3c7, #2c3e50)";
    } else if (weather.includes("Rain")) {
        body.style.background = "linear-gradient(135deg, #00c6ff, #0072ff)";
    } else {
        body.style.background = "linear-gradient(135deg, #00feba, #54548a)";
    }
}


function getLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
            const data = await response.json();
            checkWeather(data.name);
        });
    } else {
        alert("Geolocation not supported.");
    }
}
window.onload = getLocationWeather;

searchBtn.addEventListener("click", () => checkWeather(searchBox.value));
searchBox.addEventListener("keypress", (event) => {
    if (event.key === "Enter") checkWeather(searchBox.value);
});