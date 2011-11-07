//trying to chill
function get(a){
	return document.getElementById(a);
}

function doctitle(a){
	document.title = a;
}
function create(a, b, c, d){ // typeof, styles, other attributes, innerHTML. omit options b, c, or d with null
	var x = document.createElement(a);
	for (var i in [b,c]){
		if (!i) i = {};
	}
	for (i in b){
		if (b.hasOwnProperty(i)) {
			x.style[i] = b[i];
		}
	}
	for (i in c){
		if (c.hasOwnProperty(i)) {
			x[i] = c[i];
		}
	}
	x.innerHTML = d || null;
	return x;
}


function createC(a, b, c, d){ // typeof, styles, other attributes, innerHTML. omit options b, c, or d with null
	var x = document.createElement(a);
	for (i in b){
			x[i] = b[i];
	}
	c = c || null;
	x.innerHTML = c;
	d = d || [];
	for (e in d){
		x.appendChild(d[e]);
	}
	return x;
}

function append(a){
	appendChild(a);
}
function nullify(a){
	for (i in a){
		$(a[i]).remove();
		a[i] = null;
	}
}
function repeat(x, b){
	for (var i = 0; i < x; i++){
		b()
	}
}
function appendobj(a){
	for (var i in a){
		a[i][0].appendChild(a[i][1]);
	}
}

function window_appendObj(a, y){
	for (var i in a){
		window[a[i][0] + y].appendChild(window[a[i][1] + y]);
	}
}
function timer(a, b){
	window.setInterval(a, b);
}
function delay(a, b){
	window.setTimeout(a, b);
}
function appendobj(a){
	for (var i = 0; i < a.length; i++){
		a[i][0].appendChild(a[i][1]);
	}
}
function c(x){
	console.log(x || "!");
}
function sanitize(x){
	var x = x.split(' ').join('').split(',').join('')
	x = x.split('-').join('');
	return x;
}
function rem(x){
	$(x).remove();
}




