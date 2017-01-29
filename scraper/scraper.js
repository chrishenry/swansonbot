/**
 * Include dependencies
 */
var striptags = require('striptags'),
    cheerio = require('cheerio'),
    async = require('async'),
    os = require('os'),
    fs = require('fs'),
    url = require('url'),
    request = require('request');


var scrape = function(done) {

  var url = "https://www.tvfanatic.com/quotes/characters/ron-swanson/";
  var quotes = [];

  request(url, function(error, response, html){

      // First we'll check to make sure no errors occurred when making the request
      if(!error){

          // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
          var $ = cheerio.load(html);

          // get the first page of links
          quotes = quotes.concat(get_links($));

          var coll = []
          for (i = 2; i <= 25; i++) {
            coll.push(i);
          }

          var get_quote_page = function(i, cb){
            var rq_url = url + "page-" + i + ".html";
            request(rq_url, function(error, response, html){
              cb(false, get_links(cheerio.load(html)));
            })
          }

          async.map(coll, get_quote_page, function(err, results){

            var filename = 'quotes.txt';

            fs.exists(filename, function(exists){
              if(!exists) {
                fs.unlink(filename);
              }
            });

            var flat_results = [].concat.apply([], results);
            var file = fs.writeFile(
              filename,
              flat_results.join("\n"),
              function (err) { if (err) { console.error(err); } }
            );

            done();
          })



      }
  });

  var get_links = function($) {

    var ps = $('.quotes blockquote p'),
        retval = [];

    $(ps).each(function(i, p){
      var cleaned_text = clean($(p).text());
      if(cleaned_text) {
        retval.push(cleaned_text)
      }
    });

    return retval;

  }

  var clean = function(text) {

    // Not interested in conversations
    if(text.indexOf("Ron:") >= 0) {
      return false;
    }

    return text.trim();

  }

};

module.exports = scrape;
