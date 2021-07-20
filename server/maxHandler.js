const maxApi = require('max-api');
const {handleClock} = require('./clockHandler');
const {commit} = require('./store');
const {sendMidi, render} = require('./maxInterface');
const {startServer} = require('./server');

const EVENT_CLOCK = 'EVENT_CLOCK';
const EVENT_MIDI = 'EVENT_MIDI';
const EVENT_LOADED = 'EVENT_LOADED';


const MESSAGE_TYPES = {
  ...(Object.keys(maxApi.MESSAGE_TYPES).reduce((acc, k) => {
     acc[`EVENT_${k}`] = maxApi.MESSAGE_TYPES[k];
     return acc;
  }, {})),
  EVENT_CLOCK,
  EVENT_MIDI,
  EVENT_LOADED
};


const stop = () => {
  commit('lastTick', 0);
  commit('count', -1);
  commit('totalCount', 0);
  commit('elapsed', 0);
};

const noteEnd = () => {};

const MIDI_MESSAGE_MAP = {
  128: noteEnd,
  0: stop
};

const handleMidi = midi => {
  sendMidi([midi]);
  if (MIDI_MESSAGE_MAP[midi]) return MIDI_MESSAGE_MAP[midi]();
};

const handleOnLoad = id => {
  const server = startServer();
  const port = server.address().port;
  render({port, id});
}

const handlers = {
  [MESSAGE_TYPES.EVENT_MIDI]: handleMidi,
  [MESSAGE_TYPES.EVENT_CLOCK]: handleClock,
  [MESSAGE_TYPES.EVENT_LOADED]: handleOnLoad
};

maxApi.addHandlers(handlers);