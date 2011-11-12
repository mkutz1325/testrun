//yo connor ignore the stuff until the line with all the asterisks

var STATIC_ROOT = "static/"  //variable used to tell javascript where to find image files in django interface


function initialize() {
	maptime_src = 0;
    var Seattle = new google.maps.LatLng(47.608807,-122.322977);
    var mapOptions = {
      center: Seattle,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
	  mapTypeControl: false,
	  zoomControl: false,
      panControl: false,
	  streetViewControl: false
	};
	//MAP STYLES
	 var weirdshower = [ {
		 featureType: "transit",
		 elementType: "all",
		 stylers: [ { visibility: "off" } ]
	 },{
		 featureType: "landscape",
    elementType: "all",
    stylers: [
      { lightness: 35 }
    ]
	 },{
		 featureType: "poi",
		 elementType: "all",
		 stylers: [ { visibility: "off" } ]
	 },{
     featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      { saturation: -100 },
      { lightness: 60 },
      { gamma: 2.64 }
    ]
  },{
     featureType: "road.local",
    elementType: "geometry",
    stylers: [
      { lightness: 6 },
      { gamma: 2.64 }
    ]
  },{
     featureType: "road",
    elementType: "labels",
    stylers: [
      { lightness: 40 },
      { saturation: -20 }
    ]
  },{
  },{
    featureType: "road.highway",
    elementType: "all",
    stylers: [
      { visibility: "on" }
    ]
  },{
    featureType: "water",
    elementType: "all",
    stylers: [
      { lightness: 80 },
      { hue: "#AAD1B6" }
    ], featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      { hue: "#FFD757" },
      { saturation: -4 }
    ]
  }
	 ];
	
	// render the map itself and place it on the page
bounce = function(a){
	
}
map = new google.maps.Map(get("map"), mapOptions);
var styledMapOptions = {
	name: "bandscapemain", //I think this name is irrelevant?
	minZoom: 13,
	maxZoom: 16
}
// apply styles
var bandstyles =  new google.maps.StyledMapType(weirdshower,styledMapOptions);
map.mapTypes.set('bandscape', bandstyles);
map.setMapTypeId('bandscape');

_vmarkerLogomap = {"Theater": STATIC_ROOT + "img/theater.png", "Bar/tavern": STATIC_ROOT + "img/bar.png", "Restaurant": STATIC_ROOT + "img/coffee.png"} //img file



//***************************VENUE INFO:
currentvmarkers = []; //list of venue markers (venues)

//the vmarker is a more complicated object than the band object, it has the venue's info AND constructs it as en element on the map.
//each of these is one venue/vmarker.
//Venue parameters (in any order): Position (Lat/Lng), Venue name, Other venue info (Type of venue, address, location in city), Bands playing tonight (Hardcoded for now), Information about tonight's show


