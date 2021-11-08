require( './css/main.css' );
require( 'cesium/Widgets/widgets.css' );

const Cesium = require( 'cesium/Cesium' );
const featurePickerService = require( './services/featurepicker' );
const geocodingApi = require( './controllers/geocoding' );
const geocodingService = require( './services/geocoding' );
const confirmTimesButton = document.getElementById( "confirm-times" );
const searchField = document.getElementById( "addressSearch" );
const utils = require( './utils/tilesets' );
var addressResult = document.getElementById( "address-result" );
var startDate = new Date( Date.now() - 28800000 );
var endDate = new Date( Date.now() );
var hours = 8;
var addressData = null;

var viewer;

init();

function init( longitude, latitude ) {

    addEventListeners()
    initViewer();

    if ( longitude && latitude ) {
        
        activateTileset( longitude, latitude, 'https://kartta.hel.fi/3d/datasource-data/e9cfc1bb-a015-4a73-b741-7535504c61bb/tileset.json' );  

    } else {

        activateTileset( 24.983, 60.178, 'https://kartta.hel.fi/3d/datasource-data/e9cfc1bb-a015-4a73-b741-7535504c61bb/tileset.json' );  

    }
}

function addEventListeners() {

    confirmTimesButton.addEventListener( "click", confirmTimes );
    searchField.addEventListener( "keyup", filterSearchResults );
    addressResult.addEventListener( "click", moveCameraToAddress );

}

function initViewer() {
    
 //   Cesium.Ion.defaultAccessToken = null;
    viewer = null;

    console.log("viewer", viewer);

    viewer = new Cesium.Viewer("cesiumContainer", {
        animation: true,
        fullscreenButton: false,
        geocoder: false,
        shadows: true,
        navigationHelpButton: false,
        timeline: false,
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

}

function activateTileset( longitude, latitude, tileseturl ) {

    console.log("ll", longitude, latitude  );

    viewer.scene = null;

    viewer.scene.primitives.add( new Cesium.Cesium3DTileset( {
        url: tileseturl,
        show: true,
        shadows: Cesium.ShadowMode.ENABLED,
        maximumScreenSpaceError: 4
    } ) )

    utils.initializeViewPort( Cesium, viewer, longitude, latitude );


//    utils.constructTrimBox( tileset, 10000, 18000, 6000, 10000, 1000, 1000, true, 5, Cesium );
    featurePickerService.active3DTilePicker( viewer, startDate, endDate );
}

/* Handles change of hours  */
window.onload = function() {

    let hoursselect = document.getElementById('hours-list');
    let tilesetselect = document.getElementById('tileset-list');

    hoursselect.onchange = function() {

        hours = hoursselect.value;
      
    } 

    tilesetselect.onchange = function() {

        var tileseturl = 'https://geo.fvh.fi/tilesets/simpletest/tileset.json';

        if ( tilesetselect.value == 'helsinki' ) {
            tileseturl = 'https://kartta.hel.fi/3d/datasource-data/e9cfc1bb-a015-4a73-b741-7535504c61bb/tileset.json';
        }

        activateTileset( 24.983, 60.178, tileseturl );
      
    } 
}

/* Function that confirms time selection and restarts feature picker service */
function confirmTimes() {

    let clockGD = Cesium.JulianDate.toGregorianDate( viewer.clock.currentTime );
    let newEndDate = new Date( clockGD.year, clockGD.month - 1, clockGD.day, clockGD.hour + 3, clockGD.minute, clockGD.second, clockGD.millisecond );

    if ( new Date( Date.now() ) >= new Date( newEndDate ).getTime() ) {
        
        endDate = newEndDate;
        startDate = new Date( newEndDate - 3600000 * hours );

    } else {
    
        startDate = new Date( Date.now() - 3600000 * hours );
        endDate = new Date( Date.now() );
        alert( "Selected time can't be in the future" );

    } 

    featurePickerService.updateTimesForObservations( startDate, endDate );

}

/* Function that filters search results */
async function filterSearchResults () {

    if ( searchField.value.length > 2 ) {

        let data = await geocodingApi.digitransitAutocompleteApi( searchField.value );
        if ( data ) {
    
            addressData = geocodingService.processAddressData( data['features'] );

            var streetAddresses = addressData.map( d => d.address );

            renderStreetAddress( streetAddresses );
    
        }

    }

}

function renderStreetAddress( addresses ) {

    let liElemet = "" ;

    for ( let i= 0; i < addresses.length; i++ ) {
        
        liElemet += `<dt>${ addresses[ i ] }</dt>`

    }

    document.getElementById( "address-result" ).innerHTML = liElemet;

 }

 function moveCameraToAddress( e ) {

    let lat;
    let long;

    e = e || window.event;
    let target = e.target || e.srcElement;
    let text = target.textContent || target.innerText;   

    for ( let i = 0; i < addressData.length; i++ ) {

        if ( addressData[ i ].address == text ) {

            lat = addressData[ i ].latitude;
            long = addressData[ i ].longitude;

        }
    } 

    const center = Cesium.Cartesian3.fromDegrees( long, lat );
    viewer.camera.lookAt( center, new Cesium.Cartesian3( 0, 0, 500 ) );
    document.getElementById( "address-result" ).innerHTML = '';

 }