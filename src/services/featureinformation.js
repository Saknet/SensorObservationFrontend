const chartsService = require( './chart' );
const $ = require( 'jquery' );

/**
 * Generates tables containing feature information and if found observation results
 *
 * @param { object } featureData the data of the feature
 * @param { object } observationData possibile observation data of the feature
 * @param { number } requestStarted only used for measuring performance
 */
function generateTables ( featureData, observationData, requestStarted ) {

    console.log( 'timespent ', new Date( Date.now() ) - requestStarted, ' ms' );

    if ( featureData ) {

        const filteredFeatureData = filterFeatureData( featureData );
        chartsService.generateFeatureDataTable( filteredFeatureData );

    }

    if ( observationData.length ) {

        chartsService.generateObservationChart( observationData, featureData.getProperty( 'attributes' )[ 'Katuosoite' ] );

    }

}

/**
 * Removes attributes that are no value to user
 *
 * @param { object } featureData the data of the feature
 * @return { Array<String> } kept attribute keys and values
 */
function filterFeatureData ( featureData ) {

    let keys = [];
    let values = [];

    if ( featureData.getProperty( 'attributes' ) ) {

        keys = Object.keys( featureData.getProperty( 'attributes' ) );
        values = Object.values( featureData.getProperty( 'attributes' ) );

    }

    let keysToKeep = [];
    let valuesToKeep = [];

    for ( let i = 0, len = keys.length; i < len; i++ ) {

        if ( values[ i ] && !keys[ i ].startsWith( 'Address' ) && keys[ i ] !== 'integrating_person' && keys[ i ] !== 'integration_date' && keys[ i ] !== 'matching_mode'
            && keys[ i ] !== 'externalReference externalObjectName' && keys[ i ] !== 'overlap_filter' && keys[ i ] !== 'overlap_file_to_DB' && keys[ i ] !== 'overlap_DB_to_file'
            && keys[ i ] !== 'area_diff_filter' && keys[ i ] !== 'area_diff' && keys[ i ] !== 'UUID' ) {
            keysToKeep.push( keys[ i ] );
            valuesToKeep.push( values[ i ] );
        }
    }

    $( '#loadingicon' ).hide();

    return [ keysToKeep, valuesToKeep ];
}

module.exports = {
    generateTables,
    filterFeatureData
};