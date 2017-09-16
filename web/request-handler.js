var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers');
var fs = require('fs');
// var qs = require('queryString');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  console.log('handle Request triggered');
  var url = req.url;
  console.log(`processing request for ${req.url}`);
  
  if (req.method === 'POST') {
    var data = '';
    req.on('data', (chunk) => {
      console.log('What is chunk?', chunk);
      data += chunk;
    });
    req.on('end', () => {
      var website = data.split('=')[1];
      console.log('bool', archive.isUrlInList(website));
      if (archive.isUrlInList(website)) {
        console.log('Website in sites.txt');
      } else {
        console.log('Adding website to sites.txt...');
        archive.addUrlToList(website);
      }
        
    });
    
    // console.log('Post url', req);
  } else if (req.method === 'GET') {
    if (url === '/') { url = '/index.html'; }
    // console.log(archive.paths.siteAssets, url);
    fs.readFile(archive.paths.siteAssets + url, (err, file) => {
      if (url.includes('html')) {
        var header = {'Content-Type': 'text/html'};
      } else if (url.includes('css')) {
        var header = {'Content-Type': 'text/css'};
      }
      if (err) {
        // console.log('File NOT found!');
        res.writeHead(404, header);
        res.end('File Not Found');
      } else {
        // console.log('File found!');
        res.writeHead(200, header);
        res.end(file);
      }
    });
  }
  
  if (url === '/') { url = '/index.html'; }
    // console.log(archive.paths.siteAssets, url);
  fs.readFile(archive.paths.siteAssets + url, (err, file) => {
    if (url.includes('html')) {
      var header = {'Content-Type': 'text/html'};
    } else if (url.includes('css')) {
      var header = {'Content-Type': 'text/css'};
    }
    if (err) {
      // console.log('File NOT found!');
      res.writeHead(404, header);
      res.end('File Not Found');
    } else {
      // console.log('File found!');
      res.writeHead(200, header);
      res.end(file);
    }
  });
  
  // archive.readListOfUrls();
  
  // if (!archive.isUrlInList('www.google.com')) {
  //   archive.addUrlToList('www.google.com');
  // }
  // archive.addUrlToList('urlybird');
  // archive.addUrlToList('nutherone');
  // console.log('is in list?', archive.isUrlInList('one'));
  // console.log('is in list?', archive.isUrlInList('nutherone'));
  // console.log('archive.readListOfUrls', archive.readListOfUrls(function (arrayUrls) {
  //   console.log('array of urls', arrayUrls);
  // }));

  // res.end(archive.paths.list);
};