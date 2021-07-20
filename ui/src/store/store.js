import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

let loaded = false;

const initialState = () => ({
  pattern: '',
  port: 0,
  id: 0,
});

const {localStorage} = window;

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
  loadStateFromLocalStorage({commit}){
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const {id} = params;

    try{
      const persistedStore = JSON.parse(localStorage[id]);
      Object.keys(persistedStore).map(key => commit(key, persistedStore[key]));
    } catch(e) {
      //consume
    } 
    finally {
      loaded = true;
    }
  }
}

const mutations = {
  ...Object.keys(initialState()).filter((k) => k!='pattern').reduce((acc, key) => ({
    ...acc,
    [key]: (state, payload) => { 
      state[key] = payload; 
      loaded && persistStateToLocalStorage({key, payload}); 
      return state;
    }
  }), {}),
  pattern(state, newPattern){
    state.pattern = newPattern;
    loaded && persistStateToLocalStorage({key: 'pattern', payload: newPattern}); 
  }
};

export default new Vuex.Store({
  state: initialState(),
  actions,
  mutations 
});
