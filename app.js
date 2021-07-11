require('node-self')

const maxApi = require('max-api');
const { RhythmParser, Nestup, ParseError } = require('@cutelab/nestup/dist/nestup.bundle');
const {state, commit} = require('./store');

const pattern = `[5] {5
	2 {4}
	3 {3}
	4 {2}
	5 {1}
}
[5] {5
	2 {4}
	3 {3}
	4:2 {3}
}`;

const { MESSAGE_TYPES: _MESSAGE_TYPES } = maxApi;
const EVENT_CLOCK = 'EVENT_CLOCK';
const MIDI_EVENT = 'MIDI_EVENT';
const EVENT_PATTERN = 'EVENT_PATTERN';

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

const noteOn = [69, 64, 144];
// const noteOff = [69, 127, 128];

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
               maxApi.outlet(noteOn);
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
            const nestup = new Nestup((new RhythmParser()).parse(pattern));
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

const handlePatternChange = newPattern => {
   console.log(`got new pattern: `, newPattern);
};

const handleMidi = midiIn => {
   maxApi.outlet([midiIn]);
   midiBuffer.push(midiIn);
   if(midiBuffer.length === MIDI_BUFFER_MAX){
      lastMidiBuffer = [...midiBuffer];
      midiBuffer.splice(0,midiBuffer.length);
   }
   if (MIDI_MESSAGE_MAP[midiIn]) return MIDI_MESSAGE_MAP[midiIn]();
};

const handlers = {
   [MESSAGE_TYPES.MIDI_EVENT]: handleMidi,
   [MESSAGE_TYPES.EVENT_CLOCK]: handleClock,
   [MESSAGE_TYPES.EVENT_PATTERN]: handlePatternChange
};

maxApi.addHandlers(handlers);
