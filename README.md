# BeatsPM
A beats-per-minute detector via algorithmic detection and tap-based calculation.

![BeatsPM](./screenshot.jpg?raw=true)

## About
A cross-platform application using Electron (created with [this boilerplate](https://github.com/chentsulin/electron-react-boilerplate#readme)) for detecting beats-per-minute via the html5 audio api or by calculating time between keyboard taps.

### Inspiration
Tap functionality inspired by (and re-written from) the code from [Rick Reel - all8](http://www.all8.com/tools/bpm.htm); which was inspired by, and rewritten from, [Derek Chilcote-Batto](http://www.mixed.net).

## Packaging for your OS
The `package.json` contains scripts for every platform. 

Run `npm run package-YOUR_OS` where `YOUR_OS` is either `win`, `linux`, or `all`.