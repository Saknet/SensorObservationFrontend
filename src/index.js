require( './css/main.css' );
require( 'cesium/Widgets/widgets.css' );
require( 'bootstrap/dist/css/bootstrap.min.css' );

const geocodingService = require( './services/geocoding' );
const cesiumviewerService = require( './services/cesiumviewer' );
const districtService = require( './services/district' );
const datepickerService = require( './services/datepicker' );

/**
 * Calls functions used for initialization
 */
function init () {

    let viewer = cesiumviewerService.initCesium();
    datepickerService.initializeDatepicker();
    districtService.initializeDistricts( viewer );
    geocodingService.initializeGeocoding( viewer );
}

window.onload = function () {

    init();
    
};
