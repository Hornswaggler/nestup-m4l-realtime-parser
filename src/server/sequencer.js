const { state, commit } = require('./store');
const maxApi = require('max-api');

// TODO: Refactor and add command prefix automatically
const NOTE_ON = ['midi', 69, 64, 144];

const handleNextTick = () => {
  if (state.currentSequence.nestupSequence.length > 0) {
    const sequenceStep = state.currentSequence.nestupSequence.filter(({ time }) => time === state.currentSequence.sequenceCount);
    if (sequenceStep.length > 0) {
      for (let i = 0; i < sequenceStep.length; i++) {
        const step = sequenceStep[i];
        if (step.on) {
          maxApi.outlet(NOTE_ON);
        }
      }
    }
    if (state.currentSequence.sequenceCount > state.currentSequence.sequenceMax) {
      commit('setSequenceCount', 0);
    } else {
      commit('incSequenceCount');
    }
  }
}

module.exports = {
  handleNextTick
};
