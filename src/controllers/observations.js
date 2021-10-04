  /* Function that gets observations from backend */
  export async function findObservations ( url, startDate, endDate, gmlid, ratu, latitude, longitude ) {
  
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
                gmlid: gmlid,
                ratu: ratu,
                latitude: latitude,
                longitude: longitude
            } )
      } );

    if ( !response.ok )  {

        let message = `An error has occured: ${ response.status }`;
        throw new Error( message );

    }

    const data = await response.json();
    return data;

}