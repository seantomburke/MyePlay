launchPong(function () {
    function colour_random() {
        var num = Math.floor(Math.random() * Math.pow(2, 24));
        return '#' + ('00000' + num.toString(16)).substr(-6), false;
    }
    
    
    pongSettings.ball.size = 25;
    pongSettings.ball.color = colour_random();
    pongSettings.ball.velocity[0] = 7;
    pongSettings.ball.velocity[1] = 7;
    
}, false);