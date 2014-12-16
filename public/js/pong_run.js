(function () {
    'use strict';
    var sound = new Audio("http://www.oringz.com/oringz-uploads/sounds-917-communication-channel.mp3");

    var title = document.getElementById('title'),
        pongWrap = document.getElementById('pong'),
        game = new window.Pong(pongWrap),
        mainWrap = document.getElementById('wrap'),
        updateFn,
        keyCodes = {
            37: 'LEFT',
            38: 'UP',
            39: 'RIGHT',
            40: 'DOWN',
            65: 'A',
            68: 'D',
            83: 'S',
            87: 'W'
        },
        botMinSteps = 5,
        botSpeed = 250,
        update = function () {
            if (updateFn) { updateFn(); }
        };

    function init () {
        window.gameEvents = {
            key: {}
        };

        resetEvents();

        window.onkeydown = function (e) {
            if (keyCodes.hasOwnProperty(e.keyCode)) {
                window.gameEvents.key[keyCodes[e.keyCode]] = true;
            }
        };

        //usage 
        // var event = new Event("myeplay-stream-up");
        // event.value = 10;
        // document.dispatchEvent(event);

        var menuOpen = false;

        document.addEventListener("myeplay-stream-up",function(e){
            console.log(e);
            // game.players.a.move(e.value);
            game.players.a.move(-5);
        },false);


        document.addEventListener("myeplay-stream-down",function(e){
            console.log(e);
            // game.players.a.move(e.value);
            game.players.a.move(5);
        },false);

        //var up = new Event("myeplay-action-up");
        //document.dispatchEvent(up);
        document.addEventListener("myeplay-action-up",function(e){
            console.log(e);
            // game.players.a.move(e.value);
            if(menuOpen) {
              sound.pause();
              game.resume();
              $("#menu").modal('hide');
              menuOpen = false;
            } 
        },false);

        //var down = new Event("myeplay-action-down");
        //document.dispatchEvent(down);
        document.addEventListener("myeplay-action-down",function(e){
            console.log(e);
            // game.players.a.move(e.value);
            if(menuOpen) {
                sound.pause();
                menuOpen = false;
                window.location.href="/index";
                
            } 
        },false);

        // var close = new Event("myeplay-action-close");
        // document.dispatchEvent(close);

        document.addEventListener("myeplay-action-close",function(e){
            console.log(e);
            sound.play();
            game.pause(); 
            $("#menu").modal('show');
            menuOpen = true;
        },false);

        window.onkeyup = function (e) {
            if (keyCodes.hasOwnProperty(e.keyCode)) {
                window.gameEvents.key[keyCodes[e.keyCode]] = false;
            }
        };

        game.players.b.addControls({
            'p2UP': 'up',
            'p2DOWN': 'down',
        });

        game.on('beforeupdate', function () {
            update();
        });

        game.on('hit', function () {
            window.gameEvents.hit = true;
        });

        game.players.a.on('point', function () {
            window.gameEvents.goal.a = true;
        });

        game.players.b.on('point', function () {
            window.gameEvents.goal.b = true;
        });
    }

    function setDefaults () {



        window.pongSettings = {
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: '#222222',
            linesColor: '#eeeeee',
            ball: {
                size: 13,
                //speed: 10,
                velocity: [ 300, 300],
                color: '#eeeeee',
            },
            font: {
                type: 'Arial',
                size: 50,
                bold: false,
                italic: false,
                color: '#eeeeee'
            },
            players: {
                a: { height: 250, color: '#eeeeee', speed: 250 },
                b: { height: 250, color: '#eeeeee', speed: 250 }
            },
            botDir: null,
            botCounter: 0,
            title: 'Pong'
        };
    }

    function updateBot () {
        window.pongSettings.botCounter += 1;


        if (window.pongSettings.botCounter > botMinSteps) {
            window.pongSettings.botCounter = 0;
            // Update bot direction
            if (game.balls.length && game.balls[0].x < 0) {
                if ( game.players.a.y < game.balls[0].y) {
                   window.pongSettings.botDir = 1;
                } else if (game.balls.length && game.players.a.y > game.balls[0].y) {
                    window.pongSettings.botDir = -1;
                }
            } else {
                window.pongSettings.botDir = null;
            }
        }

        if (window.pongSettings.botDir !== null) {
            game.players.a.move(window.pongSettings.botDir);
        }
    }

    function launchPong (gameFn, useBot) {
        setDefaults();

        game.start();
        game.players.a.addControls({
            'p1UP': 'q',
            'p1DOWN': 'a',
        });

        game.reset();

        gameFn();

        updateFn = function () {
            gameFn();
            resetEvents();

            if (useBot) {
                game.players.a.setSpeed(botSpeed);
                updateBot();
            }
        };

        runStartups();
    }

    function resetEvents () {
        window.gameEvents.hit = false;
        window.gameEvents.goal = {
            a: false,
            b: false
        };
    }

    function resize () {
        game.resize();
        // console.log((document.body.offsetWidth - pongWrap.offsetWidth) / 2 + 'px');
        //mainWrap.style.left = (document.body.offsetWidth - mainWrap.offsetWidth) / 2 + 'px';
        //mainWrap.style.top = (document.body.offsetHeight - mainWrap.offsetHeight) / 2 + 'px';
        //mainWrap.style.top = '-60px';
        
    }

    function runStartups () {
        var txtOpt = window.pongSettings.font,
            font = txtOpt.size + 'px ' + txtOpt.type;

        if (txtOpt.bold) {
            font = 'bold ' + font;
        }

        if (txtOpt.italic) {
            font = 'italic ' + font;
        }

        pongWrap.style.width = window.pongSettings.width + 'px';
        pongWrap.style.height = window.pongSettings.height + 'px';
        //pongWrap.style.width = "1000px";

        resize();

        game.resize();

        game.setBackgroundColor(window.pongSettings.backgroundColor);
        game.setLinesColor(window.pongSettings.linesColor);
        game.setBallColor(window.pongSettings.ball.color);
        game.setBallSize(window.pongSettings.ball.size);
        game.setBallVelocity(window.pongSettings.ball.velocity);

        game.setTextStyle({
            font: font,
            color: txtOpt.color
        });

        for (var key in game.players) {
            if (game.players.hasOwnProperty(key)) {
                game.players[key].setHeight(window.pongSettings.players[key].height);
                game.players[key].speed = window.pongSettings.players[key].speed;
                game.players[key].setColor(window.pongSettings.players[key].color);
            }
        }

        game.refresh();
    }

    window.onresize = function () {
        resize();
    };

    init();
    window.launchPong = launchPong;
    window.game = game;
}());