import * as Cesium from "cesium";

var Pickers_3DTile_Activated = true;
async function active3DTilePicker() {
    var highlighted = {
        feature: undefined,
        originalColor: new Cesium.Color()
    };
    // Information about the currently selected feature
    var selected = {
        feature: undefined,
        originalColor: new Cesium.Color()
    };

    // Get default left click handler for when a feature is not picked on left click
    var clickHandler = viewer.screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    // Color a feature green on hover.
    viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(movement) {
        if (Pickers_3DTile_Activated) {
            // If a feature was previously highlighted, undo the highlight
            if (Cesium.defined(highlighted.feature)) {
                highlighted.feature.color = highlighted.originalColor;
                highlighted.feature = undefined;
            }
            // Pick a new feature
            var picked3DtileFeature = viewer.scene.pick(movement.endPosition);
            if (!Cesium.defined(picked3DtileFeature)) {
                // nameOverlay.style.display = 'none';
                return;
            }
            // A feature was picked, so show it's overlay content
            // nameOverlay.style.display = 'block';
            // nameOverlay.style.bottom = viewer.canvas.clientHeight - movement.endPosition.y + 'px';
            // nameOverlay.style.left = movement.endPosition.x + 'px';
            var name = picked3DtileFeature.getProperty('CODE');
            if (!Cesium.defined(name)) {
                name = picked3DtileFeature.getProperty('ID');
            }
            // nameOverlay.textContent = name;
            // Highlight the feature if it's not already selected.
            if (picked3DtileFeature !== selected.feature) {
                highlighted.feature = picked3DtileFeature;
                Cesium.Color.clone(picked3DtileFeature.color, highlighted.originalColor);
                picked3DtileFeature.color = Cesium.Color.GREEN;
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // Color a feature on selection and show metadata in the InfoBox.
    viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
        if (Pickers_3DTile_Activated) {
            // If a feature was previously selected, undo the highlight
            if (Cesium.defined(selected.feature)) {
                selected.feature.color = selected.originalColor;
                selected.feature = undefined;
            }
            // Pick a new feature
            var picked3DtileFeature = viewer.scene.pick(movement.position);
            if (!Cesium.defined(picked3DtileFeature)) {
                clickHandler(movement);
                return;
            }
            // Select the feature if it's not already selected
            if (selected.feature === picked3DtileFeature) {
                return;
            }
            selected.feature = picked3DtileFeature;
            // Save the selected feature's original color
            if (picked3DtileFeature === highlighted.feature) {
                Cesium.Color.clone(highlighted.originalColor, selected.originalColor);
                highlighted.feature = undefined;
            } else {
                Cesium.Color.clone(picked3DtileFeature.color, selected.originalColor);
            }

        getObservations('http://localhost:3000/observations').then(observations => generateFeatureInfoTable(picked3DtileFeature, observations));
//        generateFeatureInfoTable(picked3DtileFeature, observations);

        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

async function getObservations (url) {
    let response = await fetch(url);
    if (!response.ok) {
        let message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    let data = await response.json();
    return data;
}

function generateFeatureInfoTable(picked3DtileFeature, observations) {
    var selectedEntity = new Cesium.Entity();
    let gml_id = picked3DtileFeature.getProperty('gml_id');
    let highestRoof =  picked3DtileFeature.getProperty('HighestRoof');
    let kerroksia =  picked3DtileFeature.getProperty('Kerroksia');
    let kerrosala =  picked3DtileFeature.getProperty('Kerrosala');
    let valmistunut =  picked3DtileFeature.getProperty('Valmistunut');

    selectedEntity.name = "GML_ID: " + gml_id + "";
    selectedEntity.description = 'Loading <div class="cesium-infoBox-loading"></div>';
    viewer.selectedEntity = selectedEntity;
    selectedEntity.description = '<table class="cesium-infoBox-defaultTable"><tbody>' 
        + '<tr><th>ID</th><td>' + picked3DtileFeature.getProperty('ID') + '</td></tr>';

    selectedEntity.description += '<tr><th>HighestRoof</th><td>' + highestRoof + '</td></tr>';
                

    if (kerroksia !== undefined && kerroksia !== null ) {
        selectedEntity.description += '<tr><th>Kerroksia</th><td>' + kerroksia + '</td></tr>';
    } 

    if (kerrosala !== undefined && kerrosala !== null ) {
        selectedEntity.description += '<tr><th>Kerrosala</th><td>' + kerrosala + '</td></tr>';
    }  
            
    if (valmistunut !== undefined && valmistunut !== null ) {
        selectedEntity.description += '<tr><th>Valmistunut</th><td>' + valmistunut + '</td></tr>';
    }

    for (let i = 0; i < observations['observations']['w'].timevaluepairs.length; i++) {
        let time= new Date()
        time.setTime(observations['observations']['w'].timevaluepairs[i].time * 1000);
        let total = observations['observations']['w'].timevaluepairs[i].totalvalue;
        let average = observations['observations']['w'].timevaluepairs[i].averagevalue;
        let timeString = String(time);
        if (total != null) {
            selectedEntity.description += '<tr><th> Total W measured at ' + timeString+ '</th><td>' + total.toFixed(2)+ '</td></tr>';
        }
        if (average != null) {
            selectedEntity.description += '<tr><th> Average W measured at ' + timeString+ '</th><td>' + average.toFixed(2)+ '</td></tr>';
        }
    }

    for (let i = 0; i < observations['observations']['j'].timevaluepairs.length; i++) {
        let time= new Date()
        time.setTime(observations['observations']['j'].timevaluepairs[i].time * 1000);
        let total = observations['observations']['j'].timevaluepairs[i].totalvalue;
        let average = observations['observations']['j'].timevaluepairs[i].averagevalue;
        let timeString = String(time);
        if (total != null) {
            selectedEntity.description += '<tr><th> Total J measured at ' + timeString+ '</th><td>' + total.toFixed(2)+ '</td></tr>';
        }
        if (average != null) {
            selectedEntity.description += '<tr><th> Average J measured at ' + timeString+ '</th><td>' + average.toFixed(2)+ '</td></tr>';
        }        
    }

    for (let i = 0; i < observations['observations']['v'].timevaluepairs.length; i++) {
        let time= new Date()
        time.setTime(observations['observations']['v'].timevaluepairs[i].time * 1000);
        let total = observations['observations']['v'].timevaluepairs[i].totalvalue;
        let average = observations['observations']['v'].timevaluepairs[i].averagevalue;
        let timeString = String(time);
        if (total != null) {
            selectedEntity.description += '<tr><th> Total V measured at ' + timeString+ '</th><td>' + total.toFixed(2)+ '</td></tr>';
        }
        if (average != null) {
            selectedEntity.description += '<tr><th> Average V measured at ' + timeString+ '</th><td>' + average.toFixed(2)+ '</td></tr>';
        } 
    }

    for (let i = 0; i < observations['observations']['a'].timevaluepairs.length; i++) {
        let time= new Date()
        time.setTime(observations['observations']['a'].timevaluepairs[i].time * 1000);
        let total = observations['observations']['a'].timevaluepairs[i].totalvalue;
        let average = observations['observations']['a'].timevaluepairs[i].averagevalue;
        let timeString = String(time);
        if (total != null) {
            selectedEntity.description += '<tr><th> Total A measured at ' + timeString+ '</th><td>' + total.toFixed(2)+ '</td></tr>';
        }
        if (average != null) {
            selectedEntity.description += '<tr><th> Average A measured at ' + timeString+ '</th><td>' + average.toFixed(2)+ '</td></tr>';
        }         
    }
  
}

function processObservations(observations, unit) {
    
}

export default active3DTilePicker;