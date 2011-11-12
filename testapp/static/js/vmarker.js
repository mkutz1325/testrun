//     Bandscape vmarker library
//     by Artur Sapek
//     (C) 2011
//     inputs: position, venuename

var STATIC_ROOT = "static/";   //variable used any time a source for an static file is called

	
function vmarker(opt_opts) {
	opt_opts = opt_opts || {};
	google.maps.OverlayView.apply(this, arguments);
	this.position = opt_opts.position;
	this.venuename = this.infoheading = opt_opts.venuename || "untitled";
	if (opt_opts.alertm){
		this.alertm = opt_opts.alertm;
		this.alert = this.hasalert = true;
	} else {
		this.alert = false;
		this.hasalert = undefined;
	}
	var spliceMap = {0: [0,1], 1: [1,2], 2: [5,7], 3: [0,7], 4: [5,7], 5: [0,7]};	
	this.genre = this.infoline1 = opt_opts.venueinfo.genre;
	this.address = this.infoline2 = opt_opts.venueinfo.address;
	this.location = this.infoline3 = opt_opts.venueinfo.location; 
	this.bands = null;
	if(pseudo.db[sanitize(this.venuename)]) this.bands = pseudo.db[sanitize(this.venuename)][spliceMap[maptime_src][0]]; 	
	this.showinfo = opt_opts.showinfo || {};
	this.pane = "overlayImage";
	this.featuresStatus = this.mouseover = this.alertbounce1 = false;
	this.venuenameclean = this.venuename.split(' ').join(''); 
	this.alertin = true;
	if (this.genre in _vmarkerLogomap) this.logoimg = _vmarkerLogomap[this.genre];
	if (!(this.genre in _vmarkerLogomap)) this.logoimg = STATIC_ROOT + "img/coffee.png";      //img file
	this.deghostall = [];
	this.markerobjects = [];
}
vmarker.prototype = new google.maps.OverlayView();
vmarker.prototype.putimg = function(a) {
	var x = create("img", {position: "absolute"}, {src: a}, null);
	return x;
}
vmarker.prototype.addobj = function(a, b){
	var panekey = {1: "overlayLayer", 2: "overlayShadow", 3: "overlayImage", 4: "floatShadow", 5: "overlayMouseTarget", 6: "floatPane"};
		for (var i in a){
			this.getPanes()[panekey[b]].appendChild(a[i]);
			this.markerobjects.push(a[i]);
	}
}
vmarker.prototype.applystyles = function(a, b){ 
	for (i in a){
			b.style[i] = a[i];
	}
}

vmarker.prototype.addimg = function(a){
	for (var i in a){
		this[i] = create("img", {position: "absolute"}, {src: a[i]});
	}
}
vmarker.prototype.bandtab = function(name, genre, albumsrc){ 
	var all = create("div", {position: "absolute"}, null, null);
	var wrapper = create("div", {float: "left", display: "inline", position: "relative", left: "60px", bottom: "60px"}, null, null);
	var bandname = create("div", {}, {className: "bandtab"}, null);
	var bandnamespan = create("span", {padding: "7px", paddingBottom: "0px", fontFamily: "Arial", color: "#1C2C35", fontSize: "33px"}, null, name);
	var genrespan = create("span", {padding: "7px", paddingTop: "0px", fontFamily: "Arial", color: "#EFEFEF", fontSize: "14px", display: "block"}, null, genre);
	var album = create("img", {width:"60px", height:"60px"}, {src: albumsrc || STATIC_ROOT + "img/blank.jpg"}, null);   //img file
	var append = [[bandname, bandnamespan], [bandname, genrespan], [wrapper, bandname], [all, album], [all, wrapper]];
	appendobj(append);
	return all;
}
vmarker.prototype.showInfoTab = function(info, bgcolor){
	if (bgcolor == "green"){
		var bg = "#75C677";
	} else {
		var bg = "rgba(190,0,0,0.85)";
	}
	var all = create("div", {position: "absolute"}, null, null);
	var content = create("div", {backgroundColor: bg, color: "#FFFFFF", padding: "4px", fontFamily: "Arial", fontSize: "16px", whiteSpace: "nowrap", borderRadius: "2px"}, null, info);
	all.appendChild(content);
	return all;
}

