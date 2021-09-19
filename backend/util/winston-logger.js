// logs6.papertrailapp.com:39182


const winston = require('winston');

  //
  // Requiring `winston-papertrail` will expose
  // `winston.transports.Papertrail`
  //
  require('winston-papertrail').Papertrail;

  var winstonPapertrail = new winston.transports.Http({
	host: 'logs6.papertrailapp.com',
	port: 39182
  })
  
  winstonPapertrail.on('error', function(err) {
	// Handle, report, or silently ignore connection errors and failures
  });

  
  var logger = winston.createLogger({
	transports: [winstonPapertrail]
  });


  module.exports = logger

