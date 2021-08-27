const Cesium = require( 'cesium/Cesium' );

export function findObservationDateTimes( viewer ) {
    let startDate = new Date( Date.now() - 14400000 );
    let endDate = new Date( Date.now() );

    viewer.clock.onTick.addEventListener( function( clock ) {

        let clockGD = Cesium.JulianDate.toGregorianDate( clock.currentTime );
        let newEndDate = new Date( clockGD.year, clockGD.month - 1, clockGD.day, clockGD.hour + 3, clockGD.minute, clockGD.second, clockGD.millisecond );
    
        if ( new Date( endDate ).getTime() >= new Date( newEndDate ).getTime() ) {
    
            console.log( "Yes" );
    
            endDate = newEndDate.toISOString();
            startDate = new Date( newEndDate - 14400000 ).toISOString();
    
        } else {
    
            console.log( "No" );   
            startDate = new Date( Date.now() - 14400000 ).toISOString();
            endDate = new Date(Date.now()).toISOString();
    
        }

        console.log( startDate, endDate );    
    });

    return [ startDate, endDate ];

}