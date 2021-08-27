require( './css/main.css' );
require( 'cesium/Widgets/widgets.css' );

const Cesium = require('cesium/Cesium');
const featureInformation = require( './featureInformation' );
const datetimepicker = require( './services/datetimepicker' );
var startDate = new Date( Date.now() - 14400000 );
var endDate = new Date( Date.now() );

var viewer = new Cesium.Viewer( 'cesiumContainer' );
var tileset = viewer.scene.primitives.add( new Cesium.Cesium3DTileset( {
    url: 'https://kartta.hel.fi/3d/datasource-data/e9cfc1bb-a015-4a73-b741-7535504c61bb/tileset.json',
    show: true,
    shadows: Cesium.ShadowMode.ENABLED,
    maximumScreenSpaceError: 4
} ) )

Cesium.when( tileset.readyPromise ).then( function ( tileset ) { viewer.flyTo( tileset ) } ).then( featureInformation.active3DTilePicker( viewer, startDate, endDate ) );

window.onload=function() {
    let hoursselect = document.getElementById('hours-list');
    hoursselect.onchange = function() {
        let clockGD = Cesium.JulianDate.toGregorianDate( viewer.clock.currentTime );
        let hours = hoursselect.value;
        let newEndDate = new Date( clockGD.year, clockGD.month - 1, clockGD.day, clockGD.hour + 3, clockGD.minute, clockGD.second, clockGD.millisecond );
        
        if ( new Date( endDate ).getTime() >= new Date( newEndDate ).getTime() ) {
    
            console.log( "Yes" );
    
            endDate = newEndDate.toISOString();
            startDate = new Date( newEndDate - 3600000 * hours ).toISOString();
    
        } else {
        
            console.log( "No" );   
            startDate = new Date( Date.now() - 3600000 * hours  ).toISOString();
            endDate = new Date(Date.now()).toISOString();
    
        }

        console.log( "startDate", startDate );   
        console.log( "endDate", endDate );   
        
        Cesium.when( tileset.readyPromise ).then( function ( tileset ) { viewer.flyTo( tileset ) } ).then( featureInformation.active3DTilePicker( viewer, startDate, endDate ) );

    } 
}