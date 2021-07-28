const maxApi = require('max-api');
const {handleClock} = require('./clockHandler');
const {commit} = require('./store');
const {sendMidi, render} = require('./maxInterface');
const {startServer, sendAll} = require('./wsServer');
// const {startServer} = require('./server');
let _socket = {};

const EVENT_CLOCK = 'EVENT_CLOCK';
const EVENT_MIDI = 'EVENT_MIDI';
const EVENT_LOADED = 'EVENT_LOADED';
const EVENT_DIAL = 'EVENT_DIAL';


const MESSAGE_TYPES = {
  ...(Object.keys(maxApi.MESSAGE_TYPES).reduce((acc, k) => {
     acc[`EVENT_${k}`] = maxApi.MESSAGE_TYPES[k];
     return acc;
  }, {})),
  EVENT_CLOCK,
  EVENT_MIDI,
  EVENT_LOADED,
  EVENT_DIAL
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

const handleOnLoad = async id => {
  const {port} = await startServer((payload, ws) => {
    console.log('Received: value', payload);
  });
  render({port, id});
}

const handleDialChanged = dial => {
  console.log('Dial Changed: ', dial);
  sendAll(JSON.stringify({dial}));
}

const handlers = {
  [MESSAGE_TYPES.EVENT_MIDI]: handleMidi,
  [MESSAGE_TYPES.EVENT_CLOCK]: handleClock,
  [MESSAGE_TYPES.EVENT_LOADED]: handleOnLoad,
  [MESSAGE_TYPES.EVENT_DIAL]: handleDialChanged
};

maxApi.addHandlers(handlers);