vmarker.prototype.drawVenueIcon = function() {
	var bgs = ['', '#AAD6C1', '#B6D887', '#9CD088', '#B1DEE2']; var borders = ['', '#76B293', '#97B761', '#79AD64', '#84BABB']; 
	if (!this.base) {
		this.addimg({"logo": this.logoimg, "door": STATIC_ROOT + "img/door.png", "roof": STATIC_ROOT + "img/roof.png"});	//img file
		this.wrap = create("div", null, null, null);
		this.base = create("div", {position: "absolute", width: "50px", height: "31px", background: "#D0D5DB", borderBottom: "1px solid #B7B7B7"}, {className: "vmarker_base"}, null);//"#cfd5da"
		this.base.id = "main" + this.venuenameclean;
		this.addobj([this.base, this.logo, this.door, this.roof], 3);	
		this.hoverarea = create("div", {position: "absolute", cursor: "pointer", width: "50px", height: "30px", zIndex: 20}, null, null);
		this.addimg({"arro": STATIC_ROOT + "img/arro.png"});  //img file
		this.addobj([this.hoverarea], 5);
		this.addobj([this.arro], 2);	
		this.alert && this.drawAlertIcon();
		this.addclickhandler(this.hoverarea);
		this.addhoverhandler(this.hoverarea);
		this.addexithandler(this.hoverarea);
		google.maps.event.trigger(this, "domready");
		this.hidden = false;
	}
}

vmarker.prototype.drawVenueIconForClosed = function() {
	//if (!this.base) {
		this.addimg({"logo": this.logoimg, "door": STATIC_ROOT + "img/door.png", "roof": STATIC_ROOT + "img/roof.png", "shadow": STATIC_ROOT + "img/vmarker_shadow.png"});	//img file
		this.alert && this.drawAlertIcon();
		this.wrap = create("div", null, null, null);
		this.base = create("div", {position: "absolute", width: "50px", height: "31px", background: "#CECECE"}, null, null);
		this.base.id = "main" + this.venuenameclean;
		this.addobj([this.base, this.logo, this.door, this.roof, this.shadow], 3);
		google.maps.event.trigger(this, "domready");
//	}
}

vmarker.prototype.drawClosedIcon = function() {
if (!this.dot){
	this.addimg({"dot": STATIC_ROOT + "img/arro_full.png"});  //img file
	this.hoverarea = create("div", {position: "absolute", cursor: "pointer", width: "10px", height: "10px", zIndex: 19}, null, null);
	this.addobj([this.dot], 3);
	this.addobj([this.hoverarea], 5);
	this.addclickhandler(this.hoverarea);
	this.addhoverhandler(this.hoverarea);
	this.addexithandler(this.hoverarea);	
	google.maps.event.trigger(this, "domready");
	this.hidden = true;
	}
}

vmarker.prototype.drawAlertIcon = function() {
	this.alerticon = this.putimg(STATIC_ROOT + "img/alert.png");  //img file
	this.alerticon.style.display = "inline";
	this.getPanes()[this.pane].appendChild(this.alerticon);
}
vmarker.prototype.drawFeatures = function() { // drawFeatures
	if (!this.features) {
		this.features = createC("div", {className: "vmarker_features", id: "features" + this.venuenameclean});
		this.venuenamebox = create("div", null, {className: "vmarker_venuename"}, this.venuename);
		if (pseudo.db[sanitize(this.venuename)]){
			for (var i=0; i < pseudo.db[sanitize(this.venuename)][0][0].length; i++){
				var band = pseudo.db[sanitize(this.venuename)][0][0][i];
				this['band' + (i + 1)] = this.bandtab(band.bandname,band.genre,band.albumsrc); // bandtabs
				this.addobj([this['band' + (i + 1)]], 3);
			}
		}
		if(this.hidden){
			this.drawVenueIconForClosed();
			this.dot.src = STATIC_ROOT + "img/arrofull2.png";   //img file
			this.positionElements([[this.base, -6, 30], [this.logo, -9, 27], [this.door, -37, 23], [this.roof, -6, 39], [this.shadow, -6, 0]]);
			this.hoverarea.style.width = "52px";
			this.hoverarea.style.height = "34px";
			this.hoverarea.style.zIndex = 21;
			this.positionElements([[this.hoverarea, -3, 30]]);
			this.mouseover = true;
		}
		if (this.bands){
			var add = 0;
			var vert = (this.bands.length * -65) - 22;
			for (i in this.showinfo){ // show info boxes
				if (this.showinfo.hasOwnProperty(i)) {
					this['showInfoTab' + i] = this.showInfoTab(this.showinfo[i], "green");
					this.getPanes()[this.pane].appendChild(this['showInfoTab' + i]);
					this.positionconvert(this['showInfoTab' + i], (-56 - add), vert);
					add += parseInt((jQuery(this['showInfoTab' + i]).css("width"))) + 5;
				}
			}
			if (this.hasalert){
					this.alertmessage = this.showInfoTab(this.alertm, "red");
					this.getPanes()[this.pane].appendChild(this.alertmessage);
					this.positionconvert(this.alertmessage, (-60 - add), vert);
			}
		}
		this.maptime = create("div");
		if (this.bands){
			this.maptime.innerHTML = maptime + ":";
		} else {
			this.maptime.innerHTML = "no show " + maptime + ".";
		}
		this.applystyles({fontFamily: "Arial", fontSize: "14px", position: "Absolute", whiteSpace: "nowrap"},this.maptime);
		this.addobj([this.maptime], 3);
		this.features.appendChild(this.venuenamebox);
		this.addobj([this.features], 3);
		
		google.maps.event.trigger(this, "domready");
	}
}

