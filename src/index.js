require( './css/main.css' );
require( 'cesium/Widgets/widgets.css' );
require( 'bootstrap/dist/css/bootstrap.min.css' );

const Cesium = require( 'cesium/Cesium' );
const featurePickerService = require( './services/featurepicker' );
const geocodingService = require( './services/geocoding' );
const districtService = require( './services/district' );
const $ = require( 'jquery' );
const moment = require( 'moment' );
const daterangepicker = require( 'daterangepicker' );
const utils = require( './utils/camera' );

let viewer;

/**
 * Calls functions used for initialization
 */
function init () {

    $( '#loadingicon' ).hide();
    initViewer();
    geocodingService.initializeGeocoding( viewer );
    activateTileset( 24.976, 60.1845, 'https://kartta.hel.fi/3d/datasource-data/e9cfc1bb-a015-4a73-b741-7535504c61bb/tileset.json' );

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

    utils.initializeViewPort( viewer, longitude, latitude );


    //    utils.constructTrimBox( tileset, 10000, 18000, 6000, 10000, 1000, 1000, true, 5, Cesium );
    featurePickerService.active3DTilePicker( viewer );
}

window.onload = function () {

    init();
    clearSearch();
    districtService.initializeDistricts( viewer );

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
