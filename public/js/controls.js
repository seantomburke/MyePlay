videojs.options.flash.swf = "video-js.swf";

toastr.options = {
  "closeButton": false,
  "debug": false,
  "progressBar": false,
  "positionClass": "toast-top-right",
  "onclick": null,
  "showDuration": "100",
  "hideDuration": "1000",
  "timeOut": "1000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
};

$(document).ready(function(){

  var currentlyPlaying = true;

  // takes in a url, and inputType to determine what command gets mapped to what page
  var sendCmd = function(url, inputType) {
    //if on video page, send video command
    if(url.indexOf("video") > -1) {
      if (inputType == "space") {
        currentlyPlaying = !currentlyPlaying;
        if (!currentlyPlaying) {
        videojs.players["video"].pause();
        } else {
        videojs.players["video"].play();
        }

      } else if (inputType == "up") {
        if (!window.location.origin) {
        window.location.origin = window.location.protocol+"//"+window.location.host;
       }

       window.location.href = window.location.origin + "/index";
      }

    } 

    //move cards up and down
    if (url.indexOf("index") > -1) {
      if (inputType == "down") {
        impress().next();
      } else if (inputType == "up") {
        impress().prev();
      } else if (inputType == "space") {
       // alert("space");
        console.log($('.active a'));
        $('.active a').click();
      }
    } 
  };
  
  $(document).keydown(function(e){
    if (e.which == 37) { // 37 is the left arrow key code.
    };

    //goes back
    if (e.which == 38) { // 38 is the up arrow key code.
       e.stopPropagation();
      sendCmd(window.location.href, "up");
    };

    if (e.which == 39) { // 39 is the right arrow key code.
      console.log("right");
    };

    //toggles pause and play
    if (e.which == 40) { // 40 is the down arrow key code.
       e.stopPropagation();
      sendCmd(window.location.href, "down");
    };

    if (e.which == 32) {
       e.stopPropagation();
      sendCmd(window.location.href, "space");
    }
  });

/** Eyetribe movement algorithms **/
 (function() {
   var leftEye;
   var rightEye;
   var cursor;

   var tempvar_y_diff=0;
  

  var old_y = "";
  var iter =0;
  var tempvar_y = 0;
  var dateObject = new Date();
  var lastActionTime = dateObject.getTime();
  var currentTime = dateObject.getTime();
  var returnedToCenter = false;
  var eyeClosedTime = 0;
  var currentlyPlaying = true;
  var isReopened = true;

	
   EyeTribe.loop(function(frame) {
  
     iter++;
	
 	if (iter > 1000){
 		return;
 	}

 	var rightEye_y;
 	var rightEye_x;
 	var leftEye_y;
 	var leftEye_x;
		
 	rightEye_y = generateEventy(frame.rightEye);
 	rightEye_x = generateEventx(frame.rightEye);
	leftEye_y = generateEventy(frame.leftEye);
 	leftEye_x = generateEventx(frame.leftEye);
	

	var dateObject3 = new Date();
	currentTime3 = dateObject3.getTime();
	
	var myAverage_y = 650;
	if (rightEye_y != 0 && leftEye_y != 0){
		myAverage_y = (rightEye_y + leftEye_y)/2;
	}
	else{
		if(rightEye_y != 0) {
			myAverage_y = rightEye_y;
			eyeClosedTime = 0;
			isReopened = true;
		}
		else if(leftEye_y != 0) {
			myAverage_y = leftEye_y;
			eyeClosedTime = 0;
			isReopened = true;
		}
		else {
			if (eyeClosedTime == 0) 
				eyeClosedTime = currentTime3;
			if( (currentTime3 - eyeClosedTime > 2000) && (isReopened == true) ) {
				toastr.success( "Space command recieved." );
			    sendCmd(window.location.href, "space");

				
				isReopened = false;
				currentlyPlaying = !currentlyPlaying;
				if (!currentlyPlaying) {
					videojs.players["video"].pause();
				} else {
					videojs.players["video"].play();
				}
				eyeClosedTime = 0;
			}
		}
	}

	
 	tempvar_y = (tempvar_y + myAverage_y)/2;
	
	if(iter = 200) {
  		//console.log(tempvar_y);
 		iter = 0;
 	}
		
 	//console.log (tempvar_y);

	var dateObject2 = new Date();
	currentTime = dateObject2.getTime();
	
  //controls movement, sends uup and down commands
	if(currentTime - lastActionTime > 1500) {
		if( (tempvar_y > 500) && (tempvar_y < 650)) {
			returnedToCenter = true;
			console.log("center");
			} 
		if(returnedToCenter) {
			if(tempvar_y > 800){

			  //toastr.success( "Down command recieved." );
			  //sendCmd(window.location.href, "down");

				console.log ( "Down" );
				
				lastActionTime = dateObject2.getTime();
				returnedToCenter = false;
			}else if(tempvar_y < 400){
				toastr.success( "Up command recieved." );
				lastActionTime = dateObject2.getTime();
				sendCmd(window.location.href, "up");
				returnedToCenter = false;
			}else{
				//console.log ( tempvar_y_diff );
			}
		}
	}
	
  })
 
  var clientOrigin = {
    left: window.screenLeft,
    top: window.screenTop
  }

  document.onmousemove = function(event) {
    clientOrigin.left = event.screenX - event.clientX
    clientOrigin.top = event.screenY - event.clientY
  }

  function locateEyeImage(image, eye) {
    if (eye.pupilSize) {
      locateElement(image, eye.average);
    } else {
      image.style.display = 'none';
    }
  }

	function generateEventy(eye){
		if (eye.pupilSize) {
			var position = eye.average;
			return (position.y);
		  } else {
		  return 0;
		}
	}

	function generateEventx(eye){
		if (eye.pupilSize) {
			var position = eye.average;
			return (position.x);
		  } else {
		  return 0;
		}
	}
	
  function locateCursor(frame) {
    if (frame.isFixated) {
      locateElement(cursor, frame.average)
    } else {
      cursor.style.display = 'none';
    }
  }

  function locateElement(element, position) {
    element.style.display = 'block';
    element.style.left = (position.x - clientOrigin.left - element.clientWidth / 2) + 'px';
    element.style.top = (position.y - clientOrigin.top - element.clientHeight / 2) + 'px';
  }

})();

});