vmarker.prototype.addclickhandler = function(x) {
	this.clicklistener = google.maps.event.addDomListener(x, 'click', this.returnclick());
}
vmarker.prototype.addhoverhandler = function(x) {
	this.hoverlistener = google.maps.event.addDomListener(x, 'mouseover', this.returnhover());
}
vmarker.prototype.addexithandler = function(x) {
	this.exitlistener = google.maps.event.addDomListener(x, 'mouseout', this.returnexit());
}

vmarker.prototype.returnclick = function() {
	var me = this;
	return function() {
		addInfobox(me, 'venue');
		me.hoverleave();
	}
}
vmarker.prototype.returnhover = function() {
	var me = this;
	return function() {
		me.hoveraddons();
	}
}
vmarker.prototype.returnexit = function() {
	var me = this;
	return function() {
		if (me.mouseover) {
			me.hoverleave();
		}
	}
}
vmarker.prototype.alertAnimate = function(){
		//if (this.alertin){
		//	this.positionconvert(this.alerticon, -65, 60);
		//	this.alertin = false;
		//} else if (!this.alertin) {
		//	this.positionconvert(this.alerticon, -60, 55);
		//	this.alertin = true;
		//}
}
vmarker.prototype.positionconvert = function(a, b, c) {
	var pixPosition = this.getProjection().fromLatLngToDivPixel(this.position);
	a.style.left = (Math.round(Number(pixPosition.x)) - b) + "px";
	a.style.top = (Math.round(Number(pixPosition.y)) - c) + "px";
}
vmarker.prototype.draw = function() { //runs on every zoom in/out
	var me = this;
	for (object in this.markerobjects){
		$(this.markerobjects[object]).remove();
		if(this.base) this.base = null;
		if(this.dot) this.dot = null;
	}
	this.markerobjects = [];
	if (this.features) {
		this.drawFeatures(); //keeps hover objects in the right place ',>)
		this.positionconvert(this.features, -19, 12);
	}
	window.clearInterval(me.interval);
	this.interval = null;
	if (maptime_src == 0) { var p = 0 } else { var p = 1 };
	if (pseudo.db[sanitize(this.venuename)] && pseudo.db[sanitize(this.venuename)][p][0].length != 0){ //decide whether to draw open or closed vicon
		this.drawVenueIcon();
		this.positionElements([[this.base, -6, 32], [this.logo, -9, 27], [this.door, -37, 24], [this.roof, -6, 39], [this.hoverarea, -6, 29], [this.arro, -3, 7]]);
	} else {
		this.drawClosedIcon();
		this.positionElements([[this.dot, -3, 19], [this.hoverarea, -3, 6]]); //dot for 14x14: -3, 6	
	}
	if (this.alert) {
		this.positionconvert(this.alerticon, -50, 33);
		if (!this.interval){
			var me = this;
			this.interval = window.setInterval(function(){me.alertAnimate();}, 500);
		}
	}
	
}

vmarker.prototype.positionElements = function(a){
	for (var i = 0; i < a.length; i++){
		this.positionconvert(a[i][0], a[i][1], a[i][2]);
	}
}

vmarker.prototype.hoveraddons = function() { // MOUSE OVER POSITIONING AND EFFECTS
	this.mouseover = true;
	if (!this.featuresStatus) {
		this.drawFeatures();
		$(this.alerticon).remove();
		var me = this;
		window.clearInterval(me.interval);
		this.interval = null;		
		this.positionElements([[this.features, -56, 29], [this.maptime, -63, -1]]);
		//uncomment next line to enable smooth open
		//$(this.features).animate({width: "toggle"}, 0);$(this.features).animate({width: "toggle"}, 200); 
		//I know this isn't exactly elegant coding but toggle is shitting on me
		var add = 0; 
		if (this.bands){
			for (var i = 0; i < this.bands.length; i ++){
				this.positionconvert(this['band' + (i + 1)], -56, (-22 + add));
				add -= 65;
			}
		}
		
		this.featuresStatus = true;
		this.alert = false;
		
		//for (var o = 0; o < currentvmarkers.length; o++){
		//	!currentvmarkers[o].hidden && currentvmarkers[o].venuename != this.venuename && currentvmarkers[o].ghost(); //dec clean code ',>)
		//}	
		
		
		this.awareness();
	}
}




