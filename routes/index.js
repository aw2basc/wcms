exports.index = function(req, res){
	res.render('index');
};

exports.mainTemplates = function(req, res){
	var j = {};
	res.render('main', function(err, html){
		j.main = html;
		res.render('site', function(err, html){
			j.site = html;
			res.render('pages', function(err, html){
				j.pages = html;
				res.send(JSON.stringify(j));
			});
		});
	});
};
