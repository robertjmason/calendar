/*
	GET bootstrap calendar content
 */

var aptsShort = [
	{
		start: 0930,
		end: 1130,
		id: ((new Date()).getTime() + "" + Math.floor(Math.random() *
			1000000)).substr(0, 18)
	},
	{
		start: 1820,
		end: 1920,
		id: ((new Date()).getTime() + "" + Math.floor(Math.random() *
			1000000)).substr(0, 18)
	},
	{
		start: 1800,
		end: 1900,
		id: ((new Date()).getTime() + "" + Math.floor(Math.random() *
			1000000)).substr(0, 18)
	},
	{
		start: 1910,
		end: 2010,
		id: ((new Date()).getTime() + "" + Math.floor(Math.random() *
			1000000)).substr(0, 18)
	}
];

exports.content = function (req, res){
	res.contentType('application/json');
	res.jsonp(JSON.stringify(aptsShort));
};