vmarker.prototype.ghost = function(){
	for (var i = 0; i < this.markerobjects.length; i++){
		//$(this.markerobjects[i]).animate({opacity: "0.15"}, 200);
		this.markerobjects[i].style.opacity = "0.2";
	}
}
vmarker.prototype.deghost = function(){
	for (var i = 0; i < this.markerobjects.length; i++){
		//$(this.markerobjects[i]).animate({opacity: "1"}, 200);
		this.markerobjects[i].style.opacity = "1";
	}
}

//attempt at making the vmarkers aware of their surroundings, hah

vmarker.prototype.awareness = function(){
	var myPosStart = this.getProjection().fromLatLngToDivPixel(this.position);
	
	var currentXvalues = [];
	var currentYvalues = [];
	
	for (var i = 0; i < currentvmarkers.length; i++){
		var pos = this.getProjection().fromLatLngToDivPixel(currentvmarkers[i].position);
		var x = Math.round(Number(pos.x));
		parseInt(x);
		currentXvalues.push(x);
		var y = Math.round(Number(pos.y));
		parseInt(y);
		currentYvalues.push(y);
	}
	//currentXvalues.sort();
	//currentYvalues.sort();
	
	//if (!this.hidden){
		for (var i = 0; i < currentXvalues.length; i ++){ //check for literal overlap of the venue icons
			if (currentvmarkers[i].venuename == this.venuename){
				//do nothing
			} else if (currentXvalues[i] >= (Math.round(Number((myPosStart.x))) + 50) || currentXvalues[i] <= (Math.round(Number((myPosStart.x))) - 50)){
				//do nothing
			} else if (currentYvalues[i] >= (Math.round(Number((myPosStart.y))) + 39) || currentYvalues[i] <= (Math.round(Number((myPosStart.y))) - 39)){
				//do nothing
			} else if (!currentvmarkers[i].hidden){
				c(currentvmarkers[i].venuename + " is in " + this.venuename + "'s way!"); //freak the fuck out
				currentvmarkers[i].ghost();
				this.deghostall.push(currentvmarkers[i]);
			}
		}
		
		for (var i = 0; i < currentXvalues.length; i ++){ //check underlap (lol)
			if (currentvmarkers[i].hidden && currentvmarkers[i].venuename != this.venuename){
				if (currentXvalues[i] >= (Math.round(Number((myPosStart.x))) + 30) && currentXvalues[i] <= (Math.round(Number((myPosStart.x))) + 150)){
					if (currentYvalues[i] >= (Math.round(Number((myPosStart.y))) - 100) && currentYvalues[i] <= (Math.round(Number((myPosStart.y))) + 200)){
					currentvmarkers[i].ghost();
					this.deghostall.push(currentvmarkers[i]);
					}
				}
			}
		//}
	}	 
}
vmarker.prototype.hoverleave = function() {
	nullify([this.features]);
	if(this.hidden){
		nullify([this.base, this.door, this.roof, this.logo, this.shadow]);
	}	
	if(this.hidden){
			this.hoverarea.style.width = "10px";
			this.hoverarea.style.height = "10px";
			this.positionElements([[this.hoverarea, -3, 6]]);
			this.dot.src = STATIC_ROOT + "img/arro_full.png";   //img file
			this.hoverarea.style.zIndex = 19;
	}

	if (this.bands){
		for (var i = 0; i < this.bands.length; i ++){
		$(this['band' + (i + 1)]).remove();
		}
		this.hoverarea.style.zIndex = 20;
	}
	for (i in this.showinfo){ // show info boxes
		if (this.showinfo.hasOwnProperty(i)) {
			$(this['showInfoTab' + i]).remove();
		}
	}
	if (this.hasalert){
		$(this.alertmessage).remove();
	}
	$(this.maptime).remove();
	this.features = null;
	this.featuresStatus = null;
	var me = this;
	if (this.alert){
		this.drawAlertIcon();
		this.positionconvert(this.alerticon, -60, 55);
		this.interval = window.setInterval(function(){me.alertAnimate();}, 500);
	}
	for (var o = 0; o < currentvmarkers.length; o++){
			!currentvmarkers[o].hidden && currentvmarkers[o].venuename != this.venuename && currentvmarkers[o].deghost();
	}
	for (var r = 0; r < this.deghostall.length; r++){
		this.deghostall[r].deghost();
	}
	this.mouseover = false;
}
vmarker.prototype.setOptions = function(opt_opts) {
	if (typeof opt_opts.position !== "undefined") {
		this.setPosition(opt_opts.position);
	}
}
vmarker.prototype.setPosition = function(latlng) {
	this.position = latlng;
	if (this.base && this.features) {
		this.draw(); 
	}
}
vmarker.prototype.open = function(map) {
	this.setMap(map);
	currentvmarkers[currentvmarkers.length] = this;
}

vmarker.prototype.alertmove = function(){
	this.positionconvert(this.alerticon, -80, 55);
}
