const Cesium = require( 'cesium/Cesium' );
const observationsController = require( '../controllers/observations' );
const featureInformationService = require( '../services/featureinformation' );
const Plotly = require( 'plotly.js/dist/plotly' )

var Pickers_3DTile_Activated = true;
var startTime = new Date( Date.now() - 14400000 );
var endTime = new Date( Date.now() );
var feature = null;

/* Function that updates times needed for retrieving observations data */
export function updateTimesForObservations( viewer, start, end ) {

    startTime = start;
    endTime = end;

    if ( feature != null ) {

        fetchObservationData( viewer, feature );
        
    }
}

/* Function that activates feature picker */
export function active3DTilePicker( viewer ) {

    feature = null;

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
            var picked3DtileFeature = viewer.scene.pick( movement.endPosition );
            if ( !Cesium.defined( picked3DtileFeature ) ) {
                // nameOverlay.style.display = 'none';
                return;
            }
            // A feature was picked, so show it's overlay content
            // nameOverlay.style.display = 'block';
            // nameOverlay.style.bottom = viewer.canvas.clientHeight - movement.endPosition.y + 'px';
            // nameOverlay.style.left = movement.endPosition.x + 'px';
            let name = picked3DtileFeature.getProperty( 'CODE' );
            if ( !Cesium.defined( name )) {
                name = picked3DtileFeature.getProperty( 'ID' );
            }
            // nameOverlay.textContent = name;
            // Highlight the feature if it's not already selected.
            if ( picked3DtileFeature !== selected.feature ) {

                highlighted.feature = picked3DtileFeature;
                Cesium.Color.clone( picked3DtileFeature.color, highlighted.originalColor );
                picked3DtileFeature.color = Cesium.Color.GREEN;
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE );

    // Color a feature on selection and show metadata in the InfoBox.
    viewer.screenSpaceEventHandler.setInputAction(function onLeftClick( movement ) {

        // Clear chart
        Plotly.purge( 'obsChart' );

        if ( Pickers_3DTile_Activated ) {
            // If a feature was previously selected, undo the highlight
            if ( Cesium.defined( selected.feature ) ) {
                selected.feature.color = selected.originalColor;
                selected.feature = undefined;
            }
            // Pick a new feature
            var picked3DtileFeature = viewer.scene.pick( movement.position );
            if ( !Cesium.defined( picked3DtileFeature ) ) {
                clickHandler( movement );
                return;
            }
            // Select the feature if it's not already selected
            if ( selected.feature === picked3DtileFeature ) {
                return;
            }
            selected.feature = picked3DtileFeature;
            // Save the selected feature's original color
            if (picked3DtileFeature === highlighted.feature) {

                Cesium.Color.clone( highlighted.originalColor, selected.originalColor );
                highlighted.feature = undefined;

            } else {

                Cesium.Color.clone( picked3DtileFeature.color, selected.originalColor );

            }

            feature = picked3DtileFeature;

            fetchObservationData( viewer, picked3DtileFeature );

        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    viewer.screenSpaceEventHandler.setInputAction(function onRightClick( ) {

        // Clear chart
        Plotly.purge( 'obsChart' );

    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK); 
    
}

function fetchObservationData( viewer, picked3DtileFeature ) {

    const gmlid = picked3DtileFeature.getProperty( 'id' );
    const RATU = picked3DtileFeature.getProperty( 'RATU' );
    const latitude = picked3DtileFeature.getProperty( 'latitude' );
    const longitude = picked3DtileFeature.getProperty( 'longitude' );

    observationsController.findObservations( 'http://localhost:3000/observationdata/observations/', startTime, endTime, gmlid, RATU, latitude, longitude ).then( 
        observationData => featureInformationService.generateFeatureInfoTable( viewer, picked3DtileFeature, observationData[ 'observations' ] ) 
    );
}