var icon;
var weekly;

$(window).on('load', initialize());

function initialize() {
	setInterval(function() {
		updateCity(placesArray);
		displayWeekly();


        setTimeout(function() {
            $("#map").velocity("fadeIn", {
                duration: 1000,
                stagger: 1000,
            });
        }, 30000);
	}, 30000);
}

var placesArray = [
	['New York, NY', '40.71,-74.00'], 
    ['Chicago, IL', '41.83,-87.68'], 
    ['Washington, DC', '38.90,-77.03'],
    ['Los Angeles, CA', '34.05,-118.24'],
    ['San Francisco, CA', '37.78,-122.41'], // 5
    ['Seattle, WA', '47.60,-122.33'],
    ['Boston, MA', '42.36,-71.05'],
    ['Austin, TX', '30.26,-97.74'],
    ['Charleston, WV', '38.34,-81.63'],
    ['Nashville, TN', '36.16,-86.78'], //10
    ['Houston, TX', '29.76,-95.36'],
    ['Philadelphia, PA', '39.95,-75.16'],
    ['Portland, OR', '45.52,-122.67'],
    ['Las Vegas, NV', '36.16,-115.13'],
    ['New Orleans, LA', '29.95,-90.07'], // 15
    ['Honolulu, HI', '21.30,-157.85'],
    ['San Antonio, TX', '29.42,-98.49'],
    ['Savannah, GA', '32.08,-81.09'],
    ['Boulder, CO', '40.01,-105.27'],
    ['St. Louis, MI', '43.40,-84.6'], //20
    ['Miami, FL', '25.76,-80.1'],
    ['Atlanta, GA', '33.74,-84.38'],
    ['San Jose, CA', '37.33,-121.88'],
    ['Detroit, MI', '42.33,-83.04'],
    ['Orlando, FL', '28.53,-81.37'], //25
];

var timeArray = [
    ['EST', '-5'],
    ['CST', '-6'],
    ['MST', '-7'],
    ['PST', '-8'],
]

var x = 0;
var updateCity = function(arr) {
    var geo = arr[x][1].split(',');
    $("#LOCATION").html(arr[x][0]);
    updateWeatherUI(geo[0], geo[1]);
    x++;
};

var updateCityAfterTime = function() {
	if(x < placesArray.length) {
		updateCity(placesArray);
	} else {
		x = 0;
		updateCity(placesArray);
	}
}

var t = 0;
var updateTime = function(arr) {
    calcTime(arr[t][1], arr[t][0]);
    t++;
}

var updateTimeAfterTime = function() {
	if(t < timeArray.length) {
		updateTime(timeArray);
	} else {
		t = 0;
		updateTime(timeArray);
	}
}

function displayWeekly() {
    setTimeout(function() {
    	$("#map").velocity("fadeOut", {
     		duration: 1000,
     		stagger: 1000,
     	}, {
     		complete: loadWeekly(),
     	});
    }, 10000);
}

function loadWeekly() {
    setTimeout(function() {
    	$("#content").append("<div class=\"ten-day\"><div id=\"10-DAY-FORECAST\" class=\"forecast-content\"></div></div>");
        $("#10-DAY-FORECAST").html(weekly);
        $('.forecast-day').velocity("fadeIn", {
            stagger: 250
        })
    }, 1000);

    setTimeout(function() {
        $(".ten-day").velocity("fadeOut", {
            stagger: 250
        });

        setTimeout(function() {
            $(".ten-day").remove();
        }, 2000);
    }, 10000);
}



