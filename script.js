const yourWeather=document.querySelector('.yourweather-box');
const searchWeather=document.querySelector('.search-box');
const loading=document.querySelector('.loading-box');
const grantLocationAccess=document.querySelector('.grantlocationaccess-box');
const yourWeatherTab=document.querySelector('.your-weather');
const searchWeatherTab=document.querySelector('.search-weather');
let weatherTypeImg=document.querySelector('.weathertypeimg');
let cityName=document.querySelector('.cityname');
let weatherType=document.querySelector('.weather-type');
let temperature=document.querySelector('.temp');
let windSpeed=document.querySelector('.windspeed-value');
let humidity=document.querySelector('.humidity-value');
let cloud=document.querySelector('.cloud-value');
const searchForm=document.querySelector('.searchform');
const searchField=document.querySelector('.search-field');
let errorBox=document.querySelector('.errorbox');
let errorType=document.querySelector('.errortype');
let latitude;
let longitude;
const apiKey='3c4318061eb713e0f411c9e63d926881'
const apiUrl=`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
let currentTab=yourWeatherTab;

navigator.permissions.query({name:'geolocation'})
.then((result)=>{
    if(result.state==='granted'){
        loading.classList.add('active-box');
        
        getLocation();
    }
    else if(result.state==='prompt'){
        grantLocationAccess.classList.add('active-box');
        grantLocationAccess.addEventListener('click', function(){
            getLocation();
        })
    }
    else if(result.state==='denied'){
        grantLocationAccess.classList.add('active-box');
        grantLocationAccess.addEventListener('click', function(){
            getLocation();
        })
        errorBox.classList.add('active-box');
        errorType.innerText='Permission denied for location access.';
    }
})
// console.log(errorBox);
// loading.classList.add('active-box');
// getLocation();
// yourWeather.classList.add('active-box');
currentTab.classList.add('active-tab');
yourWeatherTab.addEventListener('click', function(e){
    // loading.classList.add('active-box');
    switchTab(yourWeatherTab);
});
searchWeatherTab.addEventListener('click', function(){
    switchTab(searchWeatherTab);
});
searchForm.addEventListener('submit', function(e){
    e.preventDefault();
    yourWeather.classList.remove('active-box');
    errorBox.classList.remove('active-box');
    loading.classList.add('active-box');
    let searchFieldValue=searchField.value;
    cityApiCall(searchFieldValue);
})
function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        clickedTab.classList.add('active-tab');
        currentTab.classList.remove('active-tab');
        currentTab=clickedTab;
        if(clickedTab==yourWeatherTab){
            navigator.permissions.query({name:'geolocation'})
            .then((result)=>{
            if(result.state==='granted'){
                getLocation();
    }
    else if(result.state==='prompt'){
        grantLocationAccess.classList.add('active-box');
        grantLocationAccess.addEventListener('click', function(){
            getLocation();
        })
    }
    else if(result.state==='denied'){
        grantLocationAccess.classList.add('active-box');
        
        errorBox.classList.add('active-box');
        errorType.innerText='Permission denied for location access.';
    }
})

            yourWeather.classList.remove('active-box');
            loading.classList.add('active-box');
            searchWeather.classList.remove('active-box');
            errorBox.classList.remove('active-box');
            // loading.classList.add('active-box');
            getLocation();
        }
        else{
            grantLocationAccess.classList.remove('active-box');
            searchWeather.classList.add('active-box');
            yourWeather.classList.remove('active-box');
            errorBox.classList.remove('active-box');
        }
    }
}
function getLocation(){
    if(navigator.geolocation){
        //grant permission dialog box timing
        
        navigator.geolocation.getCurrentPosition(savePosition, showError);
        // grantLocationAccess.classList.add('active-box');
    }
    else{
        grantLocationAccess.classList.remove('active-box');
        loading.classList.remove('active-box');
        errorBox.classList.add('active-box');
        errorType.innerText='Your browser does not support the Geolocation API.'
    }
};
function showError(){
    loading.classList.remove('active-box')
    errorBox.classList.add('active-box');
    errorType.innerText='Permission denied for location access.'
    
};
function savePosition(position){
    grantLocationAccess.classList.remove('active-box');
    loading.classList.add('active-box');
    localStorage.setItem('latitude', position.coords.latitude);
    localStorage.setItem('longitude', position.coords.longitude);
    
    showPosition();
};
function showPosition(){

    latitude=localStorage.getItem('latitude');
    longitude=localStorage.getItem('longitude');
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
    .then((response)=>{
        return response.json();
    })
    .then((data)=>{
        loading.classList.remove('active-box');
        yourWeather.classList.add('active-box');
        errorBox.classList.remove('active-box');
        cityName.innerText=`${(data.name).charAt(0).toUpperCase()+(data.name).slice(1)}`;
        weatherType.innerText=`${(data.weather[0].description).charAt(0).toUpperCase()+(data.weather[0].description).slice(1)}`;
        temperature.innerText=`${(data.main.temp-273.15).toFixed(2)} °C`;
        windSpeed.innerText=`${data.wind.speed}m/s`;
        humidity.innerText=`${data.main.humidity}%`;
        cloud.innerText=`${data.clouds.all}%`;
    })
    .catch((error)=>{
        loading.classList.remove('active-box');
        errorBox.classList.add('active-box');
        errorType.innerText='Can not fetch weather details right now.';
    })

}
function cityApiCall(cityname){
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${apiKey}`)
    .then((response)=>{
        return response.json();
    })
    .then((data)=>{
        loading.classList.remove('active-box');
        errorBox.classList.remove('active-box');
        cityName.innerText=`${(data.name).charAt(0).toUpperCase()+(data.name).slice(1)}`;
        weatherType.innerText=`${(data.weather[0].description).charAt(0).toUpperCase()+(data.weather[0].description).slice(1)}`;
        temperature.innerText=`${(data.main.temp-273.15).toFixed(2)} °C`;
        windSpeed.innerText=`${data.wind.speed}m/s`;
        humidity.innerText=`${data.main.humidity}%`;
        cloud.innerText=`${data.clouds.all}%`;
        loading.classList.remove('active-box');
        let weatherCode=(data.weather[0]).id;
        if(weatherCode==800){
            weatherTypeImg.src='weathertype/sunny.svg'
        }
        else if(weatherCode==801 || weatherCode==802){
            weatherTypeImg.src='weathertype/few-cloud.svg'
        }
        else if(weatherCode==803 || weatherCode==804){
            weatherTypeImg.src='weathertype/overcast.svg'
        }
        else if(weatherCode==500){
            weatherTypeImg.src='weathertype/rain.svg'
        }
        else if(weatherCode==200){
            weatherTypeImg.src='weathertype/thunder.svg'
        }
        else if(weatherCode==600){
            weatherTypeImg.src='weathertype/snow.svg'
        }
        else if(weatherCode==701){
            weatherTypeImg.src='weathertype/mist.svg'
        }
        else if(weatherCode==721){
            weatherTypeImg.src='weathertype/haze.svg'
        }
        else if(weatherCode==741){
            weatherTypeImg.src='weathertype/fog.svg'
        }
        else{
            weatherTypeImg.src='Images/haze.png'
        }
        yourWeather.classList.add('active-box');
    }).catch((error)=>{
        // console.log('Entering catch block');
        loading.classList.remove('active-box');
        yourWeather.classList.remove('active-box');
        errorBox.classList.add('active-box');
        errorType.innerText='Make sure the city name is correct.';
    })
}

