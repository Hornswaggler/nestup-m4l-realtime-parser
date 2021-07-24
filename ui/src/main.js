import Vue from 'vue';
import App from './App.vue';
// import axios from 'axios';
import vuetify from './plugins/vuetify';
import store from './store/store';

// axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
// axios.defaults.headers.post['Content-Type'] ='application/json';

Vue.config.productionTip = false

const app = {
  store,
  vuetify,
  render: h => h(App),
};

new Vue(app).$mount('#app');
