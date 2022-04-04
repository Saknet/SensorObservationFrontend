const Cesium = require( 'cesium/Cesium' );
const observationsController = require( '../controllers/observation' );
const featureInformationService = require( '../services/featureinformation' );
const chartsService = require( './chart' );
const thingService = require( '../services/thing' );
const $ = require( 'jquery' );
const thingsSwitch = document.getElementById( 'thingsSwitchCheck' );

var Pickers_3DTile_Activated = true;
var startTime = new Date( Date.now() - 28800000 - 1800000 );
var endTime = new Date( Date.now() );
var feature = null;
var displayThings = false;

thingsSwitch.addEventListener( 'change', function() {

    if ( this.checked ) {

        displayThings = true;

        if ( feature && feature.latitude && feature.longitude ) {

            thingService.displayThingsWithinFeature( feature.longitude, feature.latitude );

        }

    } else {

        displayThings = false;
        chartsService.purgeThings();

    }

});

/**
 * Updates times needed for retrieving observations data when user changes dates with datepicker.
 * 30 minutes is always added to start date and also to end date if it is over 30 min before current date.
 * This is needed for correctness of timeseries as observations are serialized for every one hour. If user has
 * feature picked when they change dates, fetchObservationData is called.
 *
 * @param { date } start the start date
 * @param { date } end the end date
 */
function updateTimesForObservations ( start, end ) {

    startTime = new Date( start.getTime() - 1800000 );

    if ( end.getTime() + 1800000 < new Date( Date.now() ).getTime() ) {

        endTime = new Date( end.getTime() + 1800000 );

    } else {

        endTime = new Date( Date.now() );

    }

    if ( feature ) {

        fetchObservationData();

    }
}

/**
 * Activates feature picker TODO: this is too long, refactor it..
 *
 * @param { object } viewer Cesium viewer
 */
function active3DTilePicker ( viewer ) {

    let highlighted = {

        feature: undefined,
        originalColor: new Cesium.Color()

    };
    // Information about the currently selected feature
    let selected = {

        feature: undefined,
        originalColor: new Cesium.Color()

    };

    // Get default left click handler for when a feature is not picked on left click
    let clickHandler = viewer.screenSpaceEventHandler.getInputAction( Cesium.ScreenSpaceEventType.LEFT_CLICK );
    // Color a feature green on hover.
    viewer.screenSpaceEventHandler.setInputAction( function onMouseMove ( movement ) {

        if ( Pickers_3DTile_Activated ) {
            // If a feature was previously highlighted, undo the highlight
            if ( Cesium.defined( highlighted.feature ) ) {
                highlighted.feature.color = highlighted.originalColor;
                highlighted.feature = undefined;
            }
            // Pick a new feature
            feature = viewer.scene.pick( movement.endPosition );
            if ( !Cesium.defined( feature ) ) {
                // nameOverlay.style.display = 'none';
                return;
            }

            // Highlight the feature if it's not already selected.
            if ( feature !== selected.feature ) {

                highlighted.feature = feature;
                Cesium.Color.clone( feature.color, highlighted.originalColor );
                feature.color = Cesium.Color.GREEN;
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE );

    // Color a feature on selection and show metadata in the InfoBox.
    viewer.screenSpaceEventHandler.setInputAction( function onLeftClick ( movement ) {


        if ( Pickers_3DTile_Activated ) {

            // If a feature was previously selected, undo the highlight
            if ( Cesium.defined( selected.feature ) ) {
                selected.feature.color = selected.originalColor;
                selected.feature = undefined;
            }

            // Clear charts
            removeCharts();
            // Pick a new feature
            feature = viewer.scene.pick( movement.position );

            if ( !Cesium.defined( feature ) ) {
                clickHandler( movement );
                return;
            }

            // Select the feature if it's not already selected
            if ( selected.feature === feature ) {
                return;
            }

            selected.feature = feature;
            // Save the selected feature's original color
            if ( feature === highlighted.feature ) {

                Cesium.Color.clone( highlighted.originalColor, selected.originalColor );
                highlighted.feature = undefined;

            } else {

                Cesium.Color.clone( feature.color, selected.originalColor );

            }

            const llcoordinates = toDegrees( viewer.scene.pickPosition( movement.position ) );
            feature.latitude = llcoordinates[ 0 ];
            feature.longitude = llcoordinates[ 1 ];
            fetchObservationData( llcoordinates );

        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK );

    viewer.screenSpaceEventHandler.setInputAction( function onRightClick () {

        // Clear charts
        removeCharts();

    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK );

}

/**
 * Sends user selected time period and parameters found in feature to backend to feach observation data matching the search criteria
 * 
 * @param { Array<Number> } llcoordinates feature's gps coordinates
 */
async function fetchObservationData ( llcoordinates ) {

    let gmlid;
    let ratu;
    let latitude;
    let longitude;

    const attributes = feature.getProperty( 'attributes' );

    gmlid = feature.getProperty( 'id' );

    if ( attributes ) {

        gmlid = feature.getProperty( 'id' );
        latitude = llcoordinates[ 0 ];
        longitude = llcoordinates[ 1 ];
        ratu =  attributes[ 'Rakennustunnus_(RATU)' ];

        if ( !ratu ) {

            ratu = attributes[ 'ratu' ];

        }

    } else {

        gmlid = feature.getProperty( 'gmlid' );
        latitude = feature.getProperty( 'latitude' ) ;
        longitude = feature.getProperty( 'longitude' );
        ratu =  feature.getProperty( 'Rakennustunnus_(RATU)' );

        if ( !ratu ) {

            ratu = feature.getProperty( 'ratu' );

        }

    }

    if ( displayThings ) {

        thingService.displayThingsWithinFeature( longitude, latitude );

    }    

    const requestStarted = new Date( Date.now() );
    let savedFeature = feature;

    $( '#loadingicon' ).toggle();

    observationsController.findObservations( 'http://localhost:3000/observationdata/observations/', startTime, endTime, gmlid, ratu, latitude, longitude ).then(
        observationData => featureInformationService.generateTables( savedFeature, observationData[ 'observations' ], requestStarted ) ).catch(
        ( e ) => {

            console.log( 'something went wrong', e );
            console.log( 'timespent ', new Date( Date.now() ) - requestStarted, ' ms' );
            const filteredData = featureInformationService.filterFeatureData( feature );
            chartsService.generateFeatureDataTable( filteredData );

        }
    );
}

/**
 * Resets feature and calls chartservice to purge all charts
 */
function removeCharts () {

    chartsService.purgeAllCharts();
    feature = null;

}

/**
 * Coverts feature's cartesian position to gps coordinates
 * 
 * @param { Object } cartesian3Pos feature's cartesian3Pos
 */
 function toDegrees( cartesian3Pos ) {

    let pos = Cesium.Cartographic.fromCartesian( cartesian3Pos );
    return [ pos.latitude / Math.PI * 180, pos.longitude / Math.PI * 180 ];

  }

module.exports = {
    updateTimesForObservations,
    active3DTilePicker
};