venuesdb = [
[47.6138827, -122.3196504, "Neumos", "Stage", "925 E Pike & 10th", "Capitol Hill, Seattle"],
[47.6139965, -122.3163888, "Bluebird Ice Cream", "Ice Cream Parlor", "1205 E Pike & 12th", "Capitol Hill, Seattle"],
[47.6141755, -122.3196343, "Comet Tavern", "Bar/tavern", "922 E Pike & Broadway", "Capitol Hill, Seattle"],
[47.6127317, -122.317526, "Cobra Lounge", "Hookah Bar", "1122 E Madison & 12th", "Capitol Hill, Seattle"],
[47.6229731, -122.3534542, "VERA Project", "All-ages stage", "Warren Ave N", "Seattle Center, Seattle"],
[47.6132334, -122.3316371, "Paramount Theater", "Theater", "911 Pine & 9th", "Downtown, Seattle"],
[47.6115591, -122.3412985, "Moore Theater", "Theater", "1932 2nd & Stewart", "Downtown, Seattle"],
[47.5880261, -122.3339224, "Showbox Sodo", "Theater", "1700 1st Ave", "Sodo, Seattle"],
[47.6084054, -122.3394746, "Showbox at the Market", "Theater", "1426 1st & Pike", "Downtown, Seattle"],
[47.6134757, -122.3444581, "Crocodile Cafe", "Restaurant", "2200 2nd & Blanchard", "Belltown, Seattle"],
[47.6187734, -122.329368, "El Corazon", "Theater", "109 Eastlake & Denny", "First Hill, Seattle"],
[47.6585661, -122.3118639, "Neptune Theater", "Theater", "1303 45th & Brooklyn", "U District, Seattle"],
[47.614681, -122.346133, "Rendezvous", "Theater", "2322 2nd & Battery", "Belltown, Seattle"],
[47.651393, -122.351803, "High Dive", "Theater", "513 N 36th", "Fremont, Seattle"],
[47.652176, -122.353894, "Nectar Lounge", "Theater", "412 N 36th & Evanston", "Fremont, Seattle"],
[47.613559, -122.3144308, "Chop Suey", "Night Club", "1325 E Madison & 14th Ave", "Fremont, Seattle"],
[47.557405, -122.284592, "Columbia City Theater", "Theater", "4916 Rainier Ave & Hudson St", "Columbia City, Seattle"],
[47.574394, -122.333969, "Studio 7", "Nigh Club", "110 1st Ave & Horton St", "Sodo, Seattle"],
[47.6200833, -122.3472248, "Fun House", "Bar", "206 5th Ave & Broad St", "Seattle Center, Seattle"],
[47.668189, -122.385843, "Sunset Tavern", "Bar", "5433 Ballard Ave NW", "Ballard, Seattle"],
[47.665764, -122.382626, "Tractor Tavern", "Bar", "5213 Ballard Ave NE", "Ballard, Seattle"],
//[47.651491, -122.351722, "White Rabbit", "Bar", "513 Ballard Ave NE", "Fremont, Seattle"], might be duplicate of High Dive?
[47.680275, -122.3249397, "Little Red Hen", "Bar", "7115 Woodlawn Ave & 72nd St", "Green Lake, Seattle"],
[47.607628, -122.340989, "Highway 99 Blues Club", "Bar", "1414 Western Ave", "Downtown, Seattle"],
[47.6614801, -122.3200152, "Blue Moon Tavern", "Bar/tavern", "712 NE 45th St & 8th Ave", "U District, Seattle"],
[47.6093132, -122.3395403, "Hard Rock Cafe", "Restaurant", "116 1st & Pike", "Downtown, Seattle"],
[47.614745, -122.339339, "Jazz Alley", "Restaurant", "2033 6th & Lenora", "Belltown, Seattle"],
[47.624551, -122.329333, "Mars Bar", "Bar", "609 Eastlake Ave & Mercer St", "Westlake, Seattle"],
[47.5700141, -122.3624464, "Skylark Cafe and Club", "Restaurant", "3803 Delridge Way", "Soutwest Seattle"],
[47.663989, -122.330749, "Chapel Performance Space", "Church","4649 Sunnyside Ave. N", "Wallingford, Seattle"],
[47.661393, -122.332355, "Seamonster Lounge", "Restaurant", "2202 N 45th St", ""]

];

vmarkers = [];

// initialize UI
	// time control
loadvmarkers();
search = new searchFunc();
windowVars = [];
URLvars();
UI = {
	desc: "",
	timeControl: new timeControl
}
get("map").appendChild(UI.timeControl.all);



}
	// first addtl filter

	// vmarkers
function loadvmarkers(){
for (entry in venuesdb){
	window[venuesdb[entry][2].split(' ').join('')] = new vmarker({position: new google.maps.LatLng(venuesdb[entry][0], venuesdb[entry][1]), venuename:venuesdb[entry][2], bands:venuesdb[entry][6], venueinfo:{genre: venuesdb[entry][3], address: venuesdb[entry][4], location: venuesdb[entry][5]}, showinfo:venuesdb[entry][7], alertm:venuesdb[entry][8]});window[venuesdb[entry][2].split(' ').join('')].open(map);
	vmarkers.push(window[venuesdb[entry][2].split(' ').join('')]);
	//console.log(venuesdb[entry][2] + " loaded")
}
currentFD = new mapFilterDialog;
get("map").appendChild(currentFD);
}
function duba(){
map.panTo(new google.maps.LatLng(47.651393, -122.351803))
}

function redrawVmarkers(){
	for (vmarker in vmarkers){
		vmarkers[vmarker].draw();
	}
}








	
