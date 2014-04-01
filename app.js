var http = require('http'),
	_ = require('underscore'),
// config
	CONFIG = require('./CONFIG.js')(),
// express
	express = require('express'),
	routes = require(CONFIG.routes),
	app = express(),
	server = http.createServer(app),
	cons = require('consolidate'),
// passport
	passport = require('passport'),
	GoogleStrategy = require('passport-google').Strategy,
// amazon
	amazon = require('./app/amazon'),
//render
	render = require('./app/render.js'),
// mongodb
	mongo = require('./app/mongo.js');

mongo.connect('mongodb://127.0.0.1:27017/wcms');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', CONFIG.views);
app.engine('html', cons.mustache);
app.set('view engine', 'html');
// middleware
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'CRUX' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(CONFIG.public));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

// routes
app.get('/', routes.index);
app.get('/main/templates', routes.mainTemplates);

app.get('/sites/:id', function(req,res){
	mongo.read('sites',req.params.id,function(data){
		res.send(data);
	});
});
app.put('/sites/:id', function(req,res){
	mongo.update('sites', req.params.id, _.omit(req.body, '_id'), function(data){
		res.send(data);
	});
});
app.get('/pages/:id', function(req,res){
	mongo.read('pages',req.params.id,function(data){
		res.send(data);
	});
});
app.put('/pages/:id', function(req,res){
	mongo.update('pages', req.params.id, _.omit(req.body, '_id'), function(data){
		res.send(data);
	});
});
app.post('/pages', function(req,res){
	mongo.insert('pages', req.body, function(data){
		res.send(data);
	});
});

// render
app.get('/render/:id', function(req,res){
	var renderData = {};
	mongo.read('sites',req.params.id,function(data){
		renderData = data;
		for(var i=0;i<data.sitePages.length;i++){
			(function(i,max){
				mongo.read('pages', data.sitePages[i], function(pageData){
					renderData.sitePages[i] = pageData;
					if(i+1 === max){
						render.create(renderData,res);
					}
				});
			}(i,data.sitePages.length));
		}
	});
});

// publish
app.get('/publish', function(req,res){
	amazon.uploadToS3('../SITE/gbfumc','test/');
	res.send('');
});
	
// passport
/*
passport.serializeUser(function(user, done) {
	done(null, 1);
});
passport.deserializeUser(function(id, done) {
	done(null, 1);
});
passport.use(
	new GoogleStrategy({
		returnURL: 'http://127.0.0.1:3000/auth/google/return',
		realm: 'http://127.0.0.1:3000',
		profile: true
	},
	function(identifier, profile, done) {
		done(null, 1);
	})
);
app.get('/auth/google', passport.authenticate('google'));
app.get('/auth/google/return', passport.authenticate('google', { successRedirect: '/home', failureRedirect: '/' }));
*/

// start server
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
