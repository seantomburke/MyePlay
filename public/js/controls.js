videojs.options.flash.swf = "video-js.swf";
$(document).ready(function(){
  var currentlyPlaying = true;
  $(document).keydown(function(e){
    if (e.which == 37) { // 37 is the left arrow key code.
    };

    //goes back
    if (e.which == 38) { // 38 is the up arrow key code.
      if (!window.location.origin) {
        window.location.origin = window.location.protocol+"//"+window.location.host;
      }

      window.location.href = window.location.origin + "/index";
      
    };
    if (e.which == 39) { // 39 is the right arrow key code.
      console.log("right");
    };

    //toggles pause and play
    if (e.which == 40) { // 40 is the down arrow key code.
      $("#menu").modal('hide');
      currentlyPlaying = !currentlyPlaying;
      if (!currentlyPlaying) {
        videojs.players["video"].pause();
      } else {
        videojs.players["video"].play();
      }
    };
  });
});