require( './css/main.css' );
require( 'cesium/Widgets/widgets.css' );

const Cesium = require('cesium/Cesium');
const featurePickerService = require( './services/featurepicker' );
const confirmTimesButton = document.getElementById( "confirm-times" );
var startDate = new Date( Date.now() - 14400000 );
var endDate = new Date( Date.now() );
var hours = 4;

confirmTimesButton.addEventListener("click", confirmTimes);

var viewer = new Cesium.Viewer( 'cesiumContainer' );
var tileset = viewer.scene.primitives.add( new Cesium.Cesium3DTileset( {
    url: 'https://kartta.hel.fi/3d/datasource-data/e9cfc1bb-a015-4a73-b741-7535504c61bb/tileset.json',
    show: true,
    shadows: Cesium.ShadowMode.ENABLED,
    maximumScreenSpaceError: 4
} ) )

Cesium.when( tileset.readyPromise ).then( function ( tileset ) { viewer.flyTo( tileset ) } ).then( featurePickerService.active3DTilePicker( viewer, startDate, endDate ) );

/* Handles change of hours  */
window.onload = function() {

    let hoursselect = document.getElementById('hours-list');

    hoursselect.onchange = function() {

        hours = hoursselect.value;
      
    } 
}

/* Function that confirms time selection and restarts feature picker service */
function confirmTimes() {

    let clockGD = Cesium.JulianDate.toGregorianDate( viewer.clock.currentTime );
    let newEndDate = new Date( clockGD.year, clockGD.month - 1, clockGD.day, clockGD.hour + 3, clockGD.minute, clockGD.second, clockGD.millisecond );

    if ( new Date( endDate ).getTime() >= new Date( newEndDate ).getTime() ) {
        
        endDate = newEndDate.toISOString();
        startDate = new Date( newEndDate - 3600000 * hours ).toISOString();

    } else {
    
        startDate = new Date( Date.now() - 3600000 * hours  ).toISOString();
        endDate = new Date( Date.now() ).toISOString();
        alert("Selected time can't be in the future");

    } 

    Cesium.when( tileset.readyPromise ).then( function ( tileset ) { viewer.flyTo( tileset ) } ).then( featurePickerService.active3DTilePicker( viewer, startDate, endDate ) );

}