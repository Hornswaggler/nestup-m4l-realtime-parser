<template>
  <v-container>
    <v-row class="text-center">

    <v-col cols="4">
      <v-textarea
        background-color="black"
        color="orange"
        label="Pattern"
        outlined
        filled
        @keydown="handlePatternChanged"
        v-model="pattern"
      ></v-textarea>
    </v-col>

    <v-col cols="4">
      <v-textarea
        background-color="black"
        color="yellow"
        disabled
        outlined
      >/{{log}}</v-textarea>
    </v-col>

    <v-col cols="4">
        <v-card
          class="mx-auto"
          max-width="400"
          style="text-align:left;height:84vh"
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Api: {{apiUrl}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
    </v-col>


    </v-row>
  </v-container>
</template>

<script>
import { RhythmParser, Nestup } from '@cutelab/nestup/dist/nestup.bundle';
import axios from 'axios';

const DEFAULT_PATTERN = `[5] {2}
[3] {4}
[5] {2}
[3] {6
 1:2 {3}
 5:2 {1}
}`;

export default {
  name: 'Layout',
  data: () => ({
    log:'',
    pattern: DEFAULT_PATTERN
  }),
  computed:{
    apiUrl(){
      return `http://localhost:${this.port}`;
    }
  },
  methods: {
  async handlePatternChanged(){
    console.log('patternChanged');
    try{
      new Nestup((new RhythmParser()).parse(this.pattern));
      await axios.post(`${this.apiUrl}/pattern`, JSON.stringify({pattern: this.pattern}));
    }catch(e){
      console.warn('Failed to parse pattern', this.pattern);
      return 'N/A'
    }    
  },
},
  props:['port', 'id', 'apiPort']
}
</script>
<style lang="scss">
</style>