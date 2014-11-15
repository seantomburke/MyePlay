//dependencies for each module used
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var path = require('path');
var handlebars = require('express3-handlebars');

var passport = require('passport');

//route files to load
var index = require('./routes/index');

//Configures the Template engine
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());
app.use(passport.initialize());
app.use(express.session({ secret: 'feed me' }));
app.use(passport.session());

//routes
app.get('/', index.view);
app.get('/video', index.video);

//set environment ports and start application
app.set('port', process.env.PORT || 2014);
http.listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

