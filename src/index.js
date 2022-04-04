require( './css/main.css' );
require( 'cesium/Widgets/widgets.css' );
require( 'bootstrap/dist/css/bootstrap.min.css' );

const Cesium = require( 'cesium/Cesium' );
const featurePickerService = require( './services/featurepicker' );
const geocodingApi = require( './controllers/geocoding' );
const geocodingService = require( './services/geocoding' );
const districtService = require( './services/district' );
const searchButton = document.getElementById( 'searchButton' );
const clearButton = document.getElementById( 'clearButton' );
const $ = require( 'jquery' );
const moment = require( 'moment' );
const daterangepicker = require( 'daterangepicker' );

var searchField = document.getElementById( 'searchInput' );
const utils = require( './utils/camera' );
var addressResult = document.getElementById( 'searchresults' );
var searchresultscontainer = document.getElementById( 'searchresultscontainer' );
var addressData = null;

var viewer;

/**
 * Calls functions used for initialization
 */
function init () {

    $( '#loadingicon' ).hide();
    addEventListeners();
    initViewer();
    activateTileset( 24.976, 60.1845, 'https://kartta.hel.fi/3d/datasource-data/e9cfc1bb-a015-4a73-b741-7535504c61bb/tileset.json' );

}

/**
 * Adds event listeners for user interactions
 */
function addEventListeners () {

    searchButton.addEventListener( 'click', checkSearch );
    clearButton.addEventListener( 'click', clearSearch );
    searchField.addEventListener( 'keyup', filterSearchResults );
    addressResult.addEventListener( 'click', moveCameraToLocation );

}

/**
 * Initializes Cesium viewer
 */
function initViewer () {

    Cesium.Ion.defaultAccessToken = null;
    viewer = new Cesium.Viewer( 'cesiumContainer', {
        animation: false,
        fullscreenButton: false,
        geocoder: false,
        shadows: true,
        navigationHelpButton: false,
        timeline: false,
        sceneModePicker: false,
        baseLayerPicker: false,
        homeButton: false,
        imageryProvider: new Cesium.WebMapServiceImageryProvider( {
            url : 'https://kartta.hel.fi/ws/geoserver/avoindata/ows?SERVICE=WMS&',
            layers : 'avoindata:Opaskartta_Helsinki_harmaa',
            proxy: new Cesium.DefaultProxy( '/proxy/' )
        } ),
        terrainProvider : new Cesium.EllipsoidTerrainProvider()
    } );

}

/**
 * Loads tileset to viewer, calls functions that initialize camera and enable picking features
 *
 * @param { number } longitude GPS coordinates
 * @param { number } latitude GPS coordinates
 * @param { string } tileseturl url of tileset
 */
function activateTileset ( longitude, latitude, tileseturl ) {

    viewer.scene.primitives.add( new Cesium.Cesium3DTileset( {
        url: tileseturl,
        show: true,
        shadows: Cesium.ShadowMode.ENABLED,
        maximumScreenSpaceError: 4
    } ) );

    utils.initializeViewPort( Cesium, viewer, longitude, latitude );


    //    utils.constructTrimBox( tileset, 10000, 18000, 6000, 10000, 1000, 1000, true, 5, Cesium );
    featurePickerService.active3DTilePicker( viewer );
}

window.onload = function () {

    init();
    clearSearch();
    districtService.initializeDistricts( Cesium, viewer );

    /* jquery based daterangepicker function handling changing dates in UI */
    $( function () {
        $( 'input[name="datetimes"]' ).daterangepicker( {

            timePicker: true,
            startDate: moment().subtract( 8, 'hours' ),
            endDate: moment(),
            minDate: moment().subtract( 90, 'days' ),
            maxDate: moment(),
            locale: {
                format: 'DD.M.Y HH:mm'
            }

        } );

        $( 'input[name="datetimes"]' ).on( 'apply.daterangepicker', function ( ev, picker ) {

            let startTime = picker.startDate._d;
            let endTime = picker.endDate._d;

            if ( endTime.getTime() - startTime.getTime() < 604801000 ) {

                featurePickerService.updateTimesForObservations( startTime, endTime );

            } else {

                alert( 'selected time period is too large' );

            }

        } );

    } );
    
};

/**
 * Checks if there is only one value in searchresults and moves camera to the location
 */
function checkSearch () {

    if ( addressData.length === 1 ) {

        utils.moveCameraTo( Cesium, viewer, addressData[ 0 ].longitude, addressData[ 0 ].latitude );
        document.getElementById( 'searchresults' ).innerHTML = '';

    }
}

/**
 * Clears search result container in UI
 */
function clearSearch () {

    searchresultscontainer.style.display = 'none';
    document.getElementById( 'searchInput' ).value = '';
    addressData = null;

}

/**
 * Function that filters search results
 */
async function filterSearchResults () {

    searchresultscontainer.style.display = 'none';

    if ( searchField.value.length > 2 ) {

        let data = await geocodingApi.digitransitAutocompleteApi( searchField.value );

        if ( data ) {

            addressData = geocodingService.processAddressData( data[ 'features' ] );
            let streetAddresses = addressData.map( d => d.address );
            renderSearchResult( streetAddresses );

        }

    }

}

/**
 * Renders autocomplete search result
 *
 * @param { Array<String> } addresses shown to user
 */
function renderSearchResult ( addresses ) {

    let liElemet = '' ;

    for ( let i = 0; i < addresses.length; i++ ) {

        liElemet += `<dt>${ addresses[ i ] }</dt>`;

    }
    searchresultscontainer.style.display = 'block';
    document.getElementById( 'searchresults' ).innerHTML = liElemet;

}

/**
  * Finds coordinates for street address / search term and moves camera to the found coordinates
  *
  * @param { object } e event object from UI
  */
function moveCameraToLocation ( e ) {

    let lat;
    let long;

    e = e || window.event;
    let target = e.target || e.srcElement;
    let text = target.textContent || target.innerText;

    for ( let i = 0; i < addressData.length; i++ ) {

        if ( addressData[ i ].address === text ) {

            lat = addressData[ i ].latitude;
            long = addressData[ i ].longitude;
            break;

        }
    }

    utils.moveCameraTo( Cesium, viewer, long, lat );
    document.getElementById( 'searchresults' ).innerHTML = '';
    document.getElementById( 'searchInput' ).value = text;
}