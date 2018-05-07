// Set view of Leaflet map based on screen size
var layer = new L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
    attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
    minZoom: 3,
    maxZoom: 9
});
if ($(window).width() < 626) {
    var map = new L.Map('map').setView([42,-96],3);
} else {
    var map = new L.Map('map').setView([42,-96.5],5);
}
map.addLayer(layer);