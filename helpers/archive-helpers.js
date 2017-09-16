var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var { StringDecoder } = require('string_decoder');
var helpers = require('../web/http-helpers');
var http = require('http');
/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(url, callback, res) {
  // input: 
  // output:
  // process:
  //assume my callback is isUrlInList
  console.log('inside readListOfUrls');
  this.callback = callback;
  fs.readFile(this.paths.list, (err, file) => {  
    if (err) {
      console.log('err reading sites.txt');
      throw err;
    } else {
      var decoder = new StringDecoder('utf8');
      this.allUrls = decoder.write(Buffer.from(file)).split('\n');

      console.log('About to send into isUrlInList');
      this.callback(url, this.addUrlToList, res);
    }
  });
  

};

// Server Function
exports.isUrlInList = function(url, callback, res) {
  // input: target url
  // output: boolean
  // process: read sites.txt file in our archive, return whether its there
  // callback is addUrlToList
  console.log('inside isUrlInList');
  console.log('this.allUrls in readListOfUrls', this.allUrls);
  this.callback = callback;
  var bool = _.reduce(this.allUrls, (acc, val) => {
    if (acc) { return true; }
    if (val === url) { return true; }
    return false;
  }, false);
  if (bool) { // if URL is found in site.txt
    this.isUrlArchived(url, helpers.serveAssets, res);
    console.log('URL found, so next is checking if Archived');
  } else { 
    this.callback(url, helpers.serveAssets, res); //addUrlToList
    console.log('URL Not found, next is adding url to list');
  }

};
  // input:
  // output:
  // process:

// Server Function
exports.addUrlToList = function(url, callback, res) {
  // input: target url
  // output: n/a
  // process: write to sites.txt with new url
  // callback is the redirect function to display 'bots getting website'
  
  fs.appendFile(this.paths.list, '\n' + url, {flags: 'ax'}, (err) => {
    if (err) { throw err; }
    console.log('appended to file');
    callback(res, '/loading.html');
  });
};

// Worker & Server Function
exports.isUrlArchived = function(url, callback, res) {
  // input: target url
  // output: boolean
  // process: read sites.txt, see if property archived
  console.log('now inside isUrlArchived');
  fs.readdir(this.paths.archivedSites, (err, sites) => {
    if (err) { throw error; }
    var bool = sites.reduce((acc, site) => {
      console.log('Inside reduce', site);
      if (acc) { return true; }
      if (site === url + '.htm') { return true; }
      return false;
    }, false);
    
    if (bool) {
      console.log('Found site in archive, next is serving it');
      helpers.serveAssets(res, '/' + url + '.htm', callback, true);
    } else {
      console.log('Site not found, next is redirecting to loading html');
      // if this is server requesting redirect
      helpers.serveAssets(res, '/loading.html');
      // else if this is worker, then download
    }
  });
};

// Worker Function
exports.downloadUrls = function(urls) {

};






