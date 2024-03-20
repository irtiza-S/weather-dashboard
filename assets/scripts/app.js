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
        
        // Fetch 5-day forecast data
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
        fetch(forecastUrl)
            .then(response => response.json())
            .then(data => {
                displayForecast(data);
            })
            .catch(error => console.error('Error fetching forecast:', error));
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

    // Function to display 5-day forecast
    function displayForecast(data) {
        const forecastList = data.list.slice(0, 5); // Get only the first 5 forecasts
        let forecastHTML = '<h2>5-Day Forecast</h2>';

        forecastList.forEach(forecast => {
            const { dt_txt, weather, main } = forecast;
            const iconUrl = `http://openweathermap.org/img/w/${weather[0].icon}.png`;

            forecastHTML += `
                <div class="col">
                    <p>Date: ${dt_txt}</p>
                    <img src="${iconUrl}" alt="Weather Icon">
                    <p>Temperature: ${main.temp}°C</p>
                    <p>Humidity: ${main.humidity}%</p>
                </div>
            `;
        });

        $('#forecast').html(forecastHTML);
    }
    

    // Function to add searched city to history
    function addToHistory(city) {
        let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || []
        searchHistory.push(city)
        searchHistory = Array.from(new Set(searchHistory)) //remove duplicates
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory)) //store updated data

        $('#history').append(`<a href="#" class="list-group-item list-group-item-action">${city}</a>`);
    }

    function updateHistoryDisplayed(history) {
        const historyContainer = $('#history')
        historyContainer.empty() //clear existing div

        // render updated search results in history pane
        history.forEach(city => {
            historyContainer.append(`<a href="#" class="list-group-item list-group-item-action">${city}</a>`)
        })
    }

    //retrieve and render search history when page loads
    function initHistoryLoad() {
        const initHistory = JSON.parse(localStorage.getItem('searchHistory')) || []
        updateHistoryDisplayed(initHistory)
    }

    // Event listener for form submission
    $('#search-form').submit(function(event) {
        event.preventDefault()
        const city = $('#search-input').val()
        fetchWeather(city)
        addToHistory(city)
    });

    // Event listener for click on search history
    $('#history').on('click', 'a', function(event) {
        event.preventDefault();
        const city = $(this).text();
        fetchWeather(city);
    });

    initHistoryLoad()

});
