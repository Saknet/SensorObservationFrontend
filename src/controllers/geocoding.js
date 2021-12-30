
/**
 * Sends get request to digitransit autocomplete geocoding API
 *
 * @param { string } text search term
 * @return { object } data found
 */
async function digitransitAutocompleteApi ( text ) {

    const url = 'https://api.digitransit.fi/geocoding/v1/autocomplete?text=' + text;

    const response = await fetch( url );

    if ( !response.ok )  {

        let message = `An error has occured: ${ response.status }`;
        throw new Error( message );

    }

    const data = await response.json();

    return data;

}

module.exports = {
    digitransitAutocompleteApi
};