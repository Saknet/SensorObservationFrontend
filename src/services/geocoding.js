/**
 * Processes the data found with geocoding API. Only results from Helsinki are included and only data useful for app is left in
 *
 * @param { object } data found data
 * @return { object } processed data
 */
function processAddressData ( data ) {

    let features = [];

    for ( let i = 0, len = data.length; i < len; i++ ) {

        // only include results from Helsinki
        if ( data[ i ][ 'properties' ][ 'locality' ] === 'Helsinki' || data[ i ][ 'properties' ][ 'localadmin' ] === 'Helsinki' ) {

            let row = { address: data[ i ][ 'properties' ][ 'name' ], latitude: data[ i ][ 'geometry' ][ 'coordinates'][ 1 ], longitude: data[ i ][ 'geometry' ][ 'coordinates'][ 0 ] };
            features.push( row );

        }


    }

    return features;

}

module.exports = {
    processAddressData,
};