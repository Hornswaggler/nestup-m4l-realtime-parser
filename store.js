const Vue = require('vue');
const Vuex = require('vuex');

Vue.use(Vuex);

const initialState = () => ({
  lastTick: 0
});

const state = initialState();

const getters = Object.keys(state).reduce((acc, key) => ({
  ...acc,
  [key]: state => state[key]
}), {});

const mutations = Object.keys(state).reduce((acc, key) => ({
  ...acc,
  [key]: (state, tick) => state[key] = tick
}), {});

const store = new Vuex.Store({
  state: initialState(),
  getters,
  mutations 
});

module.exports = store;
