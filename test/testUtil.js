const selenium = require('selenium-standalone');
const pkill = require('pkill');
const asyncLib = require('async');
const process = require('child_process');

let seleniumStarted = false;

function startSelenium(callback) {
	console.log('--startSelenium--');
	if (seleniumStarted) {
		return callback();
	}
	asyncLib.series([
		(cb) => pkill.full('selenium-standalone', cb),
		function(cb) {
			selenium.install({
				// logger: console.log // can be uncommented for debug purposes
			}, cb);
		},
		selenium.start
	], (err) => {
		if (err) {
			return callback(err);
		}
		seleniumStarted = true;
		callback();
	});
}

function closeSelenium(callback) {
	console.log('--closeSelenium--');
	pkill.full('selenium-standalone', callback);
}

function restoreDatabase(bakPath, dbName, oldDbName, owner, callback) {
	console.log('--restoreDatabase--');
	const restoreProcess = process.spawn('sql-bak-restore', [bakPath, dbName, oldDbName, owner]);

	let stdout = '';
	let stderr = '';

	restoreProcess.stdout.on('data', function(message) { stdout += log(message); });
	restoreProcess.stderr.on('data', function(message) { stderr += log(message); });

	restoreProcess.on('exit',  function(code) {
		console.log('Restore Database Exit code: ' + code);
		if (code > 0) {
			const message = 'sql-bak-restore failed' + (stderr ?
					': \r\n\r\n' + stderr : '.');
			callback(new Error(message));
		} else {
			callback();
		}
	});

	function log(message) {
		message = message.toString('utf8');
		console.log(message);
		return message;
	}
}

module.exports = {
	startSelenium,
	closeSelenium,
	restoreDatabase
};