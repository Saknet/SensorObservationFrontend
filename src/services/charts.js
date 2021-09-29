const Plotly = require( 'plotly.js/dist/plotly' )

export function generateObservationChart( observationData ) {

    let plotlyData = [];

    if ( observationData[ 'w' ] != null ) {

        const wTrace = {

            x: observationData[ 'w' ].observationtimes,
            y: observationData[ 'w' ].averages,
            type: 'scatter',
            name: 'watts'

        }; 

        plotlyData.push( wTrace );        

    }

    if ( observationData[ 'j' ] != null ) {

        const jTrace = {
            x: observationData[ 'j' ].observationtimes,
            y: observationData[ 'j' ].averages,
            type: 'scatter',
            name: 'joules'
        }; 

        plotlyData.push( jTrace );        

    }

    if ( observationData[ 'v' ] != null ) {

        const vTrace = {

            x: observationData[ 'v' ].observationtimes,
            y: observationData[ 'v' ].averages,
            type: 'scatter',
            name: 'volts'

        };

        plotlyData.push( vTrace ); 

    }

    if ( observationData[ 'a' ] != null ) {

        const aTrace = {

            x: observationData[ 'a' ].observationtimes,
            y: observationData[ 'a' ].averages,
            type: 'scatter',
            name: 'ampères'

        };

        plotlyData.push( aTrace ); 

    }    

    if ( observationData[ 'decibel' ] != null ) {

        const decibelTrace = {

            x: observationData[ 'decibel' ].observationtimes,
            y: observationData[ 'decibel' ].averages,
            type: 'scatter',
            name: 'decibels'

        };

        plotlyData.push( decibelTrace );        

    } 

    if ( observationData[ 'degreeCelsius' ] != null ) {

        const degreeCelsiusTrace = {

            x: observationData[ 'degreeCelsius' ].observationtimes,
            y: observationData[ 'degreeCelsius' ].averages,
            type: 'scatter',
            name: '°C'

        };

        plotlyData.push( degreeCelsiusTrace );  

    } 

    if ( observationData[ 'pm' ] != null ) {

        const pmTrace = {

            x: observationData[ 'pm' ].observationtimes,
            y: observationData[ 'pm' ].averages,
            type: 'scatter',
            name: 'pm in air'

        };

        plotlyData.push( pmTrace );  

    } 

    const layout = {

        title: "Sensor Observation Data",
        font: {
          size: 10
        },
        margin: {
            b: 110,
            t: 40
        }
    }

    Plotly.newPlot( 'obsChart', plotlyData, layout, { responsive: true } );

}

export function generateFeatureDataTable( featureData ) {

    const values = [
        featureData[ 0 ],
        featureData[ 1 ] 
    ]
  
    const data = [ {
        type: 'table',
        header: {
            values: [["<b>Attribute</b>"], ["<b>Value</b>"]],
            align: "center",
            line: {width: 1, color: '#506784'},
            fill: {color: '#119DFF'},
            font: {family: "Arial", size: 10, color: "white"}
        },
        cells: {
            values: values,
            align: ["left", "center"],
            line: {color: "#506784", width: 1},
             fill: {color: ['#25FEFD', 'white']},
            font: {family: "Arial", size: 9, color: ["#506784"]}
        }
    }]

    const layout = {

        title: "Feature",
        font: {
          size: 10
        },
        margin: {
            b: 20,
            t: 40
        }
    }

    Plotly.newPlot( 'featureInfo', data, layout );

}

export function purgeAllCharts() {

    Plotly.purge( 'obsChart' );
    Plotly.purge( 'featureInfo' );

}