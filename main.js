require('node-self');

const maxApi = require('max-api');
const {commit} = require('./server/store');
const {handleClock} = require('./server/clockHandler');

const { MESSAGE_TYPES: _MESSAGE_TYPES } = maxApi;
const EVENT_CLOCK = 'EVENT_CLOCK';
const MIDI_EVENT = 'MIDI_EVENT';
const EVENT_PORT_CHANGE = 'EVENT_PORT_CHANGE';
const EVENT_PATTERN_PATH = 'EVENT_PATTERN_PATH';
const EVENT_PATTERN_CHAR = 'EVENT_PATTERN_CHAR';

/**
 * <pre>
 * EVENT_ALL:'all'
 * EVENT_BANG:'bang'
 * EVENT_CLOCK:'EVENT_CLOCK'
 * EVENT_DICT:'dict'
 * EVENT_LIST:'list'
 * EVENT_NUMBER:'number'
 * </pre>
 */
const MESSAGE_TYPES = {
   ...(Object.keys(_MESSAGE_TYPES).reduce((acc, k) => {
      acc[`EVENT_${k}`] = _MESSAGE_TYPES[k];
      return acc;
   }, {})),
   EVENT_CLOCK,
   MIDI_EVENT,
   EVENT_PATTERN_PATH,
   EVENT_PATTERN_CHAR,
   EVENT_PORT_CHANGE
};

const stop = () => {
   console.log('STOPPING');
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

const handlePatternPathChange = (...params) => {
   console.log(`got new pattern: `, [...params].filter(p => p !== 'text') );
};

const TAB = 9;
const SPACE = 69;

const parseResult = char => {
   switch(char){
      case TAB:
         return `  `;
      default:
         return `${String.fromCharCode(char)}`;
   }
};

let buffer = '';
const handleChar = char => {
   const result = parseResult(char) || false;
   buffer += result;
   maxApi.outlet(['text_char', buffer]);
};

const handleMidi = midiIn => {
   maxApi.outlet(['midi', midiIn]);
   if (MIDI_MESSAGE_MAP[midiIn]) return MIDI_MESSAGE_MAP[midiIn]();
};

const handlePortChange = newPort => {
   const {server} = require('./src/server/server');

   console.log('received port change request', newPort);
   server(newPort);
};

const handlers = {
   [MESSAGE_TYPES.MIDI_EVENT]: handleMidi,
   [MESSAGE_TYPES.EVENT_CLOCK]: handleClock,
   [MESSAGE_TYPES.EVENT_PATTERN_PATH]: handlePatternPathChange,
   [MESSAGE_TYPES.EVENT_PATTERN_CHAR]: handleChar,
   [MESSAGE_TYPES.EVENT_PORT_CHANGE]: handlePortChange
};

maxApi.addHandlers(handlers);