const Plotly = require( 'plotly.js/dist/plotly' )

/** 
 * Creates title for Sensor Observation Data chart 
 * 
 * @param { String } address street address of feature
 * @return { String } title for the Sensor Observation Data chart
 */
function createTitle( address ) {

    if ( address ) {

        return address + ' Sensor Observation Data';

    } else {

        return 'Sensor Observation Data';

    }      
}

/** 
 * Creates Sensor Observation Data chart with Plotly for timeserialized observation result data of the feature
 * 
 * @param { Object } observationData timeserialized observation data of feature
 * @param { String } address street address of feature
 */
export function generateObservationChart( observationData, address ) {

    let chartTitle = createTitle( address );
    let plotlyData = [];

    if ( observationData[ 'watt' ] != null ) {

        const wTrace = {

            x: observationData[ 'watt' ].observationtimes,
            y: observationData[ 'watt' ].averages,
            type: 'scatter',
            name: 'watts'

        }; 

        plotlyData.push( wTrace );        

    }

    if ( observationData[ 'joule' ] != null ) {

        const jTrace = {
            x: observationData[ 'joule' ].observationtimes,
            y: observationData[ 'joule' ].averages,
            type: 'scatter',
            name: 'joules'
        }; 

        plotlyData.push( jTrace );        

    }

    if ( observationData[ 'volt' ] != null ) {

        const vTrace = {

            x: observationData[ 'volt' ].observationtimes,
            y: observationData[ 'volt' ].averages,
            type: 'scatter',
            name: 'volts'

        };

        plotlyData.push( vTrace ); 

    }

    if ( observationData[ 'ampère' ] != null ) {

        const aTrace = {

            x: observationData[ 'ampère' ].observationtimes,
            y: observationData[ 'ampère' ].averages,
            type: 'scatter',
            name: 'ampères'

        };

        plotlyData.push( aTrace ); 

    }    

    if ( observationData[ 'bel sound pressure' ] != null ) {

        const decibelTrace = {

            x: observationData[ 'bel sound pressure' ].observationtimes,
            y: observationData[ 'bel sound pressure' ].averages,
            type: 'scatter',
            name: 'decibels'

        };

        plotlyData.push( decibelTrace );        

    } 

    if ( observationData[ 'degree Celsius' ] != null ) {

        const degreeCelsiusTrace = {

            x: observationData[ 'degree Celsius' ].observationtimes,
            y: observationData[ 'degree Celsius' ].averages,
            type: 'scatter',
            name: '°C'

        };

        plotlyData.push( degreeCelsiusTrace );  

    } 

    if ( observationData[ 'particulate matter' ] != null ) {

        const pmTrace = {

            x: observationData[ 'particulate matter' ].observationtimes,
            y: observationData[ 'particulate matter' ].averages,
            type: 'scatter',
            name: 'pm in air'

        };

        plotlyData.push( pmTrace );  

    } 

    const layout = {

        title: chartTitle,
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

/** 
 * Creates chart with Plotly for feature information data found in tileset
 * 
 * @param { Object } featureData feature information data from tileset
 */
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

/** 
 * Purges Plotly charts from UI
 */
export function purgeAllCharts() {

    Plotly.purge( 'obsChart' );
    Plotly.purge( 'featureInfo' );

}