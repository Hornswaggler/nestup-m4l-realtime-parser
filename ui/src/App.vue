<template>
  <!-- <div id="app" style="height:100%;">
    <div class="container" style="display:flex;align-items:center;">
      <div style="flex:1; height:100%;">
        <textarea 
          v-model="pattern"
          @blur="this.handlePatternChanged"
          style="border: solid 1px;width:100%;height:100%;"></textarea>
      </div>
      <div style='flex:2;color:white;padding:10px;display:flex;align-items:flex-start;display:flex;height:100%;'>
        <span style="color:gold;margin:0 5px;">api port:</span>
        <input ref="fred"
          type="text"
          v-model="apiPort"
        />
        <span>{{id}}</span>
      </div>
    </div>
  </div> -->
  <v-app>
    <!-- <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar> -->

    <v-main>
      <HelloWorld/>
    </v-main>
  </v-app>
</template>

<script>
import { RhythmParser, Nestup } from '@cutelab/nestup/dist/nestup.bundle';
import axios from 'axios';
import HelloWorld from './components/HelloWorld'

export default {
  name: 'App',
  components: {HelloWorld},
  computed:{
    apiUrl(){
      return `http://localhost:${this.apiPort}`;
    }
  },
  data: () => ({
    apiPort:'3000',
    pattern:'',
    cheese: 0,
    template:{},
    id:0
  }),
  methods: {
    async handlePatternChanged(){
      try{
        new Nestup((new RhythmParser()).parse(this.pattern));
        await axios.post(`${this.apiUrl}/pattern`, JSON.stringify({pattern: this.pattern}));
      }catch(e){
        console.warn('Failed to parse pattern', this.pattern);
        return 'N/A'
      }    },
    handleApiChanged(){

    }
  },
  mounted(){
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const {id} = params;
    this.id = id;

  }
}
</script>
<style lang="scss">
html {
  overflow:hidden
}
</style>