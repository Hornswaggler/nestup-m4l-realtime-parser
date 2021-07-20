import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: '#C76CD8',
        accent: '#1E0F14',
        secondary: '#FFBA00',
        success: '#534433',
        info: '#696969',
        warning: '#F8FF31',
        error: '#6C0202'
      },
      light: {
        primary: '#1976D2',
        accent: '#e91e63',
        secondary: '#30B1DC',
        success: '#4CAF50',
        info: '#2196F3',
        warning: '#FB8C00',
        error: '#FF5252'
      }
    }
  }
});