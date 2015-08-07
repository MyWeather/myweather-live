
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
    
    setTimeout(function() {
        bar.velocity("fadeIn");
        progress()
    }, 16000);
}
$(window).on('load', function() {
	//showHolder();
	setTimeout(function() {
		progress();
	}, 2000);
})
