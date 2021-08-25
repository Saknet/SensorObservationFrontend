const SimplePicker = require('simplepicker');

export function selectStartDate() {
    const simplepicker = new SimplePicker();
    simplepicker.on('submit', function(date, readableDate){
        console.log("date", date);
        console.log("date", readableDate);
        return date;
    })
}

export function selectEndDate() {
    const simplepicker2 = new SimplePicker();
    simplepicker2.on('submit', function(date, readableDate){
        console.log("date", date);
        console.log("date", readableDate);
        return date;
    })
}

