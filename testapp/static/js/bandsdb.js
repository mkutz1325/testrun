var STATIC_URL = "/static/";

function band(a, b, c, d){ // uses of this are at the bottom of the file. Parameters: (Band name, musical genre, location of album cover image, origin of band)
	this.bandname = a;
	this.genre = b;
	this.albumsrc = STATIC_URL + c;
	this.homecity = d;
	this.headercontent = null;
	this.infoheading = a;
	this.infoline1 = b;
	this.infoline2 = "from " + d;
	this.infoline3 = "currently in Seattle";
	this.albumsrc =  c;
	bandsdb.push(this);	
}

function searchbands(a){ //search function, not part of the class but uses the class
	for (var i in bandsdb){
		if (bandsdb[i].bandname == a){
			var x = i;
		}
	}
	x && console.log(bandsdb[x].bandname + " / " + bandsdb[x].genre);
	x && addinfobox(bandsdb[x].headcontent, "band");
	!x && console.log("not found");
}


bandsdb = []; //list of bands

AviBuffalo = new band("Avi Buffalo", "Indie Pop", "album_covers/avi.jpg", "Long Beach, CA"); //each line = a band
WuLyf = new band("Wu Lyf", "Lo-Fi", "album_covers/wulyf.jpg", "Manchester, England");
FleetFoxes = new band("Fleet Foxes", "Folk", "album_covers/fleetfoxes.jpg", "Seattle, WA");
WashedOut = new band("Washed Out", "Chillwave", "album_covers/washedout.jpg", "Perry, GA");
ToroYMoi = new band("Toro Y Moi", "Chillwave", "album_covers/toro.jpg", "Columbia, SC");
RonanDelisleQuartet = new band("Ronan Delisle Quartet", "Jazz", "album_covers/ronan.jpg", "Seattle, WA");
EarlSweatshirt = new band("Earl Sweatshirt", "Hip-hop", "album_covers/earlsweatshirt.jpg", "LA");
TylerTheCreator = new band("Tyler, The Creator", "Hip-hop", "album_covers/tyler.jpg", "LA");
TheAntlers = new band("The Antlers", "Indie Rock", "album_covers/theantlers.jpg", "Brooklyn");
tUnEyArDs = new band("tUnE-yArDs", "Indie Rock", "album_covers/tuneyards.jpg", "Connecticut");
AlgernonCadwallader = new band("Algernon Cadwallader", "Emo", "album_covers/algernon_cadwallader.jpg", "Philadelphia");
Coontazj = new band("Coontazj", "Rapper", "album_covers/coontazj.jpg", "Providence");
KanyeWest = new band("Kanye West", "Rapper", "album_covers/kanyewest.jpg", "Chicago");
Menomena = new band("Menomena", "Indie Rock", "album_covers/menomena.jpg", "Portland");
Japandroids = new band("Japandroids", "Noise Rock", "album_covers/japandroids.jpg", "Vancouver B.C.");
AmericanFootball = new band("American Football", "Emo", "album_covers/americanfootball.jpg", "Urbana, IL");
EmpireEmpireIWasALonelyEstate = new band("Empire, Empire!", "Emo", "album_covers/empireempireiwasalonelyestate.jpg", "Fenton, MI");
GrizzlyBear = new band("Grizzly Bear", "Indie Rock", "album_covers/grizzlybear.jpg", "Brooklyn");
Salem = new band("Salem", "Goth/Hip-hop", "album_covers/salem.jpg", "Traverse City, MI");
CocoRosie = new band("CocoRosie", "Freak folk/Hip-hop", "album_covers/cocorosie.jpg", "Paris");
TallestManOnEarth = new band("Tallest Man On Earth", "Indie rock", "album_covers/tallestmanonearth.jpg", "Dalarna, Swedan");
YoungMontana = new band("Young Montana?", "Electronic/glitch", "album_covers/youngmontana.jpg", "Coventry, UK");
FlyingLotus = new band("Flying Lotus", "Electronic", "album_covers/flyinglotus.jpg", "LA");
TheBadPlus = new band("The Bad Plus", "Jazz", "album_covers/badplus.jpg", "Minneapolis");
CigBros = new band("Cig Bros", "Weird Rock", "album_covers/cigbros.jpg", "Seattle");
AvettBrothers = new band("Avett Brothers", "Folk Rock", "album_covers/avettbrothers.jpg", "Concord, NC")

//to add, from FRAN: Grizzly Bear, Salem, Coco Rosie, Tallest Man, Young Montana?, Flying Lotus, Avett Brothers
// from KEVIN Curren$y, MFdune, Mysteikal, KMD, Murphy Lee, Kendrick Lamar, Das Racist, Danny Brown, Madlib, NWA
