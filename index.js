require('node-self')

const maxApi = require('max-api');
const { RhythmParser, Nestup, ParseError } = require('@cutelab/nestup/dist/nestup.bundle');
const {state, commit} = require('./store');

const parser = new RhythmParser();
const result = parser.parse('[4] {6 3 {3} 4:3 {4}}');
const nextNestup = new Nestup(result);


const { MESSAGE_TYPES: _MESSAGE_TYPES } = maxApi;
const EVENT_CLOCK = 'EVENT_CLOCK';
const MIDI_EVENT = 'MIDI_EVENT';

const MIDI_BUFFER_MAX = 3;
const midiBuffer = [];
let lastMidiBuffer;




/**
 * EVENT_ALL:'all'
 * EVENT_BANG:'bang'
 * EVENT_CLOCK:'EVENT_CLOCK'
 * EVENT_DICT:'dict'
 * EVENT_LIST:'list'
 * EVENT_NUMBER:'number'
 */
const MESSAGE_TYPES = {
   ...(Object.keys(_MESSAGE_TYPES).reduce((acc, k) => {
      acc[`EVENT_${k}`] = _MESSAGE_TYPES[k];
      return acc;
   }, {})),
   EVENT_CLOCK,
   MIDI_EVENT
};

const stop = () => {};

const noteEnd = () => {};

const MIDI_MESSAGE_MAP = {
   128: noteEnd,
   0: stop
};

//TODO: Parse nestup to this format...
const _clockHandlers = {
   .15: () => {

   },
   .75: () => {

   }
};

const makeClockHandlers = () =>({..._clockHandlers});




let count = 0;
let events = [];
const handleClock = tick => {
   if([0,1].includes(tick)) return;
   const elapsed = tick - state.lastTick
   count += 1;

   if(events.length && events[0].time === count){
      maxApi.outlet([lastMidiBuffer]);
      events.shift();
   }

   if(elapsed > 1) { 
      events = nextNestup.onOffEvents(count);
      console.log(lastMidiBuffer);
      start = new Date();
      count = 0;
      commit('lastTick',Math.floor(tick))
      clockHandlers = makeClockHandlers();
      ;
   }

};


const handleMidi = midiIn => {
   console.log(midiIn);
   maxApi.outlet([midiIn]);
   midiBuffer.push(midiIn);
   if(midiBuffer.length === MIDI_BUFFER_MAX){
      console.log(midiBuffer);
      lastMidiBuffer = [...midiBuffer];
      midiBuffer.splice(0,midiBuffer.length);

   }
   if (MIDI_MESSAGE_MAP[midiIn]) return MIDI_MESSAGE_MAP[midiIn]();
};

const handlers = {
   [MESSAGE_TYPES.MIDI_EVENT]: handleMidi,
   [MESSAGE_TYPES.EVENT_CLOCK]: handleClock
};

maxApi.addHandlers(handlers);
