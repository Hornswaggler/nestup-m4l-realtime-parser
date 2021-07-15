const { state, commit, dispatch } = require('./store');
const maxApi = require('max-api');
const {handleNextTick, handleTempoChange} = require('./sequencer');
const store = require('./store');

const ONE_BEAT = 1;

const handleClock = tick => {
  if ([0, 1].includes(tick) && state.isRunning !== tick) return commit('setRunState', tick);
  if (!state.isRunning === 1) return;

  const elapsed = tick - state.lastTick;
  commit('elapsed', elapsed);

  handleNextTick();

  if (elapsed > ONE_BEAT) {
    const ppq = state.count;
    if (ppq !== state.ppq) {
      store.dispatch('changeTempo', ppq);
    }

    commit('ppq', ppq);
    commit('resetCount');
    commit('lastTick', tick);
  }
  commit('incCount');
};

module.exports = {
  handleClock
};
