const Cesium = require( 'cesium/Cesium' );

/* Function that generates feature information table  */
export function generateFeatureInfoTable( viewer, picked3DtileFeature, observations ) {

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

    if ( observations[ 'observations' ][ 'decibel' ]  != null ) {
        selectedEntity = findObservationsForUnit( selectedEntity, observations, 'decibel' );

    } 

    if ( observations[ 'observations' ][ 'degreeCelsius' ]  != null ) {
        selectedEntity = findObservationsForUnit( selectedEntity, observations, 'degreeCelsius' );

    } 
}

/* Function that processes found observation data for faster timeseries generation  */
function findObservationsForUnit( selectedEntity, observations, unit ) {

    for ( let i = 0; i < observations[ 'observations' ][ unit ].timevaluepairs.length; i++ ) {

        let time = new Date()
        time.setTime( observations['observations'][ unit ].timevaluepairs[ i ].time * 1000 );
        let total = observations['observations'][ unit ].timevaluepairs[ i ].totalvalue;
        let average = observations['observations'][ unit ].timevaluepairs[ i ].averagevalue;

        if ( total != null ) {

        selectedEntity.description += '<tr><th> Total ' + unit + ' measured at ' + time.toLocaleString() + '</th><td>' + total.toFixed( 2 ) + '</td></tr>';

        }  

        if ( average != null ) {

            selectedEntity.description += '<tr><th> Average ' + unit + ' measured at ' + time.toLocaleString() + '</th><td>' + average.toFixed( 2 ) + '</td></tr>';

        }         
    }
    
    return selectedEntity;
}