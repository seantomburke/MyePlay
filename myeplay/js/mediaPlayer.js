videojs.options.flash.swf = "video-js.swf";
    
$(document).ready(function(){
  console.log("ready");

  $("#play").on("click", function(e){
    videojs.players["video"].play();
  });
  
  $("#pause").on("click", function(e){
    videojs.players["video"].pause();
  });

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
      videojs.players["video"].pause();
    }

    var deactivateMenu = function(e){
      if(! isHoverCloseButton) {
        return;
      }
      console.log("menu-deactivate");
      $("#menu").modal('hide');
      videojs.players["video"].play();
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
    

  // Volume Menu
  var activateVolumeMenu = function(e){
      if(! isHoverVolumeButton) {
        return;
      }
      console.log("menu-volume-activated");
      $("#menu").modal('hide');
      $("#volume").modal('show');
    }

  var modalTimerVolumeMenu = function(e) {
    console.log("modaltimer volumemenu called")
    if(secondsVolumeMenu == 0 && milliVolumeMenu == 0) {
      activateVolumeMenu(e);
      clearInterval(timerConstVolumeMenu);
      $("#volume-button").html("Volume");
    }
    else if(milliVolumeMenu == 0) {
      milliVolumeMenu = 9;
      --secondsVolumeMenu;
      $("#volume-button").html("" + secondsVolumeMenu + "." + milliVolumeMenu);
    }
    else {
      $("#volume-button").html("" + secondsVolumeMenu + "." + --milliVolumeMenu);
    }
  }

  $("#volume-button").on("mouseover", function(e) {
    isHoverVolumeButton = true;
    // sleep 2 seconds
      timerConstVolumeMenu = setInterval(function() {modalTimerVolumeMenu(e)}, 100);
  });

  $('#volume-button').on("mouseout", function(e) {
    isHoverVolumeButton = false;
    $("#volume-button").html("Volume");
    clearInterval(timerConstVolumeMenu);
    secondsVolumeMenu = 2;
    milliVolumeMenu = 1;
  });

  // Volume Menu Controls (Volume Up, Back, Volume Down)
  var volumeUp = function(e){ 
    if(! isHoverVolUp) {
      return;
    }
      console.log("hover-volumeup");
      currentVolume = videojs.players["video"].volume();
      if(currentVolume < 1)
        videojs.players["video"].volume(currentVolume + 0.1);
  }

  var deactivateVolumeMenu = function(e){
      if(! isHoverVolBack) {
        return;
      }
      console.log("menu-volume-deactivated");
      $("#volume").modal('hide');
      $("#menu").modal('show');
    }

  var volumeDown = function(e){ 
    if(! isHoverVolDown) {
      return;
    }
      console.log("hover-volumedown");
      //$("#menu").modal('toggle');
      currentVolume = videojs.players["video"].volume();
      if(currentVolume > 0)
        videojs.players["video"].volume(currentVolume - 0.1);
  }

  var modalTimerVolUp = function(e) {
    console.log("modaltimer volupcalled")
    if(secondsVolUp == 0 && milliVolUp == 0) {
      activateMenu(e);
      clearInterval(timerConstVolUp);
    }
    else if(milliVolUp == 0) {
      milliVolUp = 9;
      --secondsVolUp;
      $("#volumeup-button").html("" + secondsVolUp + "." + milliVolUp);
    }
    else {
      $("#volumeup-button").html("" + secondsVolUp + "." + --milliVolUp);
    }
  }

  var modalTimerVolBack = function(e) {
    console.log("modaltimer volbackcalled")
    if(secondsVolBack == 0 && milliVolBack == 0) {
      deactivateVolumeMenu(e);
      clearInterval(timerConstVolBack);
    }
    else if(milliVolBack == 0) {
      milliVolBack = 9;
      --secondsVolBack;
      $("#volumeback-button").html("" + secondsVolBack + "." + milliVolBack);
    }
    else {
      $("#volumeback-button").html("" + secondsVolBack + "." + --milliVolBack);
    }
  }

  var modalTimerVolDown = function(e) {
    console.log("modaltimer volDowncalled")
    if(secondsVolDown == 0 && milliVolDown == 0) {
      activateMenu(e);
      clearInterval(timerConstVolDown);
      $("#volumedown-button").html("" + secondsVolDown + "." + milliVolDown);
    }
    else if(milliVolDown == 0) {
      milliVolDown = 9;
      --secondsVolDown;
      $("#volumedown-button").html("" + secondsVolDown + "." + milliVolDown);
    }
    else {
      $("#volumedown-button").html("" + secondsVolDown + "." + --milliVolDown);
    }
  }

  $("#volumeup-button").on("mouseover", function(e) {
    isHoverVolUp = true;
    // sleep 2 seconds
      timerConstVolUp = setInterval(function() {modalTimerVolUp(e)}, 100);
  });

  $("#volumeback-button").on("mouseover", function(e) {
    isHoverVolBack = true;
    // sleep 2 seconds
      timerConstVolBack = setInterval(function() {modalTimerVolBack(e)}, 100);
  });

  $("#volumedown-button").on("mouseover", function(e) {
    isHoverVolDown = true;
    // sleep 2 seconds
      timerConstVolDown = setInterval(function() {modalTimerVolDown(e)}, 100);
  });

  $('#volumeup-button').on("mouseout", function(e) {
    isHoverVolUp = false;
    $("#volumeup-button").html("Volume Up");
    clearInterval(timerConstVolUp);
    secondsVolUp = 2;
    milliVolUp = 1;
  });

  $('#volumeback-button').on("mouseout", function(e) {
    isHoverVolBack = false;
    $("#volumeback-button").html("Back");
    clearInterval(timerConstVolBack);
    secondsVolBack = 2;
    milliVolBack = 1;
  });

  $('#volumedown-button').on("mouseout", function(e) {
    isHoverVolDown = false;
    $("#volumedown-button").html("Volume Down");
    clearInterval(timerConstVolDown);
    secondsVolDown = 2;
    milliVolDown = 1;
  });
});