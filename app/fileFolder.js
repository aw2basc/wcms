var fs = require('fs'),
	path = require('path'),
	git = /\.git/,
	nodeModules = /node_modules/;

var readDir = function(rDir,cb){
	if(rDir.match(git) === null && rDir.match(nodeModules) === null){
		fs.readdir(rDir, function (err, contents) {
			if (err) { throw err; };
			contents.forEach(function(fd){
				var fdPath = path.join(rDir,fd);
				fs.stat(fdPath, function(err,stats){
					if(stats.isFile()){
						cb(fdPath);
					}else{
						readDir(fdPath,cb);
					}
				});
			});
		});
	}
};

exports.recursive = function(rDir,cb){
	readDir(rDir,cb);
};
