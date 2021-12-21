# SensorObservationFrontend
Frontend built with [cesiumjs](https://github.com/CesiumGS/cesium) and [webpack](https://github.com/webpack/webpack) for displaying Helsinki SmartCity dynamic sensor observation data. NodeJS backend that can be used with this UI is found here https://github.com/Saknet/SensorObservationBackend

# Deployment

Install node modules: 

```
npm install
```

Remember to set the url where the backend is running at featurepicker service. 
[pm2](https://github.com/Unitech/pm2) can be used for running the frontend process.

# Instructions
Main feature of the app is to dynamically display SmartCity Sensor Observation results to the user. User can click a feature (i.e. building) in the map and the application will display the timeserialized results of observations for each unit that has been measured in the feature. Only observations during selected time period are included. Default value for the time period is 8 hours previous to current time and maximum length is set to 1 week. The performance of the application degrades larger the time period gets.

The application also includes geocoding service which is implemented with [digitransit autocomplete API](https://digitransit.fi/en/developers/apis/2-geocoding-api/autocomplete/). Type desired address or name to search field and after 3 digits have been given the search results are displayed and user is able to click any of the found locations. Clicking on the results will cause camera to move to selected location.

Don't know where you want to go? The application has a feature that moves camera to the center of any of the 60 official neighbourhoods found in the city of Helsinki!