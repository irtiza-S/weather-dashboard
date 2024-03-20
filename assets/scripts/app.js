// const apiKey = '2c21a0893903fb1661f16debd471f221'
// const longitude = ''
// const latitude = ''
// const url = `api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`

// async function fetchData(query) {

// }

$(document).ready(function() {
    // OpenWeatherMap API key
    const apiKey = '2c21a0893903fb1661f16debd471f221'; 

    // fetch weather data from api
    function fetchWeather(city) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        // Fetch current weather data
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                displayCurrentWeather(data);
            })
            .catch(error => console.error('Error fetching current weather:', error));

    }

    // Function to display current weather
    function displayCurrentWeather(data) {
        const { name, weather, main, wind } = data;
        const iconUrl = `http://openweathermap.org/img/w/${weather[0].icon}.png`;
        const currentDate = dayjs().format('YYYY-MM-DD');

        const currentWeatherHTML = `
            <h2>${name}</h2>
            <p>Date: ${currentDate}</p>
            <img src="${iconUrl}" alt="Weather Icon">
            <p>Temperature: ${main.temp}°C</p>
            <p>Humidity: ${main.humidity}%</p>
            <p>Wind Speed: ${wind.speed} m/s</p>
        `;

        $('#today').html(currentWeatherHTML);
    }

    
    // Event listener for form submission
    $('#search-form').submit(function(event) {
        event.preventDefault();
        const city = $('#search-input').val();
        fetchWeather(city);

    });

   
   
});
