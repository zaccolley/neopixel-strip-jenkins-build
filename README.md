# neopixel strip jenkins build

[![Greenkeeper badge](https://badges.greenkeeper.io/zaccolley/neopixel-strip-jenkins-build.svg)](https://greenkeeper.io/)

see your jenkins build progress on a neopixel strip

## requires

1. neopixel strip
2. some kind of serial device to send data to it (ive been using a Arduinno)

## install

1. `npm install`
2. copy `.env-sample` to `.env` and fill in your jenkins project url
3. plugin neopixel strip into _pin 5_ on your serial device

## run

`node main.js`
