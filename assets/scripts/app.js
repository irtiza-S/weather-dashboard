$(document).ready(function() {
    // OpenWeatherMap API key
    const apiKey = '2c21a0893903fb1661f16debd471f221'; 

    // fetch weather data from api
    function fetchWeather(city) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        // Fetch current weather data
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('City not found');
                }
                return response.json();
            })
            .then(data => {
                displayCurrentWeather(data);
                addToHistory(city); // Add to history only if city is found
            })
            .catch(error => {
                console.error('Error fetching current weather:', error);
                alert('City not found. Please enter a valid city name.');
            });
        
        // Fetch 5-day forecast data
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
        fetch(forecastUrl)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                displayForecast(data);
            })
            .catch(error => {
                console.error('Error fetching forecast:', error);
                alert('Failed to fetch forecast data. Please try again later.');
            });
    }

    // Function to display current weather
    function displayCurrentWeather(data) {
        const { name, weather, main, wind } = data;
        const iconUrl = `http://openweathermap.org/img/w/${weather[0].icon}.png`;
        const currentDate = dayjs().format('YYYY/MM/DD');

        const currentWeatherHTML = `
            <h2>${name} (${currentDate})<img src="${iconUrl}" alt="Weather Icon"></h2>
            <p>Temp: ${main.temp}°C</p>
            <p>Wind: ${wind.speed}KPH</p>
            <p>Humidity: ${main.humidity}%</p>
        `;

        $('#today').html(currentWeatherHTML);
    }

    // // Function to display 5-day forecast
    // function displayForecast(data) {
    //     const forecastList = data.list.slice(0, 5); // Get only the first 5 forecasts
    //     let forecastHTML = '<h2>5-Day Forecast</h2>';

    //     forecastList.forEach(forecast => {
    //         const { dt_txt, weather, main } = forecast;
    //         const iconUrl = `http://openweathermap.org/img/w/${weather[0].icon}.png`;

    //         forecastHTML += `
    //             <div class="col">
    //                 <p>Date: ${dt_txt}</p>
    //                 <img src="${iconUrl}" alt="Weather Icon">
    //                 <p>Temperature: ${main.temp}°C</p>
    //                 <p>Humidity: ${main.humidity}%</p>
    //             </div>
    //         `;
    //     });

    //     $('#forecast').html(forecastHTML);
    // }
    function displayForecast(data) {
        // Group forecast data by day
        const forecastByDay = {};
    
        data.list.forEach(forecast => {
            const date = forecast.dt_txt.split(' ')[0]; // Extract date without time
            if (!forecastByDay[date]) {
                forecastByDay[date] = [];
            }
            forecastByDay[date].push(forecast);
        });
    
        // Create forecast cards for each day
        let forecastHTML = '<h2>5-Day Forecast</h2>';
    
        Object.keys(forecastByDay).forEach(date => {
            const dailyForecasts = forecastByDay[date];
            const { dt_txt } = dailyForecasts[0]; // Use the first forecast for each day
            const iconUrl = `http://openweathermap.org/img/w/${dailyForecasts[0].weather[0].icon}.png`;
            const temperature = dailyForecasts[0].main.temp;
            const humidity = dailyForecasts[0].main.humidity;
            const windSpeed = dailyForecasts[0].wind.speed;
    
            forecastHTML += `
                <div class="col">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Date: ${dt_txt}</h5>
                            <img src="${iconUrl}" class="card-img-top" alt="Weather Icon">
                            <p class="card-text">Temperature: ${temperature}°C</p>
                            <p class="card-text">Humidity: ${humidity}%</p>
                            <p class="card-text">Wind Speed: ${windSpeed} m/s</p>
                        </div>
                    </div>
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

        updateHistoryDisplayed(searchHistory);
    }

    // Function to update displayed search history
    function updateHistoryDisplayed(history) {
        const historyContainer = $('#history')
        historyContainer.empty() //clear existing div

        // render updated search results in history pane
        history.forEach(city => {
            historyContainer.append(`<a href="#" class="list-group-item list-group-item-action">${city}</a>`)
        })
    }

     // Retrieve and render search history when page loads
     function initHistoryLoad() {
        const initHistory = JSON.parse(localStorage.getItem('searchHistory')) || []
        updateHistoryDisplayed(initHistory)
    }

    // Event listener for form submission
    $('#search-form').submit(function(event) {
        event.preventDefault();
        const city = $('#search-input').val().trim();

        if (city === '') {
            alert('Please enter a city name.');
            return;
        }

        fetchWeather(city);
    });

    // Event listener for click on search history
    $('#history').on('click', 'a', function(event) {
        event.preventDefault();
        const city = $(this).text();
        fetchWeather(city);
    });

    initHistoryLoad();

});
