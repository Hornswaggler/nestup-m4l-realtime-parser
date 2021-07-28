const { state, commit, dispatch } = require('./store');
const {sendMidi} = require('./maxInterface');

const NOTE_ON = [69, 64, 144];

const handleNextTick = () => {
  // if (state.currentSequence.nestupSequence.length > 0) {
    const sequenceStep = state.currentSequence.nestupSequence.filter(({ time }) => time === state.currentSequence.sequenceCount);
    if (sequenceStep.length > 0) {
      for (let i = 0; i < sequenceStep.length; i++) {
        const step = sequenceStep[i];
        if (step.on) {
          sendMidi(NOTE_ON);
        }
      }
    }
    if (state.currentSequence.sequenceCount > state.currentSequence.sequenceMax) {
      dispatch('playNextSequence');

    } else {
      commit('incSequenceCount');
    }
  // }
}

module.exports = {
  handleNextTick
};
