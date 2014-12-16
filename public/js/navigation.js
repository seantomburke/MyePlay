
//Mouse Navigation and Timer settings
var duration = 2000;
var timeout = null;


var timer = document.createElement("div");
timer.id = "timer";
document.body.insertBefore(timer, document.getElementById("impress"));

var circle = new ProgressBar.Circle('#timer', {
        color: '#FCB03C',
        strokeWidth: 5,
        duration: duration
    });

// delegated handler for clicking on step elements
document.addEventListener("mouseover", function ( event ) {
    /* var target = event.target;
    // find closest step element that is not active
    //console.log(target.classList);
    if( (target.classList.contains("step") && !target.classList.contains("active"))) {
        
        circle.duration = duration;
        circle.animate(1,
            {
                from: {color: "#FC5B3F"},
                to: {color: "#6FD57F"}
            }, 
            function(){
                circle.set(0);
            }
        );

        timeout = setTimeout(function(){
            if ( impress().goto(target) ) {
                event.preventDefault();
            }
        }, duration);
    } */
    
}, false);

// delegated handler for clicking on step elements
document.addEventListener("mouseout", function ( event ) {
    var target = event.target;
    // find closest step element that is not active
    if( (target.classList.contains("step") && !target.classList.contains("active"))) {
        
        circle.set(0);
        clearTimeout(timeout);
                event.preventDefault();
    }
}, false);

// delegated handler for clicking on step elements
document.addEventListener("mouseleave", function ( event ) {
    var target = event.target;
    // find closest step element that is not active
    while ( !(target.classList.contains("step") && !target.classList.contains("active")) &&
            (target !== document.documentElement) ) {
        target = target.parentNode;
    }
    circle.set(0);
    clearTimeout(timeout);
            event.preventDefault();
}, false);


onmousemove = function(event){
    var timer = $("#timer");
    //timer.css("position", "absolute");
    //timer.css("top", (event.y -50) + "px");
    //timer.css("left", (event.x- 50) + "px");
}

document.addEventListener("myeplay-live-position", function(event){
	var timer = $("#timer");
	timer.css("position", "absolute");
    timer.css("top", (event.y -50) + "px");
    timer.css("left", (event.x- 50) + "px");
})

document.addEventListener("myeplay-action-up", function(event){
		impress().next();
	/* circle.duration = duration;
        circle.animate(1,
            {
                from: {color: "#FC5B3F"},
                to: {color: "#6FD57F"}
            }, 
            function(){
                circle.set(0);
            }
        );

        timeout = setTimeout(function(){
            if ( impress().next() ) {
                event.preventDefault();
            }
        }, 0); */
		
});

document.addEventListener("myeplay-action-down", function(event){

		impress().prev();
		/* circle.duration = duration;
        circle.animate(1,
            {
                from: {color: "#FC5B3F"},
                to: {color: "#6FD57F"}
            }, 
            function(){
                circle.set(0);
            }
        );

        timeout = setTimeout(function(){
            if ( impress().prev() ) {
                event.preventDefault();
            }
        }, 0); */

});

document.addEventListener("myeplay-stream-center", function(event){
    circle.set(0);
    //clearTimeout(timeout);
    event.preventDefault();

});


document.addEventListener("myeplay-action-close", function(event){
                var sound = new Audio("http://www.oringz.com/oringz-uploads/sounds-917-communication-channel.mp3");
            sound.play();
    var active_slide = document.querySelector(".active");
	console.log(active_slide);
	var anchor = active_slide.querySelector("a");
	console.log(anchor);
	var link = anchor.getAttribute("href");
	console.log(link);
	window.location.replace(link);
	sound.pause();
});


