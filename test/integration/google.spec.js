const { startSelenium, closeSelenium, restoreDatabase } = require('../testUtil');
const asyncLib = require('async');

module.exports = {
	before: function (browser, done) {
		console.log('--before--');
		asyncLib.series([
			startSelenium,
			(cb) => restoreDatabase('/path-to-db.bak', 'dbName', 'dbName', 'owner', cb) // will set password to '1'
		], done);
	},

	after: function(browser, done) {
		console.log('--after--');
		closeSelenium(done);
	},

	'Test Google': function(browser) {
		console.log('--test google--');
		browser
			.url('http://google.com')
			.pause(1000)
			.end();
	}
};