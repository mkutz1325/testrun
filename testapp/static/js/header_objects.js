//
//	   Bandscape DOM objects (permalinkButton, pseudo_vmarker, infobox, timecontrol, mapFD) (C) Bandscape 2011
//	   author: Artur Sapek
//

var STATIC_ROOT = "static/";   //tells js where to look for static files in django interface

function permalinkButton(x){
	var args = x;
	var _root = this;
	this.open = false;
	this.all = createC("div", {className:"ib_permalinkButtonWrapper"});
	this.button = createC("a", {className: "ib_permalinkButton", href: "#"}, "Permalink");
	this.button.addEventListener.apply(this.button, ["click", function(){ _root.toggle(); }, false]);
	this.all.appendChild(this.button);
	this.writePermalink = function(){ //done only once, right away
		this.permalink_value = "http://bandscape.net/demo";
		if (args){ 
			this.permalink_value += "?";
			for (var arg = 0; arg < args.length; arg++){
				this.permalink_value += (args[arg][0] + "=" + args[arg][1]);
				if (arg != (args.length - 1)) this.permalink_value += "&";  
			}
		}
		if (maptime_src != "0"){
					if (!args) this.permalink_value += "?";
					if (args) this.permalink_value += "&";
					this.permalink_value += "date=" + maptime_src;
		}
	}
	this.toggle = function(){
		if (!this.open){
			this.textbox = createC("input", {type: "text", className: "ib_permalinkContents", value: this.permalink_value});
			_root.all.appendChild(this.textbox);
			this.textbox.select();
			$(this.textbox).blur(function(){_root.toggle(); });			
			this.open = true;
		} else {
			$(this.textbox).remove();
			this.open = false;
		}
	}
	this.writePermalink();
	return this.all;
}


function pseudo_vmarker(){ 
	var parts = [["all","div"], ["base","div"], ["logo","img",STATIC_ROOT + "img/coffee.png"], ["door","img",STATIC_ROOT + "img/door.png"], ["roof","img",STATIC_ROOT + "img/roof.png"], ["shadow","img",STATIC_ROOT + "img/vmarker_shadow.png"]];  //img file
	for (var i = 0; i < parts.length; i++){
		this[parts[i][0]] = createC(parts[i][1], {className:"pseudoVmarker_" + parts[i][0]});
		if (parts[i][2]) this[parts[i][0]].src = parts[i][2];
	}
	appendobj([[this.base, this.logo], [this.base, this.door], [this.all, this.roof], [this.all, this.base], [this.all, this.shadow]]);
	return this.all;
}

