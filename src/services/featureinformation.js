const chartsService = require( '../services/charts' );

/* Function that generates feature information table  */
export function generateFeatureInfoTable( featureData, observationData, requestStarted ) {

    console.log('timespent ', new Date( Date.now() ) - requestStarted, ' ms' );

    const filteredFeatureData = filterFeatureData( featureData );

    if ( filteredFeatureData != null ) {
        chartsService.generateFeatureDataTable( filteredFeatureData );
    }

    if ( !Array.isArray( observationData ) ) {

        chartsService.generateObservationChart( observationData );

    }   
    
}

export function filterFeatureData( featureData ) {

    const keys = Object.keys( featureData.getProperty( 'attributes' ) );   
    const values = Object.values( featureData.getProperty( 'attributes' ) ); 
    let keysToKeep = [];
    let valuesToKeep = [];

    for ( let i = 0, len = keys.length; i < len; i++ ) {

        if ( values[ i ] != null && !keys[ i ].startsWith( 'Address' ) && keys[ i ] != 'integrating_person' && keys[ i ] != 'integration_date' && keys[ i ] != 'matching_mode' 
            && keys[ i ] != 'externalReference externalObjectName' && keys[ i ] != 'overlap_filter' && keys[ i ] != 'overlap_file_to_DB' && keys[ i ] != 'overlap_DB_to_file' 
            && keys[ i ] != 'area_diff_filter' && keys[ i ] != 'area_diff' && keys[ i ] != 'UUID' ) {
                keysToKeep.push( keys[ i ] );
                valuesToKeep.push( values[ i ] );
        }
    }

    return [ keysToKeep, valuesToKeep ]
}
/* Function that processes found observation data for faster timeseries generation  */
function findObservationsForUnit( selectedEntity, timevaluepairs, unit ) {

    for ( let i = 0, len = timevaluepairs.length; i < len; i++ ) {

        let time = new Date()
        time.setTime( timevaluepairs[ i ].time * 1000 );
        let total = timevaluepairs[ i ].totalvalue;
        let average = timevaluepairs[ i ].averagevalue;

        if ( total != null ) {

        selectedEntity.description += '<tr><th> Total ' + unit + ' measured at ' + time.toLocaleString() + '</th><td>' + total.toFixed( 2 ) + '</td></tr>';

        }  

        if ( average != null ) {

            selectedEntity.description += '<tr><th> Average ' + unit + ' measured at ' + time.toLocaleString() + '</th><td>' + average.toFixed( 2 ) + '</td></tr>';

        }         
    }
    
    return selectedEntity;
}