function updateWeatherUI(lat, lng) {
	$.getJSON("https://api.forecast.io/forecast/80e7cbcf81c8314b610b924172cdfc23/" + lat + "," + lng, function( data ) {

        $("WEATHER_ICON_HEAD").html("<span class=\"weather-icon " + getIconHolder(data['currently']['icon']) + "\"><span class=\"wi " +  getIcon(data['currently']['icon']) + "\"></span></span>");

		// Initialize Sidebar
		updateTemperature(data['currently']['temperature']);
		initializeMap(lat, lng);

		$("#CURRENT_FORECAST_ICON").html("<div class=\"icon " + getIconHolder(data['currently']['icon']) + "\"><i class=\"wi "
            + getIcon(data['currently']['icon']) + "\"></i></div>");
		console.log(data['currently']);
		$("#CURRENT_SUMMARY").html(data['currently']['summary']);

        $("#CURRENT_TEMP").html(round5(data['currently']['temperature']));
        $("#CURRENT_FEELS_LIKE_TEMP").html("feels like " + round5(data['currently']['apparentTemperature']) + "&degF");
        $("#CURRENT_DEW_POINT").html(round5(data['currently']['dewPoint']) + "&degF");
        $("#CURRENT_HUMIDITY").html(Math.round(data['currently']['humidity'] * 100) + " %");
        $("#CURRENT_VISIBILITY").html(data['currently']['visibility'] + " mi");
        $("#CURRENT_CLOUD_COVER").html(round5(data['currently']['cloudCover'] * 100) + "%");
        $("#CURRENT_PRESSURE").html(Math.round((data['currently']['pressure'] * 0.0295301) * 100) / 100 + "\"");


        var days = [];
        $.each( data['daily']['data'], function(i, item ) {
			days.push(
				"<div class=forecast-day><h4 class=forecast-day-title>" + getDay(item.time) +
				"</h4><div class=\"day-icon " + getIconHolder(item.icon) + " wi-day\"><i class=\"wi " + getIcon(item.icon)
				+ "\"></i></div><p>" + Math.round(item.apparentTemperatureMax) +
				"&deg; <small>F</small> / " + Math.round(item.apparentTemperatureMin) +
				"&deg; <small>F</small></p><p class=wind><span class=\"wi wi-windy\"></span>&nbsp;&nbsp; " +
				getWindDirection(item.windBearing) + " <small> at </small>" +
				Math.round(item.windSpeed) + " mph</p><p class=precip><span class=\"wi wi-sprinkles\"></span>&nbsp;&nbsp; " +
				round5(Math.round(item.precipProbability * 100))  + "%</p></div></div>"
			);

        });

        weekly = days.join("");
        
    });

	// $.getJSON("http://api.myweather.today/v1/forecast/" + lat + "/" + lng, function( data ) {
	// 	var items = [];
	// 	$.each( data, function(i, item ) {
	// 		items.push(
	// 			"<div class=row><div class=day>" + item.day +
	// 				"</div><div class=description><p>" + item.forecast +
	// 				"</p></div><div class=clear-forecast-day></div></div>"
	// 		);

	// 	});

	// 	$("#TEXTUAL_FORECAST").html(items.join( "" ))
	// 	$("<div class=clear-div></div>").appendTo( "#TEXTUAL_FORECAST" );
	// });
}

function updateTemperature(value) {
	var value = Math.round(value * 100) / 10000;

	$('.temperature.circle').circleProgress({
	    arcCoef: 0.7,
	    value: value,
	    thickness: 12,
	    size: 150,
	    fill: { gradient: ['#3498db', '#3498db', '#f1c40f', '#f1c40f', '#e67e22', '#e67e22', '#e74c3c', '#e74c3c']}
	}).on('circle-animation-progress', function(event, progress, stepValue) {
	    $(this).find('strong').text(Math.round(parseFloat(stepValue).toFixed(2) * 100) + unescape('%B0'));
	});
}




function getDay(timestamp) {
	var options = {
		weekday: 'long',
		//month: 'short',
		//year: 'numeric',
		//day: 'numeric',
		//hour: 'numeric',
		//minute: 'numeric',
		//second: 'numeric'
	},
	intlDate = new Intl.DateTimeFormat( undefined, options );
	return intlDate.format( new Date( 1000 * timestamp ) );
}

function getIcon(icon) {
	if(icon == "clear-day") {
		return "wi-day-sunny";
	} else if(icon == "clear-night") {
		return "wi-night-clear";
	} else if(icon == "rain") {
		return "wi-rain";
	} else if(icon == "snow") {
		return "wi-snow";
	} else if(icon == "sleet") {
		return "wi-sleet";
	} else if(icon == "wind") {
		return "wi-cloudy-gusts";
	} else if(icon == "fog") {
		return "wi-fog";
	} else if(icon == "cloudy") {
		return "wi-cloudy";
	} else if(icon == "partly-cloudy-day") {
		return "wi-day-cloudy";
	} else {
		return "wi-night-cloudy";
	}
}

function getIconHolder(icon) {
	if(icon == "clear-day") {
		return "wi-icon-clear-day";
	} else if(icon == "clear-night") {
		return "wi-icon-clear-night";
	} else if(icon == "rain") {
		return "wi-icon-rain";
	} else if(icon == "snow") {
		return "wi-icon-snow";
	} else if(icon == "sleet") {
		return "wi-icon-sleet";
	} else if(icon == "wind") {
		return "wi-icon-cloudy-gusts";
	} else if(icon == "fog") {
		return "wi-icon-fog";
	} else if(icon == "cloudy") {
		return "wi-icon-cloudy";
	} else if(icon == "partly-cloudy-day") {
		return "wi-icon-day-cloudy";
	} else {
		return "wi-icon-night-cloudy";
	}
}

function getWindDirection(windDirection) {
	if(windDirection >= "348.75" || windDirection < "11.25") {
		return "N";
	} else if(windDirection >= "11.25" && windDirection < "33.75") {
		return "NNE";
	} else if(windDirection >= "33.75" && windDirection < "56.25") {
		return "NE";
	} else if(windDirection >= "56.25" && windDirection < "78.75") {
		return "ENE";
	} else if(windDirection >= "78.75" && windDirection < "101.25") {
		return "E";
	} else if(windDirection >= "101.25" && windDirection < "123.75") {
		return "ESE";
	} else if(windDirection >= "123.75" && windDirection < "146.25") {
		return "SE";
	} else if(windDirection >= "146.25" && windDirection < "168.75") {
		return "SSE";
	} else if(windDirection >= "168.75" && windDirection < "191.25") {
		return "S";
	} else if(windDirection >= "191.25" && windDirection < "213.75") {
		return "SSW";
	} else if(windDirection >= "213.75" && windDirection < "236.25") {
		return "SW";
	} else if(windDirection >= "236.25" && windDirection < "258.75") {
		return "WSW";
	} else if(windDirection >= "258.75" && windDirection < "281.25") {
		return "W";
	} else if(windDirection >= "281.25" && windDirection < "303.75") {
		return "WNW";
	} else if(windDirection >= "303.75" && windDirection < "326.25") {
		return "NW";
	} else if(windDirection >= "326.25" && windDirection < "348.75") {
		return "NNW";
	} else {
		return "N/A";
	}
}

