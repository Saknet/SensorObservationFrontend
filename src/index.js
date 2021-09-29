require( './css/main.css' );
require( 'cesium/Widgets/widgets.css' );

const Cesium = require('cesium/Cesium');
const featurePickerService = require( './services/featurepicker' );
const confirmTimesButton = document.getElementById( "confirm-times" );
var startDate = new Date( Date.now() - 28800000 );
var endDate = new Date( Date.now() );
var hours = 8;

confirmTimesButton.addEventListener("click", confirmTimes);

Cesium.Ion.defaultAccessToken = null;

var viewer = new Cesium.Viewer("cesiumContainer", {
	animation: true,
    fullscreenButton: false,
    geocoder: false,
    shadows: true,
    navigationHelpButton: false,
    timeline: true,
    sceneModePicker: false,
    baseLayerPicker: false,
    homeButton: false,
	imageryProvider: new Cesium.WebMapServiceImageryProvider({
    	url : 'https://kartta.hel.fi/ws/geoserver/avoindata/ows?SERVICE=WMS&',
    	layers : 'avoindata:Opaskartta_Helsinki_harmaa',
    	proxy: new Cesium.DefaultProxy('/proxy/')
	}),
	terrainProvider : new Cesium.EllipsoidTerrainProvider()
});

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
        
        endDate = newEndDate;
        startDate = new Date( newEndDate - 3600000 * hours );

    } else {
    
        startDate = new Date( Date.now() - 3600000 * hours  );
        endDate = new Date( Date.now() );
        alert( "Selected time can't be in the future" );

    } 

    featurePickerService.updateTimesForObservations( startDate, endDate );

}