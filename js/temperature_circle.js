// var c4 = $('.temperature.circle');

// c4.circleProgress({
//     startAngle: -Math.PI / 4 * 4.5,
//     value: 0.35,
//     size: 150,
//     lineCap: 'butt',
//     animation: { duration: '10000'},
//     fill: { gradient: ['lightblue', 'yellow'] }
// });

// let's emulate dynamic value update
// setTimeout(function() { c4.circleProgress('value', 0.7); }, 1000);
// setTimeout(function() { c4.circleProgress('value', 1.0); }, 1100);
// setTimeout(function() { c4.circleProgress('value', 0.5); }, 2100);

$.circleProgress.defaults.arcCoef = 0.5; // range: 0..1
$.circleProgress.defaults.startAngle = 0.5 * Math.PI;

$.circleProgress.defaults.drawArc = function(v) {
    var ctx = this.ctx,
        r = this.radius,
        t = this.getThickness(),
        c = this.arcCoef,
        a = this.startAngle + (1 - c) * Math.PI;
    
    v = Math.max(0, Math.min(1, v));

    ctx.save();
    ctx.beginPath();

    if (!this.reverse) {
        ctx.arc(r, r, r - t / 2, a, a + 2 * c * Math.PI * v);
    } else {
        ctx.arc(r, r, r - t / 2, a + 2 * c * Math.PI, a + 2 * c * (1 - v) * Math.PI, a);
    }

    ctx.lineWidth = t;
    ctx.lineCap = this.lineCap;
    ctx.strokeStyle = this.arcFill;
    ctx.stroke();
    ctx.restore();
};

$.circleProgress.defaults.drawEmptyArc = function(v) {
    var ctx = this.ctx,
        r = this.radius,
        t = this.getThickness(),
        c = this.arcCoef,
        a = this.startAngle + (1 - c) * Math.PI;

    v = Math.max(0, Math.min(1, v));
    
    if (v < 1) {
        ctx.save();
        ctx.beginPath();

        if (v <= 0) {
            ctx.arc(r, r, r - t / 2, a, a + 2 * c * Math.PI);
        } else {
            if (!this.reverse) {
                ctx.arc(r, r, r - t / 2, a + 2 * c * Math.PI * v, a + 2 * c * Math.PI);
            } else {
                ctx.arc(r, r, r - t / 2, a, a + 2 * c * (1 - v) * Math.PI);
            }
        }

        ctx.lineWidth = t;
        ctx.strokeStyle = this.emptyFill;
        ctx.stroke();
        ctx.restore();
    }
};

// var temperature = document.getElementById('CURRENT_TEMPERATURE').getAttribute('value');
// console.log(temperature);


// $('.temperature.circle').circleProgress({
//     arcCoef: 0.7,
//     value: 1,
//     thickness: 12,
//     size: 150,
//     fill: { gradient: ['#3498db', '#3498db', '#f1c40f', '#f1c40f', '#e67e22', '#e67e22', '#e74c3c', '#e74c3c']}
// }).on('circle-animation-progress', function(event, progress, stepValue) {
//     $(this).find('strong').text(Math.round(parseFloat(stepValue).toFixed(2) * 100) + unescape('%B0'));
// });