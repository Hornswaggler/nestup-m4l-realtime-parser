require('node-self')

const maxApi = require('max-api');
const { RhythmParser, Nestup, ParseError } = require('@cutelab/nestup/dist/nestup.bundle');
const {state, commit} = require('./store');

const PATTERN = `[5] {2}
[3] {4}
[5] {2}
[3] {6
 1:2 {3}
 5:2 {1}
}`;

const { MESSAGE_TYPES: _MESSAGE_TYPES } = maxApi;
const EVENT_CLOCK = 'EVENT_CLOCK';
const MIDI_EVENT = 'MIDI_EVENT';
const EVENT_PATTERN_PATH = 'EVENT_PATTERN_PATH';
const EVENT_PATTERN_CHAR = 'EVENT_PATTERN_CHAR';

const NOTE_ON = ['midi',69, 64, 144];

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
   MIDI_EVENT,
   EVENT_PATTERN_PATH,
   EVENT_PATTERN_CHAR
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


const handleRunStateChanged = (tick) => {
   if(state.isRunning !== tick){
      commit('changeRunState', tick);
      stop();
   }
};


const newSequence = ({nestupSequence, ppq}) => ({
   sequenceMax: nestupSequence.length > 0 
      ? nestupSequence[nestupSequence.length - 1].time
      : ppq,
   sequenceCount: 0,
   nestupSequence
});

const handleClock = tick => {
   if([0,1].includes(tick)) return handleRunStateChanged(tick);
   if(!state.isRunning === 1) return;

   const elapsed = tick - state.lastTick;
   commit('elapsed', elapsed);

   if(state.currentSequence.nestupSequence.length > 0){
      const sequenceStep = state.currentSequence.nestupSequence.filter(({time}) => time === state.currentSequence.sequenceCount);
      if(sequenceStep.length > 0 ){
         for(let i = 0; i < sequenceStep.length; i++){
            const step = sequenceStep[i];
            if(step.on === true){
               maxApi.outlet(NOTE_ON);
            }
         }
      }
      if(state.currentSequence.sequenceCount > state.currentSequence.sequenceMax){
         commit('setSequenceCount', 0);
      } else {
         commit('incSequenceCount');
      }
   }

   if(elapsed > 1) {
      const ppq = state.count;
      if(ppq !== state.ppq){
         try{
            const nestup = new Nestup((new RhythmParser()).parse(PATTERN));
            tickLength = nestup.beatLength * ppq;
            const nestupSequence = nestup.onOffEvents(tickLength);
            commit('currentSequence', newSequence({nestupSequence, ppq}))
         }catch (e) {
            console.error('Failed to parse nestup', e);
         }
      }

      commit('ppq', ppq);
      commit('resetCount');
      commit('lastTick',tick);
   }
   commit('incCount');
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
   // console.log('Handling Char input',String.fromCharCode(result[0]), char, result);
   buffer += result;
   maxApi.outlet(['text_char', buffer]);
   
};

const handleMidi = midiIn => {
   maxApi.outlet(['midi', midiIn]);
   if (MIDI_MESSAGE_MAP[midiIn]) return MIDI_MESSAGE_MAP[midiIn]();
};

const handlers = {
   [MESSAGE_TYPES.MIDI_EVENT]: handleMidi,
   [MESSAGE_TYPES.EVENT_CLOCK]: handleClock,
   [MESSAGE_TYPES.EVENT_PATTERN_PATH]: handlePatternPathChange,
   [MESSAGE_TYPES.EVENT_PATTERN_CHAR]: handleChar
};

maxApi.addHandlers(handlers);