function getBackgroundImage(icon) {
    if(icon == "clear-day") {
        return "https://s3.amazonaws.com/mywxtoday/assets/img/bkg/dt-clear.jpg";
    } else if (icon == "clear-night") {
        return "https://s3.amazonaws.com/mywxtoday/assets/img/bkg/nt-clear.jpg";
    } else if (icon == "rain") {
        return "https://s3.amazonaws.com/mywxtoday/assets/img/bkg/wet-windshield.jpg";
    } else if (icon == "snow") {
        return "https://s3.amazonaws.com/mywxtoday/assets/img/bkg/dt-snow.jpg";
    } else if (icon == "sleet") {
        return "https://s3.amazonaws.com/mywxtoday/assets/img/bkg/dt-snow.jpg";
    } else if (icon == "wind") {
        return "https://s3.amazonaws.com/mywxtoday/assets/img/bkg/dt-wheat-wind.jpg";
    } else if (icon == "fog") {
        return "https://s3.amazonaws.com/mywxtoday/assets/img/bkg/fog.jpg";
    } else if (icon == "cloudy") {
        return "https://s3.amazonaws.com/mywxtoday/assets/img/bkg/dt-field-clouds.jpg";
    } else if (icon == "partly-cloudy-day") {
        return "https://s3.amazonaws.com/mywxtoday/assets/img/bkg/ss-field.jpg";
    } else if (icon == "partly-cloudy-night") {
        return "https://s3.amazonaws.com/mywxtoday/assets/img/bkg/nt-clear.jpg";
    } else {
        return "https://s3.amazonaws.com/mywxtoday/assets/img/bkg/dt-clear.jpg";
    }
}

function round5(x) {
	return (x % 5) >= 2.5 ? parseInt(x / 5) * 5 + 5 : parseInt(x / 5) * 5;
}

function calcTime(offset, timeZone) {

    // create Date object for current location
    var d = new Date();

    // convert to msec
    // add local time zone offset 
    // get UTC time in msec
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    var date = new Date(utc + (3600000*offset));

    // $("#CURRENT_TIME").html( + " " + timeZone);

}

function initializeMap(locationLat, locationLon) {
    var myLatLng = new google.maps.LatLng(locationLat, locationLon);

    var lightStyle = [{
        "featureType": "administrative",
        "elementType": "all",
        "stylers": [{
            "visibility": "simplified"
        }]
    }, {
        "featureType": "administrative.country",
        "elementType": "geometry.stroke",
        "stylers": [{
            "visibility": "on"
        }]
    }, {
        "featureType": "administrative.province",
        "elementType": "all",
        "stylers": [{
            "visibility": "on"
        }]
    }, {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [{
            "visibility": "simplified"
        }, {
            "color": "#fcfcfc"
        }]
    }, {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{
            "visibility": "simplified"
        }, {
            "color": "#fcfcfc"
        }]
    }, {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{
            "visibility": "simplified"
        }, {
            "color": "#dddddd"
        }]
    }, {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [{
            "visibility": "simplified"
        }, {
            "color": "#dddddd"
        }]
    }, {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [{
            "visibility": "simplified"
        }, {
            "color": "#eeeeee"
        }]
    }, {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{
            "visibility": "simplified"
        }, {
            "color": "#dddddd"
        }]
    }];

    var lightStyle = new google.maps.StyledMapType(lightStyle, { name: "Light" });

    var mapOptions = {
        zoom: 7,
        center: myLatLng,
        disableDefaultUI: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            mapTypeIds: ["light"]
        }
    };

    

    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    var marker = new google.maps.Marker({
	    position: myLatLng,
	    animation: google.maps.Animation.DROP,
	    map: map
	});

    map.mapTypes.set("light", lightStyle);
    map.setMapTypeId("light");

    Radar.loadRadarOverlay();

    // setTimeout(function() {
    //     var myLatLng2 = new google.maps.LatLng("42.0208", "-80.3380");
    //     map.panTo(myLatLng2);
    // }, 4000);
}

var Radar = {
	loadRadarOverlay: function loadRadarOverlay() {
        var Z, ab, aa, ac, radar;
        Z = new google.maps.LatLng(21.652538062803, -127.62037552387542);
        ab = new google.maps.LatLng(50.406626367301044, -66.517937876818);
        aa = new google.maps.LatLngBounds(Z, ab);
        ac = "https://s3.amazonaws.com/mywxtoday/conus-radar/radar.png?t=" + new Date().getTime();
        radar = new google.maps.GroundOverlay(ac, aa);
        radar.setOpacity(0.35);
        return radar.setMap(map);
    }
};
