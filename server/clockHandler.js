const { state, commit, dispatch } = require('./store');
const {handleNextTick} = require('./sequencer');

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
      dispatch('changeTempo', ppq);
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
