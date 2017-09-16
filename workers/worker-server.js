// var http = require('http');
// var archive = require('../helpers/archive-helpers');
var worker = require('./htmlfetcher');
var CronJob = require('cron').CronJob;

// var port = 3000;
// var ip = '127.0.0.1';

// var workerServer = http.createServer((res, req) => {
  
// });
// workerServer.listen(port, ip);

var task = new CronJob('*/1 * * * *', () => {
  console.log('Triggering fetch');
  worker.fetch();
}, null, true);