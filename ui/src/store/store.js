import Vue from 'vue';
import Vuex from 'vuex';
import defaultPatterns from '../assets/patterns';

console.log(defaultPatterns);

Vue.use(Vuex);

// const MAX_LOG = 5000000;

// const {localStorage, location:{href}} = window;
// const {port} = new URL(href);

const extractParamsFromUrl = () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  console.log('Params:', params);
  return params;
};

const primitives = {
  loaded: false,
  pattern: '',
  port: '0',
  id: '0',
  log: ''
};

const localStorageExclude = ['log'];

const initialState = () => ({
  ...primitives,
  storedPatterns: Object.values(defaultPatterns).reduce((acc, pattern, id) => ({
    ...acc,
    [id]: {pattern}
  }), {}),
  ...extractParamsFromUrl(),
});

console.log('Initial State: ', initialState());

const persistStateToLocalStorage = ({id, key, payload}) => {
  // const urlSearchParams = new URLSearchParams(window.location.search);
  // const params = Object.fromEntries(urlSearchParams.entries());
  // const {id} = params;

  console.log(`Persisting ${key}: ${payload}, at ${id}`);

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
  loadStateFromLocalStorage({commit, state, dispatch}){
    dispatch('consoleOut', `Port is ${state.port}`);

    try{
      const persistedStore = JSON.parse(localStorage[state.id]);
      console.log('Persisted State: ', persistedStore);
      Object.keys(persistedStore).map(key => commit(key, persistedStore[key]));
    } catch(e) {
      //consume
    } 
  },
  clearLog({commit}){
    commit('log', '');
  },
  consoleOut({commit, state}, message = ''){
    // if((state.log.length + message.length) >= MAX_LOG) dispatch('clearLog');
    commit('log',`${new Date().toLocaleString()} - ${message}\n${state.log}`);
  },
  addPattern({commit, state, getters}, pattern){
    const patternCollection = getters.patternCollection;
    console.log(patternCollection);
    const nextId = patternCollection.length === 0 
      ? 0 
      : Math.max(...Object.keys(state.storedPatterns)
        .map(key => parseInt(key))) + 1;
        
    const storedPatterns = {...state.storedPatterns, [nextId]: {pattern}};
    commit('storedPatterns', storedPatterns);
    console.log('Persisting...', storedPatterns);
    persistStateToLocalStorage({id: state.id, key:'storedPatterns', payload: storedPatterns});
  },
  deletePattern({state, commit}, key){
    console.log('Deleteing pattern: ', key);
    const result = {...state.storedPatterns};
    delete result[key];
    commit('storedPatterns', result)
    persistStateToLocalStorage({id: state.id, key:'storedPatterns', payload: result})
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
      state.loaded && !localStorageExclude.includes(key) && persistStateToLocalStorage({id: state.id, key, payload}); 
      return state;
    }
  }), {}),
  storedPatterns(state, storedPatterns){
    console.log('Changine Patterns' , storedPatterns);
    state.storedPatterns = storedPatterns;

    // state.storedPatterns = {...state.storedPatterns, {[Math.max(...Object)]}};
  }
};

export default new Vuex.Store({
  state: initialState(),
  getters,
  actions,
  mutations 
});
