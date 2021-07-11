const Vue = require('vue');
const Vuex = require('vuex');

Vue.use(Vuex);

const DEFAULT_COUNT = 0;

const initialState = () => ({
  ppq: 0,
  lastTick: 0,
  count: DEFAULT_COUNT,
  totalCount: DEFAULT_COUNT,
  elapsed: 0,
  isRunning: 0,
  currentSequence: {nestupSequence: [], sequenceCount:0, sequenceMax: 0}
});

const state = initialState();

const getters = Object.keys(state).reduce((acc, key) => ({
  ...acc,
  [key]: state => state[key]
}), {});

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
  changeRunState: (state, isRunning) => {
    state.isRunning = isRunning;
    if(isRunning === 1)
     state.lastTick = 0;
  }
});

const store = new Vuex.Store({
  state: initialState(),
  getters,
  mutations 
});

module.exports = store;
