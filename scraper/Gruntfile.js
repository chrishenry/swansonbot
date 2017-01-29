var scrape = require('./scraper')

module.exports = function(grunt) {

  grunt.registerTask('scrape-tvfanatic', 'Scrape tvfanatic\'s Ron Swanson quotes', function() {

    // Force task into async mode and grab a handle to the "done" function.
    var done = this.async();

    // Run some sync stuff.
    grunt.log.writeln('Processing task...');

    scrape(done);

  });

};