function infobox(y, subject, type, top){
	var _root = this;
	this.keepopen = false;
	this.append = [];
	this.subheading = function(){
		if (type=="venue" && pseudo.db[sanitize(subject.venuename)]){ var t = "shows " } else { var t = "no show "};
		if (type=="band" && bandSchedule(subject).length>0){ var t = "upcoming shows in " } else { var t = "no shows in "};
		var cssKeyword = {"venue":"time","band":"city"}[type];
		this.beginning = createC("span", {className:"infobox_" + cssKeyword + "Nav_precursor"}, t);
		this.middle_wrapper = createC("div", {className: "infobox_" + cssKeyword + "Nav_wrapper"});
		if(type=="venue") { 
			this.middle = createC("div", {className: "infobox_" + cssKeyword + "Nav_all"}, maptime);
			$(this.middle_wrapper).mouseenter(function(){
				if(!_root.keepopen){
					this.appendChild(this.dropdown = createC("div", {className:"infobox_" + cssKeyword + "Nav_all_dropdown"}));
					$(this.dropdown).mouseenter(function(){ _root.keepopen = true; }).mouseleave(function(){ _root.keepopen = false; });
					for (var d in analyzeDates()){
						this.dropdown.appendChild(createC("div",  {className:"infobox_all_dayOption_content"}, analyzeDates()[d]));
					}
				}
			}).mouseleave(function(){
				if (!_root.keepopen){
					rem(this.dropdown);
					_root.keepopen = false;
				}
			});
		} else if(type=="band"){
			this.middle = createC("div", {className: "infobox_" + cssKeyword + "Nav_all"}, "Seattle");
		}
		this.end = createC("span", {className:"infobox_" + cssKeyword + "Nav_precursor"}, ":");
		this.all = createC("div", {className: "ib_infotime"})
		appendobj([[this.all, this.beginning], [this.all, this.middle_wrapper], [this.middle_wrapper, this.middle], [this.all, this.end]]);
				return this;
	}
	this.elements = [["all", "div", {id: "infobox" + y, className: "infobox"}],["wrapper", "div", {id: "infoboxwrap" + y, className: "infoboxWrap"}],
	["left", "div", {className: "ib_left"}],["right", "div", {className: "ib_right"}],["title", "div", {className: "ib_subline ib_heading"}, subject.infoheading]];
	if (type == "band" || type == "venue"){ 
		 for(var il = 1; il <= 3; il++){
		 	this.elements = this.elements.concat([[["infoline" + il], "div", {className: "ib_infoline il_" + il}, subject["infoline" + il]]])
		}
	}
	this.infotime = new this.subheading().all
	if (type == "band") this.albumCover = createC("img", {className:"ib_albumCover",src:subject.albumsrc}); 
	for (var x = 0; x < this.elements.length; x++){
		this[this.elements[x][0]] = createC(this.elements[x][1], this.elements[x][2], this.elements[x][3]);
	}
	this.all.style.top = (top || "-158") + "px"; 
	if (type == "band") this.append.push([this.left, this.albumCover],[this.right,this.infotime]);
	if (type == "venue") this.append = this.append.concat([[this.left, new pseudo_vmarker()]]); 
	this.append = this.append.concat([[this.wrapper, this.left],[this.wrapper, this.right],[this.right,this.infotime],[this.left, this.title],
		[this.all, this.wrapper],[this.left, this.infoline1],[this.left, this.infoline2],[this.left, this.infoline3],
		 [this.left, new permalinkButton([["focus",sanitize(subject.infoheading)]])]]);
	for (var y = 0; y < this.append.length; y ++){
		this.append[y][0].appendChild(this.append[y][1]);
	}
	var typeFlipped = {"venue": "band", "band": "show"}[type];	
	if (type == "venue" && pseudo.db[sanitize(subject.venuename)]){ //if there is a show tonight
		var maptimeParsed = maptimeParse(maptime_src);
		this.right_entries = createC("div", {className:"ib_right_entries"});
		var _top_ = 0;
		this.entries = [];
		var subjectClean = subject.venuename.split(' ').join('').toString();
		var dbentry = fillerDateAnalysis(subjectClean);
		for (var e = 0; e < maptimeParsed[1].length; e ++){
					if(dbentry){
				this["entry" + e] = new showEntry(this, subject, e, typeFlipped);
				this["entry" + e].entry.style.top = _top_ + "px";
				this.entries.push(this["entry" + e]);
				this.right_entries.appendChild(this["entry" + e].entry)
				_top_ += 50;
			}
		} 		this.right.appendChild(this.right_entries);
		
	}
	else if(type=="band" && bandSchedule(subject).length>0){
			this.entries = [];
			var schedule = bandSchedule(subject);
			var maptimeParsed = maptimeParse(maptime_src);
			this.right_entries = createC("div", {className:"ib_right_entries"});
			var _top_ = 0;
			if (schedule.length != 0){
				for (var e = 0; e < schedule.length; e++){
					var show = schedule[show];
					this["entry" + e] = new showEntry(this, subject, e, typeFlipped, schedule);
					this["entry" + e].entry.style.top = _top_ + "px";
					this.entries.push(this["entry" + e].entry);
					this.right_entries.appendChild(this["entry" + e].entry)
					_top_ += 50;
				}
				this.right.appendChild(this.right_entries);
			}
		}

	this.rightWidth = function(){
		var x = Math.min(770 - Math.max(parseInt((jQuery(this.title).css("width"))),parseInt((jQuery(this.infoline2).css("width"))),parseInt((jQuery(this.infoline3).css("width")))), 650);
		this.right.style.width = x + "px";
		if(this.right_entries) this.right_entries.style.width = (x - 5) + "px";
	}
	this.setBandtabMargin = function(){
		if(subject.bands){
			for (var u in this.entries){
				for (var i = 0; i < pseudo.db[sanitize(subject.venuename)][1][0].length; i++){
					if (i != 0) { 
						var y = parseInt((jQuery(this.entries[u]["newBandTab" + (i - 1)].bandname).css("width")));
						this.entries[u]["newBandTab" + i].all.style.marginLeft = (y + 8) + "px";
					}
						if (i == 0) { 
							var x = parseInt((jQuery(this.entries[u]["newBandTab" + 1].bandname).css("width")));
						} else {
							x += parseInt((jQuery(this.entries[u]["newShowinfoTab" + (i - 1).toString()].hoverwrapper).css("width"))) + 8;
						}
						this.entries[u]["newShowinfoTab" + i.toString()].hoverwrapper.style.marginLeft = (x + 8) + "px";
				}
			}
		}
	}
	this.redraw = function(){
		rem(this.infotime);
		this.infotime = new this.subheading().all;
		this.right.appendChild(this.infotime);
	}
	return this;
}
function maptimeParse(x){ //input -> maptime_src code; output -> string label and array of corresponding Date objects
	if(x == 0){ 
		return ["tonight",[new Date()]];
	} else if(x == 1){ 
		var tomo = new Date(); tomo.setDate(tomo.getDate()+1); return ["tomorrow night",[tomo]] 
	} else if(x == 2){ 
		var fri = new Date(), sat = new Date(); fri.setDate(sat.getDate()+(5 - fri.getDay())); sat.setDate(sat.getDate()+(6 - sat.getDay())); return ["this weekend",[fri, sat]];
	} else if(x == 3){
		var week = []; var y = 0; for (var i = 0; i < (8 - new Date().getDay()); i ++){var g = new Date(); g.setDate(g.getDate() + y); y ++; ;week.push(g);} return ["this week", week];
	} else if(x == 4){
		var fri = new Date(), sat = new Date(); fri.setDate(sat.getDate()+(12 - fri.getDay())); sat.setDate(sat.getDate()+(13 - sat.getDay())); return ["next weekend",[fri, sat]];
	} else if(x == 5){ 
		var week = []; var y = 0; for (var i = 0; i < 7; i ++){var g = new Date(); g.setDate(g.getDate() + (8 - g.getDay()) + y); y ++; week.push(g);} return ["next week", week];
	} else if(x.length >= 4){
		var month = parseInt(x.substring(0,2));
		var day = parseInt(x.substring(2,4));
		if (x[0] == "0") month = parseInt(x[1]);
		if (x[2] == "0") day = parseInt(x[3]);
		if (day < {1:31, 2:28, 3:31, 4:30, 5:31, 6:30, 7:31, 8:31, 9:30, 10:31, 11:30, 12:31}[month - 1]) {
			var year = 2011;
			if (x.substring(4,6)){ year = parseInt("20" + x.substring(4,6)); }
			var specific = new Date(); specific.setFullYear(year, month, day);
			var string = "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(',')[specific.getDay()] + ", " + "Jan,Feb,March,April,May,June,July,Aug,Sept,Oct,Nov,Dec".split(',')[specific.getMonth()] + " " + specific.getDate();
			return [string,[specific]];
		}
	} 
}
function fillerDateAnalysis(x){
	var spliceMap = {0: [0,1], 1: [1,2], 2: [5,7], 3: [0,7], 4: [5,7], 5: [0,7]};
	var shows = [];
	var random = Math.round(Math.random() * 5);
	var start = random;
	var end = random + 1;
	if (spliceMap[maptime_src]){ start = spliceMap[maptime_src][0]; }
	if (spliceMap[maptime_src]){ end = spliceMap[maptime_src][1]; }
	for (var i = start; i < end; i++){
		shows.push(pseudo.db[x][i]);	
	}
	return shows;
}
	
	

