const { state, commit } = require('./store');
const maxApi = require('max-api');
const { RhythmParser, Nestup } = require('@cutelab/nestup/dist/nestup.bundle');

// TODO: Refactor and add command prefix automatically
const NOTE_ON = ['midi', 69, 64, 144];

const PATTERN = `[5] {2}
[3] {4}
[5] {2}
[3] {6
 1:2 {3}
 5:2 {1}
}`;

const newSequence = ({ nestupSequence, ppq }) => ({
  sequenceMax: nestupSequence.length > 0
    ? nestupSequence[nestupSequence.length - 1].time
    : ppq,
  sequenceCount: 0,
  nestupSequence
});

const handleTempoChange = ppq => {
  try {
    const nestup = new Nestup((new RhythmParser()).parse(PATTERN));
    tickLength = nestup.beatLength * ppq;
    const nestupSequence = nestup.onOffEvents(tickLength);
    commit('currentSequence', newSequence({ nestupSequence, ppq }))
  } catch (e) {
    console.error('Failed to parse nestup', e);
  }
};

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
  handleNextTick,
  handleTempoChange
};
