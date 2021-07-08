const maxApi = require('max-api');
const { RhythmParser } = require('@cutelab/nestup');

const parser = new RhythmParser();
const result = parser.parse('[4] {3}');

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

const stop = () => {
   console.log('STOP INVOKED: 0');
};

const noteEnd = () => {
   // console.log('NOTE END INVOKED: 128');
};

const MIDI_MESSAGE_MAP = {
   128: noteEnd,
   0: stop
};

const state = {
   isRunning: false
};

//TODO: Parse nestup to this format...
const _clockHandlers = {
   .15: () => {

   },
   .75: () => {

   }
};

const makeClockHandlers = () =>({..._clockHandlers});

const clockMeta = Object.keys(makeClockHandlers()).reduce((acc, key) => ({
   ...acc,
   max: key > acc.max ? key : acc.max
}),{max: 0});

const handleClockEvents = ({clockHandlers, elapsed}) => {
   Object.keys(clockHandlers).map(key => {
      if(elapsed > key){
         console.log('Fire',lastMidiBuffer);
         if(lastMidiBuffer) lastMidiBuffer.map(value => {
            maxApi.outlet([value]);
         })
         delete clockHandlers[key];
      }
   });
   if(elapsed > clockMeta.max){
      return true;
   }
   return false;
   // clockMeta
   // clockHandler
};

let lastClock = new Date();
let beginClock;
let lastTimeElapsed = 0;
const inc = 10;
let next = inc;
let lastTick = 0;
let clockHandlers = makeClockHandlers();
const handleClock = (tick) => {
   if (!beginClock) beginClock = new Date();
   let currentClock = new Date();
   const timeElapsed = currentClock - beginClock;
   if (tick > next) {
      // console.log(`BPM: ${timeElapsed/1000}, Last: ${(timeElapsed - lastTimeElapsed)/1000}`);
      lastTimeElapsed = timeElapsed;
      next += inc;
   }

   const elapsed = tick - lastTick;

   if(handleClockEvents({clockHandlers, elapsed}));

   if(elapsed > 1) {
      lastTick = tick;
      clockHandlers = makeClockHandlers();
   }

   // Object.keys(subdivisions).reduce((acc, subdivision) => {

   // });

   // if()

   // if()

   if(elapsed > 1){
      // console.log(tick);
      // console.log(subdivisionMeta);
      // lastTick = tick;
   }

   if(tick%10 === 0) console.log(tick);

   if(tick > 60){
      // console.log(`tick: ${tick}, `);
   }

   lastClock = currentClock;
};


const handleMidi = midiIn => {
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
