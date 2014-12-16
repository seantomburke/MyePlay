
// $(document).ready(function(){
launchPong(function () {
    function colour_random() {
        var num = Math.floor(Math.random() * Math.pow(2, 24));
        return '#' + ('00000' + num.toString(16)).substr(-6), false;
    }
    
    
    pongSettings.ball.size = 30;
    pongSettings.ball.color = colour_random();
    pongSettings.ball.velocity[0] = 10;
    pongSettings.ball.velocity[1] = 10;
    
}, false);


 var isHoverMenuActivate = isHoverCloseButton = isHoverVolumeButton = 
    isHoverVolUp = isHoverVolBack = isHoverVolDown = false;

  var timerConstOpen, timerConstClose, timerConstVolumeMenu, timerConstVolUp, 
    timerConstVolBack, timerConstVolDown;

  var secondsOpen = secondsClose = secondsVolumeMenu = secondsVolUp = 
    secondsVolBack = secondsVolDown = 2;

  var milliOpen = milliClose = milliVolumeMenu = milliVolUp = 
    milliVolBack = milliVolDown = 1;

  var currentVolume;

    var activateMenu = function(e){ 
    if(! isHoverMenuActivate) {
      return;
    }
      console.log("menu-activate");
      $("#menu").modal('show');
      game.pause();
    }

    var deactivateMenu = function(e){
      if(! isHoverCloseButton) {
        return;
      }
      console.log("menu-deactivate");
      $("#menu").modal('hide');
      game.resume();
    }

  var modalTimerOpenMenu = function(e) {
    console.log("modaltimer openmenucalled")
    if(secondsOpen == 0 && milliOpen == 0) {
      activateMenu(e);
      clearInterval(timerConstOpen);
    }
    else if(milliOpen == 0) {
      milliOpen = 9;
      --secondsOpen;
      $("#menu-activate").html("" + secondsOpen + "." + milliOpen);
    }
    else {
      $("#menu-activate").html("" + secondsOpen + "." + --milliOpen);
    }
  }

  var modalTimerCloseMenu = function(e) {
    console.log("modaltimer closemenu called")
    if(secondsClose == 0 && milliClose == 0) {
      deactivateMenu(e);
      clearInterval(timerConstClose);
      $("#close-button").html("Close");
    }
    else if(milliClose == 0) {
      milliClose = 9;
      --secondsClose;
      $("#close-button").html("" + secondsClose + "." + milliClose);
    }
    else {
      $("#close-button").html("" + secondsClose + "." + --milliClose);
    }
  }

    $("#menu-activate").on("mouseover", function(e) {
    isHoverMenuActivate = true;
    // sleep 2 seconds
      $("#menu-activate").css("background-color", "#CCCCCC");
      timerConstOpen = setInterval(function() {modalTimerOpenMenu(e)}, 100);
  });

  $("#close-button").on("mouseover", function(e) {
    isHoverCloseButton = true;
    // sleep 2 seconds
      timerConstClose = setInterval(function() {modalTimerCloseMenu(e)}, 100);
  });

  $('#menu-activate').on("mouseout", function(e) {
    isHoverMenuActivate = false;
    $("#menu-activate").css("background-color", "#555555");

    clearInterval(timerConstOpen);
    $("#menu-activate").html("");
    secondsOpen = 2;
    milliOpen = 1;
  });

  $('#close-button').on("mouseout", function(e) {
    isHoverCloseButton = false;
    $("#close-button").html("Close");
    clearInterval(timerConstClose);
    secondsClose = 2;
    milliClose = 1;
  });

game.start();
// });