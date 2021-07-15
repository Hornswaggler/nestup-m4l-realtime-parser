const Vue = require('vue');
const Vuex = require('vuex');
const { RhythmParser, Nestup } = require('@cutelab/nestup/dist/nestup.bundle');


Vue.use(Vuex);

const DEFAULT_COUNT = 0;
const PATTERN = `[5] {2}
[3] {4}
[5] {2}
[3] {6
 1:2 {3}
 5:2 {1}
}`;

const initialState = () => ({
  ppq: 0,
  lastTick: 0,
  count: DEFAULT_COUNT,
  totalCount: DEFAULT_COUNT,
  elapsed: 0,
  isRunning: 0,
  currentSequence: {nestupSequence: [], sequenceCount:0, sequenceMax: 0},
  pattern: PATTERN
});

const state = initialState();

const getters = Object.keys(state).reduce((acc, key) => ({
  ...acc,
  [key]: state => state[key]
}), {});

const newSequence = ({ nestupSequence, ppq }) => ({
  sequenceMax: nestupSequence.length > 0
    ? nestupSequence[nestupSequence.length - 1].time
    : ppq,
  sequenceCount: 0,
  nestupSequence
});

const tryParsePattern = ({pattern, ppq}) => {
  const nestup = new Nestup((new RhythmParser()).parse(pattern));
  tickLength = nestup.beatLength * ppq;
  return newSequence({nestupSequence: nestup.onOffEvents(tickLength), ppq});
}

const actions = {
  changePattern: ({commit, state}, pattern) => {
    try{
      const newSequence = tryParsePattern({pattern, ppq: state.ppq});
      commit('currentSequence', newSequence);
    }catch {
      console.error('Failed to change pattern', e);
    }
  },
  changeTempo: ({commit, state}, ppq) => {
    try{
      const newSequence = tryParsePattern({pattern: state.pattern, ppq});
      commit('currentSequence', newSequence);
    } catch (e) {
      console.error('Failed to parse pattern for tempo change', e);
    }
  }
};

const stopSequencer = state => {
  state.lastTick = 0;
  state.count = 0;
  state.totalCount = 0;
  state.elapsed = 0;
};

const startSequencer = state => {
  state.lastTick = 0;
};


const mutations = Object.keys(state).reduce((acc, key) => ({
  ...acc,
  [key]: (state, tick) => state[key] = tick
}), {
  resetCount: state => { 
    state.count = DEFAULT_COUNT;
  },
  incCount: state => {
    state.count += 1;
    state.totalCount += 1;
  },
  incSequenceCount: state => {
    state.currentSequence.sequenceCount += 1;
  },
  setSequenceCount: (state, sequenceCount) => {
    state.currentSequence.sequenceCount = sequenceCount;
  },
  setCurrentSequence: (state, newSequence) => {
    state.currentSequence.nestupSequence = newSequence.nestupSequence;
    state.currentSequence.sequenceCount = newSequence.sequenceCount;
    state.currentSequence.sequenceMax = newSequence.sequenceMax;
  },
  setRunState: (state, isRunning) => {
    state.isRunning = isRunning;
    if(isRunning === 1)
      startSequencer(state);
    else
      stopSequencer(state);
  },
});

const store = new Vuex.Store({
  state: initialState(),
  actions,
  getters,
  mutations 
});

module.exports = store;
