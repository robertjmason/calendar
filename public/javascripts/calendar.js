


window.Calendar = {};

Calendar.Apt = Backbone.Model.extend({
	defaults: function(){
		return {
			start: null,
			end: null,
			name: null,
			location: null
		};
	},
	validate: function(attrs){
		var err = [];
		if (attrs.end <= attrs.start) {
			err.push("invalidLength");
		}
		//if (_.isNull(attrs.name)) {
		//	err.push("invalidName");
		//}
		//if (_.isNull(attrs.location)) {
		//	err.push("invalidLocation");
		//}
		return err;
	},
	initialize: function(){
		if (this.isValid()){

			// set relative UI element height
			this.set('height', this.end - this.start/ 60);
		}
	}

	//@TODO: set <9am and >9pm handlers
	//@TODO: ID handling
});

Calendar.Day = Backbone.Collection.extend({
	model: Calendar.Apt,

	// sort appointments on the fly as they are added to collection
	comparator: function(apt){
		return apt.get('start');
	},
	initialize: function(){

	}
});


Calendar.DayView = Backbone.View.extend({
	initialize: function(){
		//@TODO: Handle invalid models in collection
		this.collection.on('error', console.log('Invalid model detected'));

	},
	populate: function(data){

		// jsonp content bootstrapping just for fun
		this.collection = new Calendar.Day(JSON.parse(data));
	},
	buildLayout: function(apts, layout){

			// grab first appointment
			var cur = apts.shift();

			if (apts.length == 0) {
				return layout;
			};

			//if end time is after next appointment start time, build sub-layer
			if (cur.e - apts[0].s > 0) {
				var sub = [];
				cur.sub = this.buildLayout(apts, sub);

				this.buildLayout(apts, layout);

			}
			layout.push(cur);
			return layout;
		}

});

$(document).ready(function(){
	var dayView = new Calendar.DayView();
});
