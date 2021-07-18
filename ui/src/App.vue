<template>
  <v-app>
    <v-main>
      <Layout :port="port" :id="id" :apiPort="apiPort"/>
    </v-main>
  </v-app>
</template>

<script>
import { RhythmParser, Nestup } from '@cutelab/nestup/dist/nestup.bundle';
import axios from 'axios';
import Layout from './components/Layout'

export default {
  name: 'App',
  components: {Layout},
  computed:{
    apiUrl(){
      return `http://localhost:${this.apiPort}`;
    }
  },
  data: () => ({
    apiPort:'8080',
    pattern:'',
    id:0,
    port:0
  }),
  methods: {
    async handlePatternChanged(){
      try{
        new Nestup((new RhythmParser()).parse(this.pattern));
        await axios.post(`${this.apiUrl}/pattern`, JSON.stringify({pattern: this.pattern}));
      }catch(e){
        console.warn('Failed to parse pattern', this.pattern);
        return 'N/A'
      }    
    }
  },
  mounted(){
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const {id, port} = params;
    this.id = id;
    this.port = port;
    console.log(this.id, this.port, this.apiPort);
  }
}
</script>
<style lang="scss">
html, body {
  overflow:hidden;
  padding:0;
}
body{
  margin-top:0px;
}

.v-textarea textarea {
  line-height: 0.75rem;
  font-size: 0.75rem;
  height:80vh;
  width: 100%;
}

@media (min-width: 1264px){
  .container {
      max-width: initial;
      padding: 0;
  }
}
</style>