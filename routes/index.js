exports.view = function(req, res) {
	res.render('index');
}

exports.video = function(req, res) {
  console.log("Request recieved for youtube video id " + req.params.id);
  res.render('video', {videoId: req.params.id});
}