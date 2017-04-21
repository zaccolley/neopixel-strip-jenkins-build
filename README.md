# neopixel strip jenkins build

see your jenkins build progress on a neopixel strip

## requires

1. neopixel strip
2. some kind of serial device to send data to it (ive been using a Arduinno)
3. upload node pixels firmata

```bash
npm install -g nodebots-interchange
interchange install git+https://github.com/ajfisher/node-pixel -a uno --firmata
```

## install

1. `npm install`
2. copy `.env-sample` to `.env` and fill in your jenkins project url
3. plugin neopixel strip into _pin 5_ on your serial device

## run

```bash
node main.js
```
