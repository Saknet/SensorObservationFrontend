const Cesium = require( 'cesium/Cesium' );
const chartsService = require( '../services/charts' );

/* Function that generates feature information table  */
export function generateFeatureInfoTable( viewer, picked3DtileFeature, observationData ) {

    let selectedEntity = new Cesium.Entity();
    let gml_id = picked3DtileFeature.getProperty( 'id' );
    let highestRoof =  picked3DtileFeature.getProperty( 'highestroof' );
    let kerroksia =  picked3DtileFeature.getProperty( 'kerroksia' );
    let kerrosala =  picked3DtileFeature.getProperty( 'kerrosala' );
    let valmistunut =  picked3DtileFeature.getProperty( 'valmistunut' );
    let ratu =  picked3DtileFeature.getProperty( 'ratu' );

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

    if ( ratu != null ) {

        selectedEntity.description += '<tr><th>RATU</th><td>' + ratu + '</td></tr>';

    }

    chartsService.generateObservationChart( observationData );

}

/* Function that processes found observation data for faster timeseries generation  */
function findObservationsForUnit( selectedEntity, observationDataForUnit, unit ) {

    for ( let i = 0; i < observationDataForUnit.timevaluepairs.length; i++ ) {

        let time = new Date()
        time.setTime( observationDataForUnit.timevaluepairs[ i ].time * 1000 );
        let total = observationDataForUnit.timevaluepairs[ i ].totalvalue;
        let average = observationDataForUnit.timevaluepairs[ i ].averagevalue;

        if ( total != null ) {

        selectedEntity.description += '<tr><th> Total ' + unit + ' measured at ' + time.toLocaleString() + '</th><td>' + total.toFixed( 2 ) + '</td></tr>';

        }  

        if ( average != null ) {

            selectedEntity.description += '<tr><th> Average ' + unit + ' measured at ' + time.toLocaleString() + '</th><td>' + average.toFixed( 2 ) + '</td></tr>';

        }         
    }
    
    return selectedEntity;
}