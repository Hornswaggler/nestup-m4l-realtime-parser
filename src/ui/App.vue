<template>
  <div id="app" style="height:100%;">
    <div class="container" style="display:flex;align-items:center;">
      <div style="flex:1; height:100%;">
        <textarea v-model="pattern" style="border: solid 1px;width:100%;height:100%;"></textarea>
      </div>
      <div  style='flex:2;color:white;padding:10px;display:flex; justify-content:center;align-items:center;'>
        <div>Valid! {{validPattern}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { RhythmParser, Nestup } from '@cutelab/nestup/dist/nestup.bundle';
import axios from 'axios';

export default {
  name: 'App',
  computed: {
     validPattern() {
      try{
        new Nestup((new RhythmParser()).parse(this.pattern));
        console.log('Valid');
        return this.pattern;
      }catch(e){
        console.warn('Failed to parse pattern', this.pattern);
        return 'N/A'
      }
    }
  },
  watch: {
    async validPattern(pattern) {
      console.log(pattern, {pattern});
      try{
        console.log('pattern:', typeof pattern);
        const result = await axios.post('http://localhost:3000/pattern', JSON.stringify({pattern}));
        console.log('Result: ', result);
      } catch(e) {
        console.error('Ugh', e);
      }
    }
  },
  data: () => ({
    apiUrl:'',
    pattern:'',
    lastValidPattern: {}
  }),
  async mounted(){
    const apiUrl = process.env.VUE_APP_API_URL;
    this.apiUrl = apiUrl;
  }
}
</script>
<style>
html, body, #app{
  height: 100%;
  overflow: hidden;
  background-color:black;
}

.container{
  height: 100%;
  width: 100%;
}
</style>