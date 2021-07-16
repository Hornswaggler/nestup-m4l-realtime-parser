<template>
  <div id="app" style="height:100%;">
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
      </div>
    </div>
  </div>
</template>

<script>
import { RhythmParser, Nestup } from '@cutelab/nestup/dist/nestup.bundle';
import axios from 'axios';

export default {
  name: 'App',
  computed:{
    apiUrl(){
      return `http://localhost:${this.apiPort}`;
    }
  },
  data: () => ({
    apiPort:'3000',
    pattern:'',
    cheese: 0,
    template:{}
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
    this.$nextTick(() => {
      setInterval(() => { 
        console.log('fred', this.$refs);
        this.cheese += 1;
        this.template = this.$refs.fred.disabled;
        }, 1000)
    })

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