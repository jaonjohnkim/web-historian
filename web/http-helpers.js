var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset, /*callback*/ isArchive) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  
  if (isArchive) {
    var link = archive.paths.archivedSites + asset;
  } else {
    var link = archive.paths.siteAssets + asset;
  }
  console.log('link', link);
  fs.readFile(link, (err, file) => {
    if (asset.includes('htm')) {
      var header = {'Content-Type': 'text/html'};
    } else if (asset.includes('css')) {
      var header = {'Content-Type': 'text/css'};
    }
    if (err) {
      // console.log('File NOT found!');
      res.writeHead(404, header);
      res.end('File Not Found');
    } else if (asset.includes('loading')) {
      // console.log('File found!');
      res.writeHead(302, header);
      res.end(file);
    } else {  
      res.writeHead(200, header);
      res.end(file);
    }
  });
};



// As you progress, keep thinking about what helper functions you can put here!
