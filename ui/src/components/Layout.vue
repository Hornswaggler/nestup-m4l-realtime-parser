<template>
  <v-container fluid>
    <v-row class="text-center">

    <v-col cols="8" style='display:flex;justify-content:flex-start;flex-direction:column;'>
      <div>
      <v-textarea
        background-color="black"
        color="orange"
        label="Pattern"
        outlined
        filled
        v-model="editorPattern"
        clearable
      ></v-textarea>
      </div>
    </v-col>

    <v-col cols="1" style='display:flex;align-items:flex-start;flex-direction:column; padding-left:0;margin-left:0;'>
      <v-btn
        color="secondary"
        x-small
        style='color:black;margin-top:12px'
      >Store =></v-btn>
    </v-col>

    <v-col cols="3" style="display:flex; flex-direction:column;padding-left:0;margin-left:0; ">
      <div>
        <v-list
          dense
          outlined
          style='height: 89vh'
        >
          <v-list-item-group
            v-model="selectedPattern"
            color="primary"
          >
            <v-list-item
              v-for="(storedPattern, i) in patternStore"
              :key="i"
            >
              <v-list-item-content>
                <v-list-item-title 
                  v-text="storedPattern"
                ></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
    </v-col>

    <!-- <v-col cols="4">
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
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title style="white-space: pre-line;">Id: {{id}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title style="white-space: pre-line;">Pattern: {{pattern}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
    </v-col> -->


    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import { RhythmParser, Nestup } from '@cutelab/nestup/dist/nestup.bundle';
import axios from 'axios';

import defaultPatterns from '../assets/patterns';

export default {
  name: 'Layout',
  data: () => ({
    isLoaded: false,
    log:'',
    editorPattern: '',
    patternStore:[...Object.values(defaultPatterns)],
    selectedPattern: 0
  }),
  computed:{
    ...mapState(['pattern', 'id', 'port']),
    apiUrl(){
      return `http://localhost:${this.port}`;
    }
  },
  watch: {
    editorPattern(newPattern){
      if(!this.isLoaded) return;
      const {editorPattern: pattern, apiUrl, $store:{commit}} = this;
      commit('pattern', pattern); 
      try{
        new Nestup((new RhythmParser()).parse(newPattern));
      }catch{
        return;
      }      

      try{
        axios.post(`${apiUrl}/pattern`, JSON.stringify({pattern})); 
      } catch(e) {
        //Consume
      }
    },
    selectedPattern(newPattern){
      if(newPattern != null) this.editorPattern = this.patternStore[newPattern]; 
    }
  },
  mounted() {
    this.$store.dispatch('loadStateFromLocalStorage', '45');
    this.editorPattern = this.pattern;
    this.isLoaded = true;
  }
}
</script>
<style lang="scss">
.v-application{
  .v-list-item--dense .v-list-item__content, .v-list--dense .v-list-item .v-list-item__content {
    padding:4px;
  }

 .v-list-item--dense, .v-list--dense .v-list-item {
        min-height: 25px;
  }
}
</style>