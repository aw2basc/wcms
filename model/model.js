var mongodb = require('mongodb'),
	MongoClient = mongodb.MongoClient,
	ObjectID = mongodb.ObjectID,
	_ = require('underscore'),
	db=sites=pages={};

var errLog = function(err){
	if(err) console.warn(err.message);
};

function oid(id){
	return new ObjectID(id);
};

function findOne(col,id,cb){
	db.collection(col).findOne({_id:oid(id)}, function(err, data){
		errLog(err);
		cb(data);
	});
};

function upsert(col,id,obj,cb){
	db.collection(col).update({_id:oid(id)}, obj, {upsert:true}, function(err, data){
		errLog(err);
		cb(data);
	});
};

function insert(col,obj,cb){
	db.collection(col).insert(obj, function(err, data){
		errLog(err);
		cb(data[0]);
	});
};

exports.connect = function(uri){
	MongoClient.connect(uri, function(err, DB){
		errLog(err);
		db = DB;
	});
};

exports.read = function(col,id,cb){
	if(_.isEmpty(db)) _.delay(findOne,250,col,id,cb);
	else findOne(col,id,cb);
};

exports.update = function(col,id,obj,cb){
	if(_.isEmpty(db)) _.delay(upsert,250,col,id,obj,cb);
	else upsert(col,id,obj,cb);
};

exports.insert = function(col,obj,cb){
	if(_.isEmpty(db)) _.delay(insert,250,col,obj,cb);
	else insert(col,obj,cb);
};

