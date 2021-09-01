  /* Function that gets observations from backend */
  export async function findObservations ( url, startDate, picked3DtileFeature ) {

    const gmlId = picked3DtileFeature.getProperty( 'id' );
    const RATU = picked3DtileFeature.getProperty( 'RATU' );
    const latitude = picked3DtileFeature.getProperty( 'latitude' );
    const longitude = picked3DtileFeature.getProperty( 'longitude' );
  
    const response = await fetch( url, {
      
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify( 
            { 
                start: startDate, 
                end: endDate,
                gmlid: gmlId,
                ratu: RATU,
                lat: latitude,
                long: longitude
            } )
      } );

    if ( !response.ok )  {

        let message = `An error has occured: ${ response.status }`;
        throw new Error( message );

    }

    const data = await response.json();
    return data;

}