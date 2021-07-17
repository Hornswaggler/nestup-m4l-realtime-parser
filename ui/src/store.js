import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);



const getStateFromLocalStorage = () => {
  const {localStorage} = window;

};

const initialState = () => ({

});

const state = initialState();

const store = new Vuex.Store({
  state: initialState(),
  actions,
  getters,
  mutations 
});

module.exports = {store};
