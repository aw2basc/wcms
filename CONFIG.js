var path = require('path'),
	config = {
		routes : './routes',
		views : path.join(__dirname, 'views'),
		public : path.join(__dirname, 'public')
	};

module.exports = exports = function(){
	return config;
};

