var Cal = function(){};

Cal.prototype = {

	buildLayout: function(apts, tmp, grps){

		// first element will always go into the tmp array, adding on to exist list or starting a
		// new tmp array (even if it will be the only element)
		tmp.push(apts.shift());

		// is the next apt the last one in the apt array?
		if (apts.length == 1) {

			// yes, is the next one part of this tmp array or on its own?
			if (tmp[0].end > apts[0].start) {

				// part of this array
				tmp.push(apts.shift());

				grps.push(tmp);
			} else {

				// nope, on its own
				// push current array to layout
				grps.push(tmp);

				// push last remaining apt into layout
				grps.push([apts.shift()]);
			}

			return grps;
		}

		// does the first apt in the apts list start before this current appointment ends?
		if (tmp[0].end > apts[0].start) {

			// yes, go ahead and add it in by recursive function call
			return this.buildLayout(apts, tmp, grps);

		} else {

			// set current array max end for positioning later
			tmp.maxEnd = this.getMaxEnd(tmp);

			// so push the tmp array into the overall layout
			grps.push(tmp);
		}

		// hand the layout back to the calling function
		return grps;
	},
	sort: function(data){
		data = _.sortBy(data, function(d){
			return d.start;
		});
		return data;
	},
	getMaxEnd: function(apts){
		return _.max(apts, function(a){
			return a.end
		});
	},
	layout: function(data){

		data = this.sort(data);
		var grps = [];
		while (data.length > 1) {
			var tmp = [];
			this.buildLayout(data, tmp, grps);
		}

		return this.setPositions(grps);
	},
	setPositions: function(grps){
		var layout = [];
		_.each(grps, function(g, i){

			// set width restriction based on above row's max end
			var wRestrict = 1;
			if (i > 0) {
				var prevMaxEnd = this.getMaxEnd(grps[i - 1]);

				if (prevMaxEnd.end > g[0].start) {
					wRestrict = prevMaxEnd.left / 100;
				}
			}
			_.each(grps[i], function(apt, j){
				apt.ln = apt.end - apt.start;
				apt.startTime = (Math.floor((apt.start + 540) / 60) + ':' + apt.start % 60);
				apt.endTime = (Math.floor((apt.end + 540) / 60) + ':' + apt.end % 60);

				// calculate position percentages
				apt.top = ((apt.start / 720) * 100) - 1;
				apt.height = ((apt.ln / 720) * 100) - 1;
				apt.width = (1 / grps[i].length * wRestrict * 100) - 1;

				// check to see if this apt can be shifted left
				var leftPo = j;
				for (var l = j - 1; l > 0; l--) {
					if (grps[i][l].end < apt.start) {
						leftPo = l;
					}
				}
				apt.left = leftPo * (apt.width + 1);
				layout.push(apt);
			});
		}, this);

		return layout;
	},
	generate: function(n){
		var apts = [];
		for (var i = 0; i < n; i++) {
			var s = Math.round(Math.random() * (600) + 0);
			var d = Math.round(Math.random() * (120 - 60) + 60);
			apts.push({
				id: ((new Date()).getTime() + "" + Math.floor(Math.random() *
					1000000)).substr(0, 18),
				start: s,
				end: s + d,
				loc: 'sample location',
				name: 'Sample Item'
			});
		}

		return apts;

	},
	render: function(data){
		var tmpl = $('#tmpl-apt').html();
		for (var i = 0; i < data.length; i++) {
			var compiled = _.template(tmpl, data[i]);

			$('.events').append(compiled);
		}
	}
};

$(document).ready(function(){
	var cal = new Cal();
	var data = cal.generate(10);
	var layout = cal.layout(data);
	cal.render(layout);
});
