
const Cesium = require('cesium/Cesium');
const featureInformation = require( './featureInformation' );
require('./css/main.css');
require('cesium/Widgets/widgets.css');

var viewer = new Cesium.Viewer('cesiumContainer');
var tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
    url: 'https://kartta.hel.fi/3d/datasource-data/e9cfc1bb-a015-4a73-b741-7535504c61bb/tileset.json',
    show: true,
    shadows: Cesium.ShadowMode.ENABLED,
    maximumScreenSpaceError: 4
}))

Cesium.when(tileset.readyPromise).then(function (tileset) {viewer.flyTo(tileset)}).then(featureInformation.active3DTilePicker(viewer));