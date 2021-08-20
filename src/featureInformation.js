const Cesium = require('cesium/Cesium');

var Pickers_3DTile_Activated = true;

export async function active3DTilePicker( viewer ) {

    var highlighted = {

        feature: undefined,
        originalColor: new Cesium.Color()

    };
    // Information about the currently selected feature
    var selected = {

        feature: undefined,
        originalColor: new Cesium.Color()

    };

    // Get default left click handler for when a feature is not picked on left click
    var clickHandler = viewer.screenSpaceEventHandler.getInputAction( Cesium.ScreenSpaceEventType.LEFT_CLICK );
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
            var name = picked3DtileFeature.getProperty( 'CODE' );
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

        const llcoordinates = toDegrees( viewer.scene.pickPosition( movement.position ) );  
        const latitude = llcoordinates[ 0 ];
        const longitude = llcoordinates[ 1 ];

        getObservations( 'http://localhost:3000/observations/' ).then( observations => generateFeatureInfoTable( viewer, picked3DtileFeature, observations ) );

        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

  /* Function that converts cartesian 3 coordinates to ll coordinates */
function toDegrees( cartesian3Pos ) {

    let pos = Cesium.Cartographic.fromCartesian( cartesian3Pos );
    return [ pos.latitude / Math.PI * 180, pos.longitude / Math.PI * 180 ];

  }

  /* Function that gets observations from backend */
async function getObservations ( url ) {

    let response = await fetch( url );
//    let response = await fetch( url + new URLSearchParams({
//        latitude: lat,
//        longitude: long,
//    }));

    if ( !response.ok)  {

        let message = `An error has occured: ${ response.status }`;
        throw new Error( message );

    }

    let data = await response.json();
    return data;

}

/* Function that generates feature information table  */
function generateFeatureInfoTable( viewer, picked3DtileFeature, observations ) {

    let selectedEntity = new Cesium.Entity();
    let gml_id = picked3DtileFeature.getProperty( 'gml_id' );
    let highestRoof =  picked3DtileFeature.getProperty( 'HighestRoof' );
    let kerroksia =  picked3DtileFeature.getProperty( 'Kerroksia' );
    let kerrosala =  picked3DtileFeature.getProperty( 'Kerrosala' );
    let valmistunut =  picked3DtileFeature.getProperty( 'Valmistunut' );

    selectedEntity.name = "GML_ID: " + gml_id + "";
    selectedEntity.description = 'Loading <div class="cesium-infoBox-loading"></div>';
    viewer.selectedEntity = selectedEntity;
    selectedEntity.description = '<table class="cesium-infoBox-defaultTable"><tbody>' 
        + '<tr><th>ID</th><td>' + picked3DtileFeature.getProperty( 'ID' ) + '</td></tr>';

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

        if ( total != null ) {

            selectedEntity.description += '<tr><th> Total A measured at ' + timeString + '</th><td>' + total.toFixed( 2 )+ '</td></tr>';

        }
        if ( average != null ) {

            selectedEntity.description += '<tr><th> Average A measured at ' + timeString + '</th><td>' + average.toFixed( 2 )+ '</td></tr>';

        }         
    }
    
    return selectedEntity;
}