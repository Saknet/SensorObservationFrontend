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

    for ( let i = 0, len = observationData.length; i < len; i++ ) {

        addObservationDataToChart( plotlyData, observationData[ i ], observationData[ i ].uom );      

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
 * Adds observation data to Plotly chart
 * 
 * @param { Array<Object> } plotlyData data gathered for plotly
 * @param { Object } data observation data for unit of measurement
 * @param { string } unit unit measured
 */
 export function addObservationDataToChart( plotlyData, data, unit ) {

    const trace = {

        x: data.observationtimes,
        y: data.averages,
        type: 'scatter',
        name: unit + ' average from ' + data.sensorcount + ' sensors'

    };

    plotlyData.push( trace ); 

}

/** 
 * Purges Plotly charts from UI
 */
export function purgeAllCharts() {

    Plotly.purge( 'obsChart' );
    Plotly.purge( 'featureInfo' );

}