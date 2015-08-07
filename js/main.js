
var bar = $('.bar');
var shown = false;

var showHolder = function() {
	$(".sidebar").velocity("fadeIn", {
		duration: 1000,
		complete: function() {
			showMain();
		}
	});
}

var showMain = function() {
	$(".ten-day, .text-forecast-holder").velocity("fadeIn", {
		stagger: 1000,
		duration: 1000
	});
}

var showWeatherSections = function() {
	showHolder();
}

var progress = function() {
	bar.velocity({
		width: ["100%", 0]
	}, {
		duration: 8000,
		complete: function() {
			bar.velocity("fadeOut");
			bar.css("width", 0);
			if(!shown) {
				showWeatherSections();
				shown = true;
			}
		}
	});
}


// We call showProgress after 18s
// Then call it again 26 later so were in sync with the changes
var showProgress = function() {
	bar.velocity("fadeIn");
	progress();
	setTimeout(function() {
		showProgress();
	}, 26000);
}

// We first set the time to 18s
// and the progress takes 8s to show
// giving us 26s total when we fire the next city
setTimeout(function() {
	showProgress();
}, 18000);

$(window).on('load', function() {
	//showHolder();
	setTimeout(function() {
		progress();
	}, 2000);
})
