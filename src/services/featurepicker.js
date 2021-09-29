const Cesium = require( 'cesium/Cesium' );
const observationsController = require( '../controllers/observations' );
const featureInformationService = require( '../services/featureinformation' );
const chartsService = require( '../services/charts' );

var Pickers_3DTile_Activated = true;
var startTime = new Date( Date.now() - 28800000 );
var endTime = new Date( Date.now() );
var feature = null;

/* Function that updates times needed for retrieving observations data */
export function updateTimesForObservations( start, end ) {

    startTime = start;
    endTime = end;

    if ( feature != null ) {

        fetchObservationData();

    }
}

/* Function that activates feature picker */
export function active3DTilePicker( viewer ) {

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
    viewer.screenSpaceEventHandler.setInputAction( function onMouseMove( movement ) {

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
    viewer.screenSpaceEventHandler.setInputAction( function onLeftClick( movement ) {


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
            if (feature === highlighted.feature) {

                Cesium.Color.clone( highlighted.originalColor, selected.originalColor );
                highlighted.feature = undefined;

            } else {

                Cesium.Color.clone( feature.color, selected.originalColor );

            }

            fetchObservationData( viewer );

        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK );

    viewer.screenSpaceEventHandler.setInputAction( function onRightClick() {

        // Clear charts
        removeCharts();

    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK); 
    
}

function fetchObservationData() {

    const attributes = feature.getProperty( 'attributes' )
    const gmlid = feature.getProperty( 'id' );
    const latitude = attributes[ 'latitude' ];
    const longitude = attributes[ 'longitude' ];
    let RATU =  attributes[ 'Rakennustunnus_(RATU)' ];

    if ( RATU == null ) {

        RATU = attributes[ 'ratu' ];

    }

    console.log( "attributes", attributes );

    observationsController.findObservations( 'http://localhost:3000/observationdata/observations/', startTime, endTime, gmlid, RATU, latitude, longitude ).then( 
        observationData => featureInformationService.generateFeatureInfoTable( feature, observationData[ 'observations' ] ) ).catch( 
            ( e ) => {

                console.log( 'something went wrong', e );
                const filteredData = featureInformationService.filterFeatureData( feature );
                chartsService.generateFeatureDataTable( filteredData );
            } 
        );
}

/* Function that resets feature and calls chartservice to purge all charts*/
function removeCharts() {

    chartsService.purgeAllCharts();
    feature = null;

}