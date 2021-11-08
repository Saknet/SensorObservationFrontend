/* Function that updates times needed for retrieving observations data */
export function processAddressData( data ) {

    console.log( "data", data ); 

    let features = [];

    for ( let i = 0, len = data.length; i < len; i++ ) {

        if ( data[ i ][ 'properties' ][ 'locality' ] == 'Helsinki' || data[ i ][ 'properties' ][ 'localadmin' ] == 'Helsinki' ) {

            let row = { address: data[ i ][ 'properties' ][ 'name' ], latitude: data[ i ][ 'geometry' ][ 'coordinates'][ 1 ], longitude: data[ i ][ 'geometry' ][ 'coordinates'][ 0 ] };
            features.push( row );

        }


    }

    console.log( "features", features );

    return features;
}