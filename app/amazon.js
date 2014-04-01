var AWS = require('aws-sdk'),
	fs = require('fs'),
	path = require('path'),
	fileFolder = require('./fileFolder'),
	mimeTypes = require('./mimeTypes.json');
	
AWS.config.loadFromPath('../../awsConfig.json');
var s3 = new AWS.S3();

var mimeType = function(filePath){
	var ext = path.extname(filePath).substring(1),
		type = 'text/html';
	for(var fileType in mimeTypes){
		if(fileType === ext) type = mimeTypes[fileType];
	}
	return type;
};

exports.uploadToS3 = function(localFldr,bcktFolder){
	var baseFolder = path.join(__dirname,localFldr),
		baseKey = bcktFolder;

	var onEachFile = function(fd){
		fs.readFile(fd,function(err,data){
			if(err) throw err;
			//console.log(fd.split(baseFolder)[1]);
			var newKey = path.join(baseKey,fd.split(baseFolder)[1]).replace(/\\/,'/'),
				mt = mimeType(newKey);
			console.log(newKey);
			s3.putObject(
				{
					Bucket: 'jmaxwell.net',
					Key: newKey,
					Body: data,
					ContentType: mt
				},
				function(err,data){
					if(err) console.log(err, err.stack);
					else console.log(data);
				}
			);
		});
	};

	fileFolder.recursive(baseFolder,onEachFile);
}
