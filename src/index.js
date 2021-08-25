require( './css/main.css' );
require( 'cesium/Widgets/widgets.css' );

const Cesium = require('cesium/Cesium');
const featureInformation = require( './featureInformation' );
const datetimepicker = require( './datetimepicker' );

var startDate = new Date( Date.now() - 14400000 ).toISOString();
var endDate = new Date(Date.now()).toISOString();

var viewer = new Cesium.Viewer('cesiumContainer');
var tileset = viewer.scene.primitives.add( new Cesium.Cesium3DTileset( {
    url: 'https://kartta.hel.fi/3d/datasource-data/e9cfc1bb-a015-4a73-b741-7535504c61bb/tileset.json',
    show: true,
    shadows: Cesium.ShadowMode.ENABLED,
    maximumScreenSpaceError: 4
} ) )


viewer.clock.onTick.addEventListener( function( clock ) {

    let clockGD = Cesium.JulianDate.toGregorianDate( clock.currentTime );
    let newEndDate = new Date( clockGD.year, clockGD.month, clockGD.day, clockGD.hour + 3, clockGD.minute, clockGD.second, clockGD.millisecond ).toISOString();

    if ( newEndDate < endDate ) {
        console.log( "HI" );
        endDate = newEndDate;
        startDate = new Date( newEndDate - 14400000 ).toISOString();
    }

    console.log( "endDate", clockGD );
    console.log( "endDate", newEndDate );
    console.log( "endDate", endDate );
    console.log( "endDate", startDate );

});

function selectStartDate( e ) {
    e.preventDefault();
    endDate = datetimepicker.selectStartDate();
}

function selectEndDate( e ) {
    e.preventDefault();
    endDate = datetimepicker.selectEndDate();
}

console.log( "startDate", startDate );
console.log( "endDate", endDate );

Cesium.when( tileset.readyPromise ).then( function ( tileset ) { viewer.flyTo( tileset ) } ).then( featureInformation.active3DTilePicker( viewer, startDate, endDate ) );