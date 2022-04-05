const $ = require( 'jquery' );
const moment = require( 'moment' );
const daterangepicker = require( 'daterangepicker' );
const featurePickerService = require( '../services/featurepicker' );

/**
 * Initializes datepicker
 */
function initializeDatepicker () {

    $( '#loadingicon' ).hide();

    /* jquery based daterangepicker function handling changing dates in UI */
    $( function () {
        $( 'input[name="datetimes"]' ).daterangepicker( {

            timePicker: true,
            startDate: moment().subtract( 8, 'hours' ),
            endDate: moment(),
            minDate: moment().subtract( 90, 'days' ),
            maxDate: moment(),
            locale: {
                format: 'DD.M.Y HH:mm'
            }

        } );

        $( 'input[name="datetimes"]' ).on( 'apply.daterangepicker', function ( ev, picker ) {

            const startTime = picker.startDate._d;
            const endTime = picker.endDate._d;

            if ( endTime.getTime() - startTime.getTime() < 604801000 ) {

                featurePickerService.updateTimesForObservations( startTime, endTime );

            } else {

                alert( 'selected time period is too large' );

            }

        } );

    } );

}

module.exports = {
    initializeDatepicker
};