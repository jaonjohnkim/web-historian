// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var fs = require('fs');
var path = require('path');
var http = require('http');
var _ = require('underscore');
var { StringDecoder } = require('string_decoder');

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

exports.fetch = function () {
  fs.readFile(this.paths.list, (err, file) => {  
    if (err) {
      console.log('err reading sites.txt');
      throw err;
    } else {
      var decoder = new StringDecoder('utf8');
      this.allUrls = decoder.write(Buffer.from(file)).split('\n');
      
      _.each(this.allUrls, (url) => {
        this.isUrlInArchive(url);
      });
    }
  }); 
};

exports.isUrlInArchive = function(url) {
  //check and also call download or do nothing
  fs.readdir(this.paths.archivedSites, (err, sites) => {
    if (err) { throw error; }
    var bool = sites.reduce((acc, site) => {
      if (acc) { return true; }
      if (site === url + '.htm') { return true; }
      return false;
    }, false);
    
    if (!bool) {
      this.downloadUrls(url);
    }
  });
};

exports.downloadUrls = function(url) {
  console.log('inside download urls');
  var file = fs.createWriteStream(this.paths.archivedSites + '/' + url + '.htm');
  var request = http.get('http://' + url, (response) => {
    console.log(file);
    response.pipe(file);
  });
  console.log(request);
};










