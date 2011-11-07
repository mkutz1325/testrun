//
//	   Main nav functions (C) Bandscape 2011
//	   author: Artur Sapek
//

jQuery.extend(jQuery.easing,{def: 'smoothoperator', swing: function (x, t, b, c, d) {
return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
}});
currentnav = null;
yNAV = mapFilterCount = 0;
jQuery.easing.def = "smoothoperator";
infoboxprogress = false;
currentInfobox = { subject: null }
w = window;
function loadInitialInfobox(){
	w["infobox" + yNAV] = createC("div", {id: "infobox" + yNAV, className: "infobox"});
	get("header").appendChild(w["infobox" + yNAV]);
}
function addInfobox(subject, type, instant){
	if (instant == true){
		var speed = 0;
	} else {
		var speed = 650;
	}
	if (!infoboxprogress){
		infoboxprogress = true;
		if (currentInfobox.subject === subject){
			nudgeInfoboxes();
			delay('infoboxprogress = false;', 1200); 
		} else {
		infoboxprogress = true;
		var y = yNAV;
		$(w["infobox" + y]).remove();
		w["infoboxObject" + y] = new infobox(y, subject, type)
		currentInfobox = w["infoboxObject" + y];
		w["infobox" + y] = currentInfobox.all;
		get('header').appendChild(w["infobox" + y])
		currentInfobox.rightWidth();
		currentInfobox.setBandtabMargin(); //required to get the layout right
		$(w["infobox" + y]).animate({top: "+=174px"}, speed); 
		if(y > 0){
			oldInfobox = w["infobox" + (y - 1)]
			$(oldInfobox).animate({top: "+=174px"}, speed); 
			delay('clickTarget_Below(oldInfobox);', 300); 
		}
		if(y > 1){
			$(w["infobox" + (y - 2)]).remove();
		}
		delay('infoboxprogress = false;', 1000); 
		yNAV ++;
		}
	}	
}
function clickTarget_Below(x){
	var y = yNAV;
	this.yvalue = y;
	var gobackClickTarget = createC("div", {className:"infoboxClickTargetBelow", id:"clicktarget" + (y - 2)});
	x.firstChild.appendChild(gobackClickTarget);
	$(gobackClickTarget).animate({opacity: "0"}, 0).animate({opacity: "1"}, 500).click(function(){ 
		 gobackInfobox(); $(this).remove(); });
	}; // animate clicktarget to fade in, so its not choppy

function clickTarget_Above(x){
	var y = yNAV;
	$('#clicktarget' + (yNAV - 1)).remove();
	var gobackClickTarget = createC("div", {className:"infoboxClickTargetAbove", id:"clicktarget" + (y)});
	x.firstChild.appendChild(gobackClickTarget);
	this.yvalue = y;
	$(gobackClickTarget).animate({opacity: "0"}, 0).animate({opacity: "1"}, 500).click(function(){$(this).removeClass('infoboxClickTargetAbove');goforwardInfobox();$(this).remove(); });
	}
function gobackInfobox(){
	if (!infoboxprogress){
		infoboxprogress = true;
		var speed = 650;
		var y = yNAV - 1;
		currentInfobox = w["infoboxObject" + (y - 1)];
		$(w["infobox" + (y + 1)]).animate({top: "-=174px"}, speed);
		$(w["infobox" + y]).animate({top: "-=174px"}, speed); 
		$(w["infobox" + (y - 1)]).animate({top: "-=174px"}, speed); 
		if (y >= 2){
			get("header").appendChild(w["infobox" + (y - 2)]);
			w["infobox" + (y - 2)].style.top = "362px";
			$(w["infobox" + (y - 2)]).animate({top: "-=174px"}, speed);
			belowInfobox = w["infobox" + (y - 2)]	 
			delay('clickTarget_Below(belowInfobox);', 300);

		}
		aboveInfobox = w["infobox" + (y)]	 
		delay('clickTarget_Above(aboveInfobox);', 300);
		delay('infoboxprogress = false;', 450);
		yNAV --;
	}
}
function goforwardInfobox(){
	if (!infoboxprogress){
		infoboxprogress = true;
		var speed = 650;
		var y = yNAV;
		currentInfobox = w["infoboxObject" + y];
		$(w["infobox" + y]).animate({top: "+=174px"}, speed); 
		$(w["infobox" + (y - 1)]).animate({top: "+=174px"}, speed);
		$(w["infobox" + (y - 2)]).animate({top: "+=174px"}, speed);
		$(w["infobox" + (y - 2)]).remove(); 
		if (w["infobox" + (y + 1)]){
			get("header").appendChild(w["infobox" + (y + 1)]);
			w["infobox" + (y + 1)].style.top = "-331px";
			$(w["infobox" + (y + 1)]).animate({top: "+=174px"}, speed); 
			aboveInfobox = w["infobox" + (y + 1)]	 
			delay('clickTarget_Above(aboveInfobox);', 300);
		}
		belowInfobox = w["infobox" + (y - 1)]	
		delay('clickTarget_Below(belowInfobox);', 300);
		delay('infoboxprogress = false;', 450);
		yNAV ++;
	}
}
function nudgeInfoboxes(){
	y = yNAV;
	$(w["infobox" + (y - 1)]).animate({top: "+=20px"},200).animate({top: "-=20px"},1000)
	$(w["infobox" + (y - 2)]).animate({top: "+=20px"},200).animate({top: "-=20px"},1000)
	$(w["infobox" + y]).animate({top: "+=20px"},200).animate({top: "-=20px"},1000)
}

function URLvars(){ //sets up the page that immediately loads
	windowVars = [];
	var variables = document.location.search;
	variables = variables.substring(1);
	var varPairs = variables.split('&');
	for (var i = 0; i < varPairs.length; i++){
		var varPair = varPairs[i].split('=');
		var name = varPair[0];
		var value = varPair[1];
		windowVars.push(varPair);			
	}
	maptime = "tonight";
	maptime_src = 0;
	for (entry in windowVars){
		if (windowVars[entry][0] == "date"){
			maptime_src = windowVars[entry][1];
			if (maptime_src.length > 1){ maptime_src = maptime_src.toString(); }
			maptime = new maptimeParse(maptime_src)[0];
		}
	}
	for (entry in windowVars){
		 if (windowVars[entry][0] == "focus"){
			for (var y in bandsdb){
				if (sanitize(bandsdb[y].bandname) == sanitize(windowVars[entry][1])){
					addInfobox(window[sanitize(windowVars[entry][1])], "band", true);
				}
			}
			for (x in venuesdb){
			if (sanitize(venuesdb[x][2]) == sanitize(windowVars[entry][1])){
				addInfobox(window[windowVars[entry][1]], "venue", true);
			}
		}
		}
		
	}
}

	














