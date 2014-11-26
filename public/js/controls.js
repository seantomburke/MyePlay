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
        $('.active').find("a")[0].click();
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
   
   var myeplayStreamUpEvent = new Event("myeplay-stream-up");
   var myeplayStreamDownEvent = new Event("myeplay-stream-down");
   var myeplayStreamCenterEvent = new Event("myeplay-stream-center");
   var myeplayActionUpEvent = new Event("myeplay-action-up");
   var myeplayActionDownEvent = new Event("myeplay-action-down");
   var myeplayLivePosition = new Event("myeplay-live-position");

	function simple_moving_averager(period) {
		var nums = [];
		return function(num) {
			nums.push(num);
			if (nums.length > period)
				nums.splice(0,1);  // remove the first element of the array
			var sum = 0;
			for (var i in nums)
				sum += nums[i];
			var n = period;
			if (nums.length < period)
				n = nums.length;
			return(sum/n);
		}
	}
	
	// Simple Moving Average
	var sma_y_average = simple_moving_averager(10);
	var max = 0;
	var min = 1000;
	var midpoint = 0;

	// Cursor Object
	var cursor = document.createElement("span");
	cursor.id = "cursor";
	cursor.style.backgroundColor = "#333333";
	cursor.style.height = "50px";
	cursor.style.width = "50px";
	cursor.style.position = "absolute";
	document.body.appendChild(cursor);
	
	var cursor2 = document.createElement("span");
	cursor2.id = "cursor2";
	cursor2.style.backgroundColor = "#666666";
	cursor2.style.height = "50px";
	cursor2.style.width = "50px";
	cursor2.style.position = "absolute";
	document.body.appendChild(cursor2);
	
	// Main Loop
	
	
	var upper_threshold = 500;
	var lower_threshold = 900;
	
	EyeTribe.loop(function(frame) {
	
	
		var leftEye_y = frame.leftEye.average.y;
		var rightEye_y = frame.rightEye.average.x;
		var average_y;
	
		// Compute Average Depending on Eye Closed or Not
		if (rightEye_y != 0 && leftEye_y != 0){
			average_y = (rightEye_y + leftEye_y)/2;
		}else if (rightEye_y == 0 && leftEye_y != 0){
			average_y = leftEye_y;
		}else if(rightEye_y != 0 && leftEye_y == 0){
			average_y = rightEye_y;
		}else{
			average_y = midpoint; 
		}

		// Calculate the moving average of current frame
		current_y_sma = sma_y_average(average_y);
		
		// Calculate Max, Min and Midpoint Coordinates on the Screen	
		if(current_y_sma > max){
			max = current_y_sma;
		}
		if (current_y_sma < min){
			min = current_y_sma;
		}
		midpoint = (max+ min)/2;
		
		var xposition = 600;
		
		myeplayLivePosition.y = current_y_sma;
		myeplayLivePosition.x = xposition;
		document.dispatchEvent(myeplayLivePosition);
		
		if(current_y_sma < upper_threshold){
			document.dispatchEvent(myeplayStreamUpEvent);
			console.log("myeplayStreamUpEvent");
		}
		else if( current_y_sma > lower_threshold){
			document.dispatchEvent(myeplayStreamDownEvent);
			console.log("myeplayStreamDownEvent");
		}
		else{
			document.dispatchEvent(myeplayStreamCenterEvent);
			console.log("myeplayStreamCenterEvent");
		}
		
		
		
		
		// Set Gaze Location
		var cursor_y_position = (current_y_sma - 550) * (960/(1100 - 550));
		cursor.style.top = cursor_y_position + 'px';
		cursor.style.left= xposition+"px";
		
		var cursor2_y_position = (leftEye_y - 550) * (960/(1100 - 550));
		cursor2.style.top = cursor2_y_position + 'px';
		cursor2.style.left= 500+"px";
		
		//console.log("Max: "+max+", Min: "+min+", Midpoint: ",midpoint,", Display_Y: " + current_y_sma + "Cursor_y:" + cursor_y_position, "leftEye_y", leftEye_y, "rightEye_y", rightEye_y);
  })

})();

});