

/**
 * Sends get request to pygeoAPI to get things located within bbox
 *
 * @param { string } bbox bounding box of things
 * @return { object } data found
 */
async function getThingsFromPyGeoAPI ( bbox ) {

    const url = 'https://geo.fvh.fi/features/collections/thing/items?f=json&bbox='+ bbox;

    const response = await fetch( url );

    console.log( "url", url );

    if ( !response.ok )  {

        let message = `An error has occured: ${ response.status }`;
        throw new Error( message );

    }

    const data = await response.json();

    return data;

}

module.exports = {
    getThingsFromPyGeoAPI
};