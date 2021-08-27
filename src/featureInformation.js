const Cesium = require( 'cesium/Cesium' );
const datetimepicker = require( './services/datetimepicker' );
//const observationsController = require( '../controller/observations' );

var Pickers_3DTile_Activated = true;

export function active3DTilePicker( viewer, startTime, endTime ) {

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

            console.log( "picked", picked3DtileFeature );
            const gmlid = picked3DtileFeature.getProperty( 'id' );
            const RATU = picked3DtileFeature.getProperty( 'RATU' );
            const latitude = picked3DtileFeature.getProperty( 'latitude' );
            const longitude = picked3DtileFeature.getProperty( 'longitude' );

            findObservations( 'http://localhost:3000/observations/', startTime, endTime, gmlid, RATU, latitude, longitude ).then( 
                observations => generateFeatureInfoTable( viewer, picked3DtileFeature, observations ) 
            );

        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

  /* Function that converts cartesian 3 coordinates to ll coordinates */
function toDegrees( cartesian3Pos ) {

    let pos = Cesium.Cartographic.fromCartesian( cartesian3Pos );
    return [ pos.latitude / Math.PI * 180, pos.longitude / Math.PI * 180 ];

  }

  /* Function that gets observations from backend */
async function findObservations ( url, startDate, endDate, gmlid, ratu, latitude, longitude ) {

    const response = await fetch( url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify( 
            { 
                start: startDate, 
                end: endDate,
                gml: gmlid,
                ratu: ratu,
                lat: latitude,
                long: longitude
            } )
      } );

    if ( !response.ok )  {

        let message = `An error has occured: ${ response.status }`;
        throw new Error( message );

    }

    const data = await response.json();
    return data;

}

/* Function that generates feature information table  */
function generateFeatureInfoTable( viewer, picked3DtileFeature, observations ) {

    let selectedEntity = new Cesium.Entity();
    let gml_id = picked3DtileFeature.getProperty( 'id' );
    let highestRoof =  picked3DtileFeature.getProperty( 'HighestRoof' );
    let kerroksia =  picked3DtileFeature.getProperty( 'Kerroksia' );
    let kerrosala =  picked3DtileFeature.getProperty( 'Kerrosala' );
    let valmistunut =  picked3DtileFeature.getProperty( 'Valmistunut' );

    selectedEntity.name = "GML_ID: " + gml_id + "";
    selectedEntity.description = 'Loading <div class="cesium-infoBox-loading"></div>';
    viewer.selectedEntity = selectedEntity;
    selectedEntity.description = '<table class="cesium-infoBox-defaultTable"><tbody>' 
        + '<tr><th>ID</th><td>' + picked3DtileFeature.getProperty( 'id' ) + '</td></tr>';

    selectedEntity.description += '<tr><th>HighestRoof</th><td>' + highestRoof + '</td></tr>';
                

    if ( kerroksia != null ) {

        selectedEntity.description += '<tr><th>Kerroksia</th><td>' + kerroksia + '</td></tr>';

    } 

    if ( kerrosala != null ) {

        selectedEntity.description += '<tr><th>Kerrosala</th><td>' + kerrosala + '</td></tr>';

    }  
            
    if ( valmistunut != null ) {

        selectedEntity.description += '<tr><th>Valmistunut</th><td>' + valmistunut + '</td></tr>';

    }

    if ( observations[ 'observations' ][ 'w' ]  != null ) {

        selectedEntity = findObservationsForUnit( selectedEntity, observations, 'w' );

    }

    if ( observations[ 'observations' ][ 'j' ]  != null ) {

        selectedEntity = findObservationsForUnit( selectedEntity, observations, 'j' );

    }

    if ( observations[ 'observations' ][ 'v' ]  != null ) {

        selectedEntity = findObservationsForUnit( selectedEntity, observations, 'v' );

    }

    if ( observations[ 'observations' ][ 'a' ]  != null ) {

        selectedEntity = findObservationsForUnit( selectedEntity, observations, 'a' );

    }     
}

/* Function that processes found observation data for faster timeseries generation  */
function findObservationsForUnit( selectedEntity, observations, unit ) {
    for ( let i = 0; i < observations[ 'observations' ][ unit ].timevaluepairs.length; i++ ) {

        let time = new Date()
        time.setTime( observations['observations'][ unit ].timevaluepairs[ i ].time * 1000 );
        let total = observations['observations'][ unit ].timevaluepairs[ i ].totalvalue;
        let average = observations['observations'][ unit ].timevaluepairs[ i ].averagevalue;
        let timeString = String( time );

        if ( total != null && total > 0) {

            selectedEntity.description += '<tr><th> Total A measured at ' + timeString + '</th><td>' + total.toFixed( 2 )+ '</td></tr>';

        }
        if ( average != null && average > 0 ) {

            selectedEntity.description += '<tr><th> Average A measured at ' + timeString + '</th><td>' + average.toFixed( 2 )+ '</td></tr>';

        }         
    }
    
    return selectedEntity;
}