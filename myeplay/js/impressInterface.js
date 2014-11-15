
//create a slide in the slideshow with proper math for circle theme
var createSlide = function(id,x,radius,angle,html,image){
    var new_div = $("<div></div>");
    new_div.attr("id", id);
    new_div.attr("data-x", x*radius);
    new_div.attr("data-y", Math.round(Math.sin(-2*angle*Math.PI/360)*radius));
    new_div.attr("data-z", Math.round(Math.cos(-2*angle*Math.PI/360)*radius));
    new_div.attr("data-rotate-x", angle);
    new_div.addClass("step slide");
    new_div.html(html)
    new_div.css("background-image", "url(" + image + ")");
    $("#impress").append(new_div);
}

var radius = 500;


//create the slides and initiate impress
var results;
var videoIdArray = [];

var istart = function(){
  var id = 100;

  //cat videos!
  $.get( "https://www.googleapis.com/youtube/v3/search?part=snippet&q=cat&type=video&key=AIzaSyBO3mcDdOXKZ-iIEXOeUuOtTEuQtNnHx2g&maxResults=20"
  , function( data ) {
    results = data.items;
  })
  .done(function() {
    for(var i = 0; i < results.length; i++) {
        var videoId = results[i].id.videoId;
        videoIdArray.push(videoId);
    }
      
      // createSlide(++id, 0, radius, 0*45, "<a href='video.html'><img src='http://img.youtube.com/vi/xYemnKEKx0c/mqdefault.jpg'></a>");
      // createSlide(++id, 0, radius, 1*45, "<a href='game.html'>Games</a>");
      // createSlide(++id, 0, radius, 2*45, "<a href='quit.html'>Quit</a>");
      // createSlide(++id, 0, radius, 3*45, id);
      // createSlide(++id, 0, radius, 4*45, id);
      // createSlide(++id, 0, radius, 5*45, id);
      // createSlide(++id, 0, radius, 6*45, id);
      // createSlide(++id, 0, radius, 7*45, id);

      //loop through and put placeholder images
      var j = 0;
      var z = 0;
      for(var i=0; i<videoIdArray.length; i++){
          if (j == 8) {
            j = 0;
            z++;
          }
          j++;
          createSlide(++id, z, radius, j*45, "<a href='video.html'><img src='http://img.youtube.com/vi/" + videoIdArray[i] + "/mqdefault.jpg'></a>");
          
      }

      impress().init();
  });
}

var iclear = function(){
    $("#impress").html(" ");
}

var ireset = function(){
    iclear();
    istart();
}

istart();
