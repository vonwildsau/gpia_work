/* global L, carto, Mustache */


var map = L.map('map', {
  center: [20.728709, 13.979167],
  zoom: 2,
  minZoom: 2,
});    

  var southWest = L.latLng(-89.98155760646617, -180),
  northEast = L.latLng(89.99346179538875, 180);
  var bounds = L.latLngBounds(southWest, northEast);

  map.setMaxBounds(bounds);
  map.on('drag', function() {
    map.panInsideBounds(bounds, { animate: false });
  });
  


// Get the popup template from the HTML. We can do this here because the template will never change.
var popupTemplate = document.querySelector('.popup-template').innerHTML;

// Add base layer
L.tileLayer('https://api.mapbox.com/styles/v1/nicostettler/ck67e1izr0apx1ipbuyp7bvm0/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoibmljb3N0ZXR0bGVyIiwiYSI6ImNqc3lweWFmOTE1cDc0OW9iZGYzbHNyNGoifQ.BgZ8GQky4xAHBlL-Pi8MiQ', {
  maxZoom: 18,
  attribution: "&copy <a href=https://vonwildsau.com target='_blank'> vonwildsau</a>"
}).addTo(map);

var client = new carto.Client({
  apiKey: 'default_public',
  username: 'vonwildsau'
});

// Country Layer

var sourceCountry = new carto.source.Dataset('countrypolygons_1');
var sourceCountry = new carto.source.SQL("SELECT * FROM vonwildsau.countrypolygons_1");

var styleCountry = new carto.style.CartoCSS(`
#layer {
  polygon-fill: #b0ceff;
  polygon-opacity: 0.8;
}
#layer::outline {
  line-width: 1;
  line-color: #082563;
  line-opacity: 1;
}
`);

var layerCountry = new carto.layer.Layer(sourceCountry, styleCountry, {
  featureClickColumns: ['country']
});

// Cities Layer

var sourceCities = new carto.source.Dataset('citypoints_2');
var sourceCities = new carto.source.SQL("SELECT * FROM vonwildsau.citypoints_2");

var styleCities = new carto.style.CartoCSS(`
#layer {
  marker-width: 10;
  marker-fill: #E82E21;
  marker-fill-opacity: 0.9;
  marker-line-color: #b0ceff;
  marker-line-width: 1;
  marker-line-opacity: 0.5;
  marker-placement: point;
  marker-type: ellipse;
  marker-allow-overlap: true;
}
`);

var layerCities = new carto.layer.Layer(sourceCities, styleCities, {
  featureClickColumns: ['city','country']
});


// Sidebar feature content

var sidebar = document.querySelector('.sidebar-feature-content');
layerCities.on('featureClicked', function (event) {
  var content = '<div>' + event.data['city'] + ', ' + event.data['country'] + '</div>';
  console.log(event.data['city'])
    var dataset = "SELECT * FROM work_data WHERE city ILIKE '" + event.data['city'] + "'";
  fetch('https://vonwildsau.carto.com/api/v2/sql/?q=' + dataset)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    // All of the data returned is in the response variable
    console.log(data);
    var content =  Mustache.render(sidebarGroupTemplate, data);

    // Get the sidebar container element
    var sidebarContainer = document.querySelector('.sidebar-feature-content');

    // Add the text including the sum to the sidebar
    sidebarContainer.innerHTML = content;
    });
  sidebar.innerHTML = content;
});

var sidebar = document.querySelector('.sidebar-feature-content');
layerCountry.on('featureClicked', function (event) {
  var content = '<div>' + event.data['country'] + '</div>';
  console.log(event.data['country'])
  var dataset = "SELECT * FROM work_data WHERE country ILIKE '" + event.data['country'] + "'";
  fetch('https://vonwildsau.carto.com/api/v2/sql/?q=' + dataset)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    // All of the data returned is in the response variable
    console.log(data);
    var content =  Mustache.render(sidebarGroupTemplate, data);

    // Get the sidebar container element
    var sidebarContainer = document.querySelector('.sidebar-feature-content');

    // Add the text including the sum to the sidebar
    sidebarContainer.innerHTML = content;
    });
  sidebar.innerHTML = content;
});


 // Add the data to the map as a layer
client.addLayers([layerCountry, layerCities]);
client.getLeafletLayer().addTo(map);

var dataset = 'SELECT * from work_data';

var sidebarGroupTemplate = document.querySelector('.sidebar-group-template').innerHTML;
// Request the data from Carto using fetch.
// You will need to change 'brelsfoeagain' below to your username, otherwise this should work.
fetch('https://vonwildsau.carto.com/api/v2/sql/?q=' + dataset)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    // All of the data returned is in the response variable
    console.log(data);
    var content =  Mustache.render(sidebarGroupTemplate, data);

    // Get the sidebar container element
    var sidebarContainer = document.querySelector('.sidebar-feature-content');

    // Add the text including the sum to the sidebar
    sidebarContainer.innerHTML = content;
  });