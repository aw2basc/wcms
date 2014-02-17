exports.index = function(req, res){
	res.render('index');
};

exports.mainTemplates = function(req, res){
	var j = {},
		vws = ['main','site','pages','tags'],
		i;
	for(i=0;i<vws.length;i++){
		(function(i){
			res.render(vws[i],function(e,html){
				j[vws[i]] = html;
				if(++i === vws.length){
					res.send(JSON.stringify(j));
				}
			});
		})(i);
	}
};

