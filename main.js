require('dotenv').config();

const pixel = require('node-pixel');
const five = require('johnny-five');
const request = require('request');

const board = new five.Board();

const secondsToCheck = 30;

if (!process.env.JENKINS_URL) {
  return console.log('✋ You need to supply a Jenkins URL in the .env file');
}

if (!process.env.PIXEL_AMOUNT) {
  return console.log('✋ You need to specify the amount of neopixels in your strip');
}

const pixelAmount = process.env.PIXEL_AMOUNT;

const url = `${process.env.JENKINS_URL}/lastBuild/api/json`;

function getLatestBuild(callback) {
  request(url, function (error, response, body) {
    if (!response) {
      return console.log('🚨 Error: Couldnt reach Jenkins');
    }

    if (response.statusCode !== 200) {
      return console.log('🚨 Error: Couldnt reach Jenkins. Status code: ', response.statusCode);
    }

    if (error) {
      return console.log('🚨 Error: Something went wrong...', error);
    }

    const data = JSON.parse(body);

    callback(data);
  });
}

function setStateBuilding(data, strip) {
  var startedAt = new Date(data.timestamp);
  var timeNow = new Date();

  var estimatedDuration = data.estimatedDuration;
  var currentDuration = timeNow - startedAt;

  var percentComplete = currentDuration / estimatedDuration;

  console.log('~');
  console.log('Time build started', startedAt);
  console.log('Estimated duration in minutes', Math.floor(estimatedDuration / 1000 / 60));
  console.log('Current duration in minutes', Math.floor(currentDuration / 1000 / 60));
  console.log('Percent complete', `${Math.ceil(percentComplete * 100)}%`);
  console.log('~');

  for (var i = 0; i < pixelAmount; i++) {
    var a = pixelAmount / 2;
    var b = (percentComplete * a) + 1;
    var c = Math.floor(pixelAmount / b);

    var pixelPos = pixelAmount - 1 - i;

    if (i % c === 0) {
      var colour = 255 - Math.floor(255 * percentComplete);
      strip.pixel(pixelPos).color([colour, 50, colour]);
    } else {
      strip.pixel(pixelPos).color([0, 0, 0]);
    }
  }
}

function setStateSuccess(strip) {
  strip.color([0, 50, 0]);
}

function setStateOther(strip) {
  strip.color([200, 100, 255]);
}

function checkStatus(strip) {
  getLatestBuild(function(data) {
    console.log(data.result ? `🤖 ${data.result.toLowerCase()}` : '🚧 building', new Date());

    const buildSuccessful = data.result === 'SUCCESS';

    if (data.building) {
      setStateBuilding(data, strip);
    } else if (buildSuccessful) {
      setStateSuccess(strip);
    } else {
      setStateOther(strip)
    }

    strip.show();
  });
}

board.on('ready', function() {
  const strip = new pixel.Strip({
    board: this,
    controller: 'FIRMATA',
    strips: [{ pin: 5, length: pixelAmount }] // this is preferred form for definition
  });

  strip.on('ready', function() {
    checkStatus(strip);
    setInterval(function() {
      checkStatus(strip);
    }, 1000 * secondsToCheck);
  });
});
