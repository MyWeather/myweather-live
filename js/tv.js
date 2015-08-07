var icon;

var placesArray = [
    ['New York, NY', '40.71,-74.00'],
    ['Chicago, IL', '41.83,-87.68'],
    ['San Francisco, CA', '37.78,-122.41'],
];


var x = 0;
var loopArray = function(arr) {
    // call itself

    var geo = arr[x][1].split(',');
    $("#LOCATION").html(arr[x][0]);
    updateWeatherUI(geo[0], geo[1]);
    x++;

    if(x < arr.length) {
        loopArray(arr);   
    } else {
        x = 0;
        loopArray(arr);
    }
    
    setTimeout(function() {
        loopArray(arr);
    }, 26000);
};

setTimeout(function() {
    loopArray(placesArray);
}, 8000);


function updateWeatherUI(lat, lng) {
    $.getJSON("http://api.myweather.today/v1/forecastIO/" + lat + "/" + lng, function( data ) {

        $("#CURRENT_FORECAST_ICON").html("<div class=\"icon " + getIconHolder(data['currently']['icon']) + "\"><i class=\"wi "
            + getIcon(data['currently']['icon']) + "\"></i></div>");

        $("#CURRENT_TEMP").html(round5(data['currently']['temperature']) + "&degF");
        $("#CURRENT_FEELS_LIKE_TEMP").html("feels like " + round5(data['currently']['apparentTemperature']) + "&degF");
        $("#CURRENT_DEW_POINT").html(round5(data['currently']['dewPoint']) + "&degF");
        $("#CURRENT_HUMIDITY").html(Math.round(data['currently']['humidity'] * 100) + " %");
        $("#CURRENT_VISIBILITY").html(data['currently']['visibility'] + " mi");
        $("#CURRENT_CLOUD_COVER").html(round5(data['currently']['cloudCover'] * 100) + "%");
        $("#CURRENT_PRESSURE").html(Math.round(data['currently']['pressure']) + " inHg");


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

        $("#10-DAY-FORECAST").html(days.join( "" ))
            // FADE IN 10 DAY FORCAST AS A STAGGER
            $('.forecast-day').velocity("fadeIn", {
                stagger: 250
            })
    });

    $.getJSON("http://api.myweather.today/v1/forecast/" + lat + "/" + lng, function( data ) {
        var items = [];
        $.each( data, function(i, item ) {
            items.push(
                "<div class=row><div class=day>" + item.day +
                "</div><div class=description>" + item.forecast +
                "</div></div>"
            );

        });

        $("#TEXTUAL_FORECAST").html(items.join( "" ))
        $("<div class=clear-div></div>").appendTo( "#TEXTUAL_FORECAST" );
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

function round5(x)
{
    return (x % 5) >= 2.5 ? parseInt(x / 5) * 5 + 5 : parseInt(x / 5) * 5;
}

