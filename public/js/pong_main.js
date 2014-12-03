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