var request = require('request');
var fs = require('fs');
var todaysDate = new Date();
var d = todaysDate.getDate();
var m = ((todaysDate.getMonth()+1)>=10)? (todaysDate.getMonth()+1) : '0' + (todaysDate.getMonth()+1);
var y = todaysDate.getFullYear();
var h = todaysDate.getHours();
var min = (todaysDate.getMinutes()<10?'0':'') + todaysDate.getMinutes();

var page = "<style type='text/css'> .content {width: 70%; margin: 0 auto;} .dates {background: green; color:white;} </style>";
page += "<h2>Today is: " + d + "-" + m + "-" + y + ", " + h + ":" + min + ". Upcoming events: </h2>";

request('https://api.meetup.com/2/open_events?&sign=true&country=us&city=Boston&state=MA&topic=java,ios,web,android,hacker,python&category=34&time=,1w&key=7187f512f10195971732d4d2f4226a', function (err,result,body) {
	if (err) throw err;
	var result = (JSON.parse(body))["results"];
	for (var j in result) {
		var date = new Date(result[j]["time"]);
		d = date.getDate();
		m = ((date.getMonth()+1)>=10)? (date.getMonth()+1) : '0' + (date.getMonth()+1);
		h = date.getHours();
		min = (date.getMinutes()<10?'0':'') + date.getMinutes();
		page += "<div class='dates' align='center'>" + d + "." + m  + "." + y + ", " + h + ":" + min + "</div><div class='content'><div><b>Event: </b>" + (result[j])["name"] + "</div>";
		if ("venue" in result[j]) {
			page += "<div><b>Address: </b>" + ((result[j])["venue"])["address_1"] + "</div>";
		}
		if ("description" in result[j]){
			page += "<div align='center'><b>Description: </b>";
			page += "<p>" + (result[j])["description"] + "</p>";
			page += "</div>";
		}
		page += "</div>";
	}
	fs.writeFile("meetup.html", page, function (err){
		if (err) console.log(err);
	});
});
