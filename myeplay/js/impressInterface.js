
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

var istart = function(){

    var id = 100;
    
    createSlide(++id, 0, radius, 0*45, "<a href='video.html'><img src='http://img.youtube.com/vi/xYemnKEKx0c/mqdefault.jpg'></a>");
    createSlide(++id, 0, radius, 1*45, "<a href='game.html'>Games</a>");
    createSlide(++id, 0, radius, 2*45, "<a href='quit.html'>Quit</a>");
    // createSlide(++id, 0, radius, 3*45, id);
    // createSlide(++id, 0, radius, 4*45, id);
    // createSlide(++id, 0, radius, 5*45, id);
    // createSlide(++id, 0, radius, 6*45, id);
    // createSlide(++id, 0, radius, 7*45, id);


    //loop through and put placeholder images
    // for(var i=1;i<5;i++){
    //     for(var j=0;j<8;j++){
    //         createSlide(++id, i, radius, j*45, "test " + id,"http://lorempixel.com/400/400/?v="+id);
    //     }
    // }

    impress().init();
}

var iclear = function(){
    $("#impress").html(" ");
}

var ireset = function(){
    iclear();
    istart();
}

istart();
