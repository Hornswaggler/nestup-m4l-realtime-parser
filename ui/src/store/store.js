import Vue from 'vue';
import Vuex from 'vuex';
import defaultPatterns from '../assets/patterns';

Vue.use(Vuex);

const MAX_LOG = 5000;

// const {localStorage, location:{href}} = window;
// const {port} = new URL(href);

const extractParamsFromUrl = () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  return params;
};

const primitives = {
  loaded: false,
  pattern: '',
  port: '0',
  id: '0',
  log: ''
};

const initialState = () => ({
  ...primitives,
  storedPatterns: Object.values(defaultPatterns).reduce((acc, pattern, id) => ({
    ...acc,
    [id]: {pattern}
  }), {}),
  ...extractParamsFromUrl(),
});


const persistStateToLocalStorage = ({key, payload}) => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  const {id} = params;

  let persistedStore = {};
  try{
     persistedStore = JSON.parse(localStorage[id]);
  }
  catch {
    //consume
  }
  const newStore = {...persistedStore, ...{[key]: payload}};
  localStorage[id] = JSON.stringify(newStore);
};

const actions = {
  loadStateFromLocalStorage({commit, state}){
    try{
      const persistedStore = JSON.parse(localStorage[state.id]);
      Object.keys(persistedStore).map(key => commit(key, persistedStore[key]));
    } catch(e) {
      //consume
    } 
  },
  clearLog({commit}){
    commit('log', '');
  },
  consoleOut({commit, state, dispatch}, message = ''){
    if((state.log.length + message.length) >= MAX_LOG) dispatch('clearLog');
    commit('log',`${message}\n${state.log}`);
  }
}

const getters = {
  apiUrl(state) {
    return `http://localhost:${state.port}`;  
  },
  patternCollection({storedPatterns}) {
    return Object.keys(storedPatterns).map(key => ({
      ...storedPatterns[key],
      id: key
    }))
  }
};

const mutations = {
  ...Object.keys(primitives).reduce((acc, key) => ({
  ...acc,
    [key]: (state, payload) => { 
      state[key] = payload; 
      state.loaded && persistStateToLocalStorage({key, payload}); 
      return state;
    }
  }), {})
};

export default new Vuex.Store({
  state: initialState(),
  getters,
  actions,
  mutations 
});