function analyzeDates(){ //returns list of maptime options based on the day of the week
	var tonight = maptimeParse(0)[1][0].getDay();
	var days = ["tonight", "tomorrow night"];
	if ([0,5,6].indexOf(tonight) == -1){
		days.push("this weekend");
	} 
	if(tonight == 5){
		days.push("this Saturday");
	}
	if ([1,2,3].indexOf(tonight) == -1){
		days.push("this week");
	}
	days.push("next weekend", "next week", "specify...");
	return days;
}
function dateMarker(e){
	var _root = this;
	var dateobject = new maptimeParse(maptime_src);
	var day = "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(',')[dateobject[1][e].getDay()];
	var all = createC("div", {className:"dateMarker_all"});
	var dayOfWeek = createC("div", {className:"dateMarker_dayOfWeek"}, day);
	var dateNumber = createC("div", {className:"dateMarker_date"}, dateobject[1][e].getDate());
	appendobj([[all, dayOfWeek], [all, dateNumber]])
	return all;
}
function showEntry(that, subject, e, type, schedule){
	var dateobject = new maptimeParse(maptime_src);
	var dateobj = dateobject[1][e]
	var day = "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(',')[dateobj.getDay()];
	var month = "Jan,Feb,March,April,May,June,July,Aug,Sept,Oct,Nov,Dec".split(',')[dateobject[1][e].getMonth()];
	this.entry = createC("div", {className:"ib_showEntry"});
	this.entry.appendChild(new dateMarker(e));
	if (dateobj.getMonth().toString().length == 1){
		var monthNo = "0" + dateobj.getMonth().toString();
	}	
	if (dateobj.getDate().toString().length == 1){
		var dateNo = "0" + dateobj.getDate().toString();
	}
	var maptimesrc_this = monthNo + dateNo;
	if (type == "band"){ //switch up
	var src = fillerDateAnalysis(subject.venuename.split(' ').join(''))[e]; 
	for (var i = 0; i < src.length; i++){
		var band = src[0][i];
		var u = false;
		if(i == 0) u = true;
		this["newBandTab" + i.toString()] = new bandtabSmall(band.bandname, band.albumsrc, u, band)
		var p = this["newBandTab" + i.toString()];
		this.entry.appendChild(p.all);
	}
	for (var i = 0; i <= 1; i++){
		var infolist = ['price', 'time'];
		var info = pseudo.db[sanitize(subject.venuename)][e][1][infolist[i]];
		this["newShowinfoTab" + i.toString()] = new showinfoTab(info)
		var p = this["newShowinfoTab" + i.toString()];
		this.entry.appendChild(p.all);
	}
	} else if(type == "show"){
		var vmarker = new pseudo_vmarker();
		vmarker.style.left = "50px";
		vmarker.style.top = "2px"; 
		var venuename = createC("div", {className:"infobox_pseudoVM_venuename"}, window[schedule[e][0]].venuename);
		this.with_text = createC("div", {className:"infobox_pseudoVM_with"}, 'with');
		this.entry.appendChild(venuename);
		this.entry.appendChild(this.with_text);
		this.entry.appendChild(vmarker);
		for (other_band in schedule[e][1][0]){
			var band = schedule[e][1][0][other_band];
			if (band.bandname != subject.bandname){
				var bandtab = new bandtabSmall(band.bandname, band.albumsrc, false, band).all;
				this.entry.appendChild(bandtab);
				bandtab.style.left = "60px";
			}
		}
	}
	$(this.entry).click(function(e){UI.timeControl.redraw(day + ", " + month + " " + dateobj.getDate());}); 	
	that.entries.push(this)
	return this;
}
function timeControl(){
	var _root = this;
	this.keepopen = this.keepCityPopup = false;
	this.all = createC("div", {className:"timeControl_all"})
	this.container = createC("div", {className:"timeControl_container"});
	this.content = createC("div", {className:"timeControl_maptime_content"}, maptime);
	this.text_browsing = createC("div", {className:"timeControl_regText"}, "shows");
	this.text_browsing.style.paddingLeft = "16px";
	this.text_in = createC("div", {className:"timeControl_regText"}, "in");
	this.city_container = createC("div", {className:"timeControl_city"});
	var maptime_map = {'tonight':0,'tomorrow night':1,'this weekend':2,'this week':3,'next weekend':4,'next week':5};
	this.city = createC("div", {className:"timeControl_city_content"}, "Seattle");
	this.days = analyzeDates();
	var g = this.days.indexOf(maptimeParse(maptime_src)[0]); if(g>-1){ this.days.splice(g,1); }				
	appendobj([[this.all, this.text_browsing], [this.all, this.container], [this.all, this.text_in], [this.all, this.city_container], [this.city_container, this.city], [this.container, this.content]]);
	this.dropdown = function(){
		this.days = analyzeDates();
		var g = this.days.indexOf(maptimeParse(maptime_src)[0]); if(g>-1){ this.days.splice(g,1);  }
		var x = this.days;
		this.dropdown_container = createC("div", {className:"timeControl_dropdown_container"});
		$(this.dropdown_container).mouseenter(function(){_root.keepopen = true;}).mouseleave(function(){_root.keepopen = false;});
		this.container.appendChild(this.dropdown_container);
		for (var t = 0; t < x.length; t++){
			this.dropdown_container.appendChild(new this.dayOption(x[t]));	
		}
	}
	this.dayOption = function(x){
		this.container = createC("div", {className:"timeControl_dayOption_container"});
		this.content = createC("div",  {className:"timeControl_dayOption_content"}, x);
		$(this.container).click(function(){
			maptime_src = maptime_map[x];
			maptime = maptimeParse(maptime_src)[0];
			redrawVmarkers();
			var p = _root.content.innerHTML; _root.content.innerHTML = x; 
			_root.content.className = "timeControl_maptime_content"; _root.keepopen = false;  _root.days[_root.days.indexOf(x)] = p;  
			_root.days[_root.days.indexOf(p)] = x; $(_root.dropdown_container).remove();}).mouseenter(function(){_root.content.className = "timeControl_content_drained";
			});
		this.container.appendChild(this.content);
		return this.container;
	}
	this.cityPopup = function(){
		var betaonly = createC("div", {className: "timeControl_city_popup_betaonly"}, "bandscape is currently in a <a href=\"#\">Seattle-only beta</a>");
		_root.cityPopupContainer = createC("div", {className: "timeControl_city_popup"}, "<h1>Seattle</h1>", [betaonly]);
		$(_root.cityPopupContainer).mouseenter(function(){_root.keepCityPopup = true;}).mouseleave(function(){_root.keepCityPopup = false;});
		this.city_container.appendChild(_root.cityPopupContainer);
	}
	this.redraw = function(x){
		this.content.innerHTML = x;
	}
	//event listeners
	$(this.city_container).mouseenter(function(){
		if(!_root.keepCityPopup) _root.cityPopup();
	}).mouseleave(function(){
		if(!_root.keepCityPopup) $(_root.cityPopupContainer).remove();
	});
	$(this.container).mouseenter(function(){
		if(!_root.keepopen){ _root.dropdown(); }
	}).mouseleave(function(){
		if(!_root.keepopen){
		$(_root.dropdown_container).remove();
		_root.content.className = "timeControl_maptime_content";
	}});
	return this;
}



