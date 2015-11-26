"use strict";

var map, alerts;

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
        zoomControl: true,
        panControl: true,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            mapTypeIds: ["light"]
        }
    };

    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    Alerts.getAlerts();

    map.mapTypes.set("light", lightStyle);
    map.setMapTypeId("light");

    // initialize and plot the alerts
    Alerts.getAlerts();

    Alerts.loadRadarOverlay();
}

// google.maps.event.addDomListener(window, "load", initialize);

var Alerts = {
    // getAlerts: function() {
    // $.when(alerts)
    // .then(Alerts.compileAlerts)
    // .then(null, function (error) {
    //     console.log('jquery promises are obtuse', error)
    // })
    // },

    getAlerts: function getAlerts() {
        $.ajax({
            url: "http://api.myweather.today/v1/alerts/map",
            context: document.body,
            success: function success(alerts) {
                $.when(alerts).then(Alerts.compileAlerts).then(null, function (error) {
                    console.log("jquery promises are obtuse", error);
                });
            }
        });
    },

    compileAlerts: function compileAlerts(Z) {
        $.each(Z, function (index, aa) {
            var ab, ac;
            var alert_event = aa.event;
            var polygon = aa.polygon;

            ab = new google.maps.Polygon({
                paths: Alerts.compilePolygon(aa.polygon),
                strokeColor: Alerts.alertColors(aa.event),
                fillColor: Alerts.alertColors(aa.event),
                strokeOpacity: 0.5,
                strokeWeight: 4,
                fillOpacity: 0.2 });
            ab.setMap(map);

            ac = new google.maps.InfoWindow();
            google.maps.event.addListener(ab, "click", function () {
                Alerts.showInfoBox(ab, aa, ac);
            });
        });
    },

    showInfoBox: function showInfoBox(ab, aa, ac) {
        var ac;
        var counties = aa.counties;
        var state = aa.state;

        if (ac) {
            ac.close();
        }

        ac.setOptions("width: 200px !important; min-height: 200px !important;");
        ac.setContent("<div class=\"content\" style=\"min-width: 500px; min-height: 100px; max-height: 600px; margin-left: 20px; margin-top: 20px; margin-bottom: 20px;\">" + "<h4 style=\"color:#000;\">" + aa.event + "<small> expires in about " + aa.expiresin + "</small></h4>" + "Areas Affected Include: " + Alerts.createList(counties, state) + "<br /> <a class=\"btn btn-primary btn-block\" href=\"http://alerts.myweather.today/alert/" + aa.id + "\">More Details</a>" + "</div>");
        ac.setPosition(Alerts.avgLatLng(aa.polygon));
        ac.open(map);
    },

    avgLatLng: function avgLatLng(polygon) {
        var Z, aa;
        var avgLat = 0;
        var avgLng = 0;
        var j = 0;

        aa = polygon.split(" ");

        $.each(aa, function (index, ad) {
            var ac;
            ac = ad.split(",");

            avgLat = Number(avgLat) + Number(ac[0]);
            avgLng = Number(avgLng) + Number(ac[1]);

            j++;
        });

        avgLat = avgLat / j;
        avgLng = avgLng / j;

        return new google.maps.LatLng(avgLat, avgLng);
    },

    compilePolygon: function compilePolygon(ab) {
        var aa, Z;
        Z = [];

        aa = ab.split(" ");
        $.each(aa, function (index, ad) {
            var ac;
            ac = ad.split(",");
            return Z.push(new google.maps.LatLng(ac[0], ac[1]));
        });
        return Z;
    },

    alertColors: function alertColors(Z) {
        if (Z === "Tornado Warning") {
            return "#e74c3c";
        }
        if (Z === "Severe Thunderstorm Warning") {
            return "#e67e22";
        }
        if (Z === "Flash Flood Warning") {
            return "#2ecc71";
        }
        if (Z === "Flood Warning") {
            return "#2ecc71";
        }
    },

    createList: function createList(counties, state) {
        var list = counties.split(", ");

        var html = "<ul>";

        for (var i = 0; i < list.length; i++) {
            html += "<li>" + list[i] + ", " + state + "</li>";
        }

        html += "</ul>";

        return html;
    },

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
//# sourceMappingURL=alerts-warning-map.js.map