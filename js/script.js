// Group we will append our markers to
if (window.location.hash === "#cluster") {
	// Set up cluster group
	var markers = new L.MarkerClusterGroup();
} else {
	// Otherwise set up normal group total_victims`
	var markers = new L.LayerGroup();
}

// Google Docs spreadsheet key
var spreadsheet_key = '1b9o6uDO18sLxBqPwl_Gh9bnhW-ev_dABH83M5Vb5L8o	';

// Name of lat, long columns in Google spreadsheet
var lat_column = 'latitude';
var long_column = 'longitude';

var global_markers_data;

// Function that creates our popup
function generatePopup(content){
    // Generate header
	var popup_header = "<h4>" + toTitleCase(content['case']) + "</h4>"
	
	// Generate content
	var popup_content = '<table class="popup_table table">';
	popup_content += '<tr><td><strong>Location:</strong></td>';
	popup_content += '<td>' + content['location'] + '</td>';
	popup_content += '<tr><td><strong>Date:</strong></td>';
	popup_content += '<td>' + content['date'] + '</td>';
	popup_content += '<tr><td><strong>Summary:</strong></td>';
	popup_content += '<td>' + content['summary'] + '</td>';
	popup_content += '<tr><td><strong>Total victims:</strong></td>';
	popup_content += '<td>' + content['total_victims'] + '</td>';
	// popup_content += '<tr><td colspan="2"><strong><a href="http://' + content['summary'] + '" target="_blank">Learn more</a></strong></td>';
	popup_content += '</tr></table>'

	return popup_header + popup_content;
}

// This goes through our JSON file and puts markers on map
function loadMarkersToMap(markers_data) {
	// If we haven't captured the Tabletop data yet
	// We'll set the Tabletop data to global_markers_data
	if (global_markers_data !== undefined) {
		markers_data = global_markers_data;
	// If we have, we'll load global_markers_data instead of loading Tabletop again
	} else {
		global_markers_data = markers_data;
	}

	for (var num = 0; num < markers_data.length; num++) {
		(function (num){
		// Capture current iteration through JSON file
		current = markers_data[num];
		var total_victims = parseInt(current.total_victims);

		// Marker options
		var radius = 8;
		// Regular fill
		var fill_color = "ef3b2c";
		var border_color = "#FFF";
		// Hover
		var fill_color_hover = "#FFF";
		var border_color_hover = "#333";

        //if (total_victims >= 0 && total_victims < 30) {
        //  fill_color = '#fc4e2a';
        //} else if (total_victims >= 30 && total_victims < 100) {
        //  fill_color = '#fc4e2a';
        //} else if (total_victims >= 100 && total_victims < 1000) {
        //  fill_color = '#fc4e2a';
        //}

		// Add lat, long to marker
		var marker_location = new L.LatLng(current[lat_column], current[long_column]);

		// Determine radius of the circle by the value in total_victims
		//radius_actual = Math.sqrt(parseInt(current['total_victims']) / 3.14) * 2.8;
		var victim_int = parseInt(current['total_victims']);
		
		
		if(victim_int < 20){
            radius_show = 10;
        }else if(victim_int < 30){
            radius_show = 13;
        }else if(victim_int < 50){
            radius_show = 18;
        }else if(victim_int < 80){
            radius_show = 22;
        }else if(victim_int < 105){
            radius_show = 25;
        }else if(victim_int < 150){
            radius_show = 27;
        }else{
            radius_show = 30;
        }
        

		// Options for our circle marker
		var layer_marker = L.circleMarker(marker_location, {
			radius: radius_show,
			fillColor: '#fc4e2a',
			color: border_color,
			weight: 1,
			opacity: 1,
			fillOpacity: 1
		});

		// Generate popup
		layer_marker.bindPopup( generatePopup(current) );

		// Add events to marker
		
		// Must call separate popup(e) function to make sure right data is shown
		function mouseOver(e) {
			var layer_marker = e.target;
	        layer_marker.setStyle({
	            color: border_color_hover,
	            fillOpacity:.8
			});
			// layer_marker.openPopup();
	    }

	    // What happens when mouse leaves the marker
	    function mouseOut(e) {
			var layer_marker = e.target;
			layer_marker.setStyle({
				color: border_color,
				fillOpacity: 1
	        });
	        // layer_marker.closePopup();
	    }

		    // Call mouseover, mouseout functions
		    layer_marker.on({
		    	mouseover: mouseOver,
		    	mouseout: mouseOut
		    });

		
		    	// Add to feature group
				markers.addLayer(layer_marker);
				})(num)    
				
	}

	// Add feature group to map
	map.addLayer(markers);

	// Clear load tetotal_victimst
	// $('.sidebar_tetotal_victimst_intro').html('');
};

// Pull data from Google spreadsheet via Tabletop
function initializeTabletopObjectMarkers(){
	Tabletop.init({
    	key: spreadsheet_key,
    	callback: loadMarkersToMap,
    	simpleSheet: true,
    	debug: false
    });
}

// Add JSON data to map
// If not done with map-tabletop-geojson.js
initializeTabletopObjectMarkers();