const chartsService = require( '../services/charts' );
const $ = require( 'jquery');


/* Function that generates feature information table  */
export function generateFeatureInfoTable( featureData, observationData, requestStarted ) {

    console.log('timespent ', new Date( Date.now() ) - requestStarted, ' ms' );

    if ( featureData ) {

        const filteredFeatureData = filterFeatureData( featureData );
        chartsService.generateFeatureDataTable( filteredFeatureData );

    }

    if ( !Array.isArray( observationData ) ) {

        chartsService.generateObservationChart( observationData, featureData.getProperty( 'attributes' )[ 'Katuosoite' ] );

    }

}

export function filterFeatureData( featureData ) {

    let keys = [];
    let values = [];

    if ( featureData.getProperty( 'attributes' ) ) {

        keys = Object.keys( featureData.getProperty( 'attributes' ) );   
        values = Object.values( featureData.getProperty( 'attributes' ) ); 

    }

    if ( !keys.length && !values.length ) {

        const expTilesetData = getFeatureDataForExperiementalTileset( featureData );
        keys = expTilesetData[0];
        values = expTilesetData[1];

    }

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

    $("#loadingicon").hide();

    return [ keysToKeep, valuesToKeep ]
}

function getFeatureDataForExperiementalTileset( feature ) {
    let keys = [];
    let values = [];

    const gmlid = feature.getProperty( 'gmlid' );
    
    if ( gmlid ) {

        keys.push( 'gmlid' );
        values.push( gmlid );

    }

    const height = feature.getProperty( 'citygml_measured_height' );
    
    if ( height ) {

        keys.push( 'height' );
        values.push( height );

    }

    const roof = feature.getProperty( 'citygml_roof_type' );
    
    if ( roof ) {

        keys.push( 'roof' );
        values.push( roof );

    }

    const storeys = feature.getProperty( 'citygml_storeys_above_ground' );
    
    if ( storeys ) {

        keys.push( 'storeys' );
        values.push( storeys );

    }

    const latitude = feature.getProperty( 'latitude' );
    
    if ( latitude ) {

        keys.push( 'latitude' );
        values.push( latitude );

    }

    const longitude = feature.getProperty( 'longitude' );
    
    if ( longitude ) {

        keys.push( 'longitude' );
        values.push( longitude );

    }

    return [ keys, values ]

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