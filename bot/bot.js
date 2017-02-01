var Botkit = require('botkit');
var os = require('os');
var giphy = require('giphy-api')();

var controller = Botkit.slackbot({
  debug: true
});

var bot = controller.spawn({
  token: process.env.SLACK_API_TOKEN
})

bot.startRTM(function(err,bot,payload) {
  if (err) {
    throw new Error('Could not connect to Slack');
  }
});

controller.hears(['uptime', 'identify yourself', 'who are you', 'what is your name'],
    'direct_message,direct_mention,mention', function(bot, message) {

        var hostname = os.hostname();
        var uptime = formatUptime(process.uptime());

        bot.reply(message,
            ':robot_face: I am a bot named <@' + bot.identity.name +
             '>. I have been running for ' + uptime);

});

controller.hears(['government'], 'ambient', function(bot, message){
    bot.reply(message, "The government is horribly inefficient.")
});

controller.hears(['gif'], 'ambient', function(bot, message){
    giphy.search('ron swanson', function(err, res) {
        var gif_url = res['data'][0]['images']['original']['url'];
        bot.reply(message, gif_url)
    });
});

function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}




