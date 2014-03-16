var fs = require('fs'),
	_ = require('underscore');

exports.create = function(data,res){
	fs.readFile('./SITE/gbfumc/template.html', 'utf-8', function(e,file){
		var template = _.template(file);
		for(var i=0;i<data.sitePages.length;i++){
			(function(i){
				fs.writeFile('./SITE/gbfumc/' + data.sitePages[i].pageName + '.html',
					template({
						pageName : data.sitePages[i].pageName,
						header : _.unescape(data.sitePages[i].pageTags[0].tagValue),
						content : _.unescape(data.sitePages[i].pageTags[1].tagValue)
					}),
					'utf-8',
					function(e){
						if(e) throw e;
						// res.send('rendered');
					}
				);
			}(i));
		}
		console.log('rendering');
	});
};
