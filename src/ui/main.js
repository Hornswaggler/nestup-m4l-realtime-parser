import Vue from 'vue'
import App from './App.vue'
import axios from 'axios';

axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.post['Content-Type'] ='application/json';

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
