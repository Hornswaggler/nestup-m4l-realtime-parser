const maxApi = require('max-api');
const MAX_RENDER = 'onrender';
const MAX_MIDI = 'onmidi';
const MAX_LOADED = 'onloaded';

const PATCHING_RECTANGLE = '20.6 4. 930. 167.';
const PRESENTATION_RECTANGLE = '0. 0. 930. 167.';

const getNewViewport = ({port, id}) => `script newdefault ui 677 289 jweb @rendermode 1 @presentation 1 @presentation_rect ${PRESENTATION_RECTANGLE} @url http://localhost:8080/?id=${id}&port=${port} @patching_rect ${PATCHING_RECTANGLE}`;

const render = ({port, id}) => {
  console.log(`Loading ui for deviceId: ${id} port: ${port}`);
  maxApi.outlet([MAX_RENDER, getNewViewport({port, id})]);
};

const sendMidi = midi => maxApi.outlet([MAX_MIDI, ...midi]);

const sendOnLoad = () => maxApi.outlet([MAX_LOADED]);


module.exports = {
  render,
  sendMidi,
  sendOnLoad
}