function mapFilterDialog(){ //dank
	// v.1 possible filters : genre, price, time, type of venue
	var _root = this;
	var options = [];
	var dropdownFocus = false;
	var _top_ = 0;
	this.init = function(){
		this.addButton = createC("img", {src: STATIC_ROOT + "img/add_filter.png", className: "mapFD_add_button"});  //img file
		this.dropdown = createC("div", {className: "mapFD_dropdown_container"}); 
		this.wrapper = createC("div", {className: "mapFD_add_wrapper"}, null, [this.addButton]);
		this.all = createC("div", {className: "mapFD_add_all"}, null, [this.wrapper]);
		$(this.wrapper).click(function(){
			rem(_root.wrapper);
			_root.all.appendChild(_root.option(["genre", "featuring ", "@genre@purp", "music"]));
			_root.all.appendChild(_root.option(["price", "for ", "@price@pink", "or less"]));
			_root.all.appendChild(_root.option(["time", "starting ", "@before@purp", "@time@pink"]));
			_root.all.appendChild(_root.option(["venuetype", "playing at ", "@venue type@purp"]));
		});	
		this.all.style.top = 300 + (mapFilterCount * 62) + "px";
	}
	
	this.option = function(x){
		this.hoverarea = createC("div", {className:"mapFD_add_option_hoverarea"});
		this.master_wrapper = createC("div", {className:"mapFD_add_option_wrapper"});
		this.wrapper = createC("div", {className:"mapFD_add_option"});
		options.push(this.master_wrapper, this.wrapper, this.hoverarea);
		for (var i = 1; i < x.length; i ++){
			if (x[i][0] == "@"){ //fake dropdown or just text?
				this["pc" + i] = new this.falseOption(x[i]);
			} else {
				this["pc" + i] = createC("div", {className:"mapFD_add_option_regText"}, x[i]);
			}
			$(this.wrapper).prepend(this["pc" + i]);
		}
		this.master_wrapper.appendChild(this.wrapper);
		this.wrapper.appendChild(this.hoverarea); 
		this.hoverarea.style.width = "170px";
		this.master_wrapper.style.top = 0 + _top_ + "px";
		_top_ += 47;
		$(this.hoverarea).mouseenter(function(){_root.dropdownFocus = true;}).mouseout(function(){_root.dropdownFocus = false; _top_ = 0;}).click(function(){_root.commit(x);});
		if(!_root.dropdownFocus){ $(_root.all).mouseleave(function(){ for (i in options){rem(options[i])} rem(_root.all); _root.init(); get("map").appendChild(_root.all)})};
		return this.master_wrapper;
	}
	this.optionfiller = function(x){
		this.wrapper = createC("div", {className:"mapFD_add_option mapFD_add_option_permanent"});
		options.push(this.wrapper, this.hoverarea);
		for (var i = 1; i < x.length; i ++){
			if (x[i][0] == "@"){ //fake dropdown or just text?
				this["pc" + i] = new this.falseOption(x[i]);
			} else {
				this["pc" + i] = createC("div", {className:"mapFD_add_option_regText"}, x[i]);
			}
			$(this.wrapper).prepend(this["pc" + i]);
		}
		return this.wrapper;
	}
	this.falseOption = function(y){
		if( y.indexOf("@purp") != -1){ var scheme = "purple" } else { var scheme = "pink" };
		var y = y.substring(1,y.length - 5); // remove the color tag
		this.falseOptionContent = createC("div", {className:"mapFD_add_option_fakeOpt_content_" + scheme}, y);	
		this.falseOption = createC("div", {className:"mapFD_add_option_fakeOpt_container"}, null, [this.falseOptionContent]);
		return this.falseOption;
	}
	this.commit = function(x){
		rem(_root.all);
		_root.wrapper = createC("div", {className: "mapFD_add_wrapper"}, null);
		_root.all = createC("div", {className: "mapFD_add_all"}, null, [this.wrapper]); get("map").appendChild(_root.all); this.all.style.top = 300 + (mapFilterCount * 62) + "px";
		_root.all.appendChild(_root.optionfiller(x));
		mapFilterCount++;
		currentFD = new mapFilterDialog;
		get("map").appendChild(currentFD);
	}
	this.init();
	return this.all;
}
function bandtabSmall(name, albumsrc, first, band){
	var _root = this;
	this.all = createC("div", {className:"bandtabSmall_all", id:"band" + name});	
	var hoverwrapper = create("div", {}, {className: "bandtabSmall_wrapper", id:"wrapper" + name});
	var wrapper = create("div", {float: "left", display: "inline", position: "absolute", left: "28px"});
	this.bandname = create("div", {}, {className: "bandtabSmall_tab"});
	var bandnamespan = createC("span", {className:"bandtabSmall_name"},name);
	var album = create("img", {width: "28px", paddingBottom: "0px"}, {src: albumsrc || STATIC_ROOT + "img/blank.jpg"});  //img file
	appendobj([[hoverwrapper, album], [this.bandname, bandnamespan], [hoverwrapper, wrapper], [wrapper, this.bandname], [this.all, hoverwrapper]]);
	$(hoverwrapper).click(function(e){addInfobox(band, "band"); e.stopPropagation()});
}
function showinfoTab(info_content){
	var _root = this;
	this.all = createC("div", {className: "showinfoTab_all"});
	this.hoverwrapper = create("div", {float: "left", display: "inline", position: "absolute", left: "0px"});
	var wrapper = createC("div", {className: "showinfoTab_wrapper"});
	var info = createC("div", {className: "showinfoTab_tab"});
	var infospan = createC("span", {className:"showinfoTab_info"}, info_content);
	if (info_content.indexOf('$') != -1 || info_content.indexOf('Free') != -1){ info.className += " showinfoTab_price"; infospan.style.color = "#385B38";} else { info.className += " showinfoTab_time"; infospan.style.color = "#F7E4EC"; }
	appendobj([[info, infospan], [this.hoverwrapper, wrapper], [wrapper, info], [this.all, this.hoverwrapper]]);
	$(this.hoverwrapper).click(function(e){e.stopPropagation();});
}
function searchFunc(event){ //rewritten, working :)
	var root = this, input;
	this.possibles = [];
	this.initPossibles = function(input){
		for (band in bandsdb){
			var name = bandsdb[band].bandname.toLowerCase();
			if (name[0] == input.substring(0,1).toLowerCase()){
				root.possibles.push(bandsdb[band]);
			}
		}
		for (venue in vmarkers){
			var name = vmarkers[venue].venuename.toLowerCase();
			if (name[0] == input.substring(0,1).toLowerCase()){
				root.possibles.push(vmarkers[venue]);
			}
		}
	}

	this.analysis = function(){
		input = $('#bandscape_search').val();	
		if(root.possibles.length != 0){
			var newPossibles = [];
				for (var x = 0; x < root.possibles.length; x ++){
				if (root.possibles[x].bandname){ 
						var name = root.possibles[x].bandname.toLowerCase();
				} else {
						var name = root.possibles[x].venuename.toLowerCase();
				}
				if(name.substring(0, input.length) == input || name.split(',').join('').substring(0, input.length) == input){
					newPossibles.push(root.possibles[x]);
				}
			}
		root.possibles = newPossibles;
		//c(root.possibles);
		}
	}

	this.go = function(){
		if (root.possibles[0].bandname) { var type = 'band' } else { var type = 'venue' }
		addInfobox(root.possibles[0], type);
		root.possibles = [];
		$('#bandscape_search').blur();
		root.blur();
	}

	this.blur = function(){
		$('#bandscape_search').addClass('searchbox_grey').val('search');		
	}
	
	$('#bandscape_search').keypress(function(event){ 
		input = $(this).val();
		if (root.possibles.length == 0 && input.length == 1) {
			root.initPossibles(input);
		}
	}).keyup(function(event){
	input = $(this).val();		
	if (root.possibles.length == 1 && input.length >= 5) root.go();  
	if(root.possibles.length != 0) root.analysis(event);
	}).focus(function(){ $(this).removeClass('searchbox_grey').val('')}).blur(function(){ root.blur(); });
}


function bandSchedule(x){
	var shows = [];
	for (venue in pseudo.db){
		for (day in pseudo.db[venue]){
			var y = pseudo.db[venue][day][0].indexOf(x);
			if (y != -1){
				shows.push([pseudo.db[venue].name, pseudo.db[venue][day]]);
			}
		}
	}
	return shows;
}
