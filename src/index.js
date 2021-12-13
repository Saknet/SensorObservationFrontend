require( './css/main.css' );
require( 'cesium/Widgets/widgets.css' );
require('bootstrap/dist/css/bootstrap.min.css')

const Cesium = require( 'cesium/Cesium' );
const featurePickerService = require( './services/featurepicker' );
const geocodingApi = require( './controllers/geocoding' );
const geocodingService = require( './services/geocoding' );
const searchButton = document.getElementById( "searchButton" );
const clearButton = document.getElementById( "clearButton" );
const citydistricts = geocodingService.helsinkidistricts;
const $ = require( 'jquery');
const moment = require( 'moment' );
const daterangepicker = require( 'daterangepicker' )

var searchField = document.getElementById( "searchInput" );
const utils = require( './utils/camera' );
var addressResult = document.getElementById( "searchresults" );
var searchresultscontainer = document.getElementById('searchresultscontainer');
var startTime = new Date( Date.now() - 28800000 );
var endTime = new Date( Date.now() );
var addressData = null;

var viewer;

function init() {

    $('#loadingicon').hide();
    addEventListeners()
    initViewer();
    activateTileset( 24.976, 60.1845, 'https://kartta.hel.fi/3d/datasource-data/e9cfc1bb-a015-4a73-b741-7535504c61bb/tileset.json' );  
 
}

function addEventListeners() {

    searchButton.addEventListener( "click", checkSearch );
    clearButton.addEventListener( "click", clearSearch );
    searchField.addEventListener( "keyup", filterSearchResults );
    addressResult.addEventListener( "click", moveCameraToLocation);

}

function initViewer() {
    
    Cesium.Ion.defaultAccessToken = null;
    viewer = new Cesium.Viewer("cesiumContainer", {
        animation: false,
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

    viewer.scene.primitives.add( new Cesium.Cesium3DTileset( {
        url: tileseturl,
        show: true,
        shadows: Cesium.ShadowMode.ENABLED,
        maximumScreenSpaceError: 4
    } ) )

    utils.initializeViewPort( Cesium, viewer, longitude, latitude );


//    utils.constructTrimBox( tileset, 10000, 18000, 6000, 10000, 1000, 1000, true, 5, Cesium );
    featurePickerService.active3DTilePicker( viewer );
}

window.onload = function() {

    init();
    clearSearch()
    addCityDistricts();

    $(function() {
        $('input[name="datetimes"]').daterangepicker({

            timePicker: true,
            startDate: moment().subtract(8, 'hours'),
            endDate: moment(),
            minDate: moment().subtract(90, 'days'),
            maxDate: moment(),
            locale: {
                format: 'DD.M.Y HH:mm'
            }

        });

        $('input[name="datetimes"]').on('apply.daterangepicker', function(ev, picker) {

            let startTime = picker.startDate._d;
            let endTime = picker.endDate._d; 

            if ( startTime.getTime() - endTime.getTime() < 604801000 ) {

                featurePickerService.updateTimesForObservations( startTime, endTime );

            } else {

                alert( 'selected time period is too large');

            }
                        
        });

      });

    let tilesetselect = document.getElementById( 'tileset-list' );
    let districtselect = document.getElementById( 'district-select' );
    

    districtselect.onchange = function() {

        for ( let i = 0; i < citydistricts.length; i++ ) {

            if ( citydistricts[ i ].name == districtselect.value ) {
    
                utils.moveCameraTo( Cesium, viewer, citydistricts[ i ].longitude, citydistricts[ i ].latitude );
                break;
    
            }
        }
    }

    /* Handles change of tilesets  */
    tilesetselect.onchange = function() {

        var tileseturl = 'https://geo.fvh.fi/tilesets/simpletest/tileset.json';

        if ( tilesetselect.value == 'helsinki' ) {
            tileseturl = 'https://kartta.hel.fi/3d/datasource-data/e9cfc1bb-a015-4a73-b741-7535504c61bb/tileset.json';
        }

        activateTileset( 24.983, 60.1845, tileseturl );
      
    } 
}

/* Loads city district names to select */
function addCityDistricts() {

    let select = document.getElementById( "district-select" );

    for ( let i = 0; i < citydistricts.length; i++ ) {

        let citydistrict = citydistricts[ i ][ 'name' ];
        let el = document.createElement( "option" );
        el.textContent = citydistrict;
        el.value = citydistrict;
        select.appendChild( el );

        if ( citydistrict == 'Sörnäinen' ) {

            select.options.selectedIndex = i;  

        }
    }

}

/* Function that check if there is only one value in searchresults and moves camera to the location */
function checkSearch() {

    if ( addressData.length == 1 ) {

        utils.moveCameraTo( Cesium, viewer, addressData[ 0 ].longitude, addressData[ 0 ].latitude );
        document.getElementById( "searchresults" ).innerHTML = '';
            
    }
}

/* Function that check if there is only one value in searchresults */
function clearSearch() {
    
    searchresultscontainer.style.display = 'none';
    document.getElementById( "searchInput" ).value = '';
    addressData = null;

}

/* Function that filters search results */
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

/* Renders autocomplete search result */
function renderSearchResult( addresses ) {

    let liElemet = "" ;

    for ( let i= 0; i < addresses.length; i++ ) {
        
        liElemet += `<dt>${ addresses[ i ] }</dt>`

    }
    searchresultscontainer.style.display = 'block';
    document.getElementById( "searchresults" ).innerHTML = liElemet;

 }

 /* Finds coordinates for street address / search term and moves camera to the found coordinates */
 function moveCameraToLocation( e ) {

    let lat;
    let long;

    e = e || window.event;
    let target = e.target || e.srcElement;
    let text = target.textContent || target.innerText;   

    for ( let i = 0; i < addressData.length; i++ ) {

        if ( addressData[ i ].address == text ) {

            lat = addressData[ i ].latitude;
            long = addressData[ i ].longitude;
            break;

        }
    } 

    utils.moveCameraTo( Cesium, viewer, long, lat );
    document.getElementById( "searchresults" ).innerHTML = '';
    document.getElementById( "searchInput" ).value = text;
 }