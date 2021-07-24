<template>
  <v-container fluid>
    <v-row class="text-center">

      <v-col cols="4" style='display:flex;justify-content:flex-start;flex-direction:column;'>
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
                v-for="(storedPattern) in patternCollection"
                :key="storedPattern.id"
              >
                <v-list-item-content>
                  <v-list-item-title 
                    v-text="storedPattern.pattern"
                  ></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </div>
      </v-col>

      <v-col cols="4">
          <v-card
            class="mx-auto"
            max-width="400"
            style="text-align:left;height:89vh;overflow:auto;color:grey"
          >
            <p style='white-space: pre;'>{{log}}</p>
          </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { RhythmParser, Nestup } from '@cutelab/nestup/dist/nestup.bundle';
// import axios from 'axios';

export default {
  name: 'Layout',
  data: () => ({
    socketLoaded:false,
    isLoaded: false,
    socket:{},
    editorPattern: '',
    selectedPattern: 0,
  }),
  computed:{
    ...mapState(['pattern', 'id', 'port', 'storedPatterns', 'newPatternStore', 'log', 'loaded']),
    ...mapGetters(['apiUrl', 'patternCollection']),
  },
  watch: {
    editorPattern(newPattern){
      const {$store:{commit}, tryPattern} = this;
      commit('pattern', newPattern); 

      if(this.loaded) tryPattern(newPattern);
    },
    selectedPattern(newPattern){
      if(newPattern != null) this.editorPattern = this.storedPatterns[newPattern].pattern; 
    }
  },
  methods: {
    ...mapActions(['consoleOut']),
    tryPattern(newPattern){
      const {consoleOut} = this;
      const vm = this;

      try{
        new Nestup((new RhythmParser()).parse(newPattern));
      }catch{
        return;
      }      

      try{
        consoleOut(`Pattern Queued: ${newPattern}`);
        
        if(!this.socketLoaded) {
          this.socket = new WebSocket(`ws://localhost:${this.port}/`);

          this.socket.onopen = () => this.socket.send(JSON.stringify({pattern: newPattern}));
          this.socket.onmessage = ({data}) => {
            console.log(data);
            if(data==='something')return;
            vm.selectedPattern = 
              vm.selectedPattern + 1 >= vm.patternCollection.length
                ? 0 
                : vm.selectedPattern + 1;

            consoleOut(data);
            this.socketLoaded = true;
            this.$nextTick(() => {
              this.socket.send(JSON.stringify({pattern: this.editorPattern}));
            });
          }
        }

        // axios.post(`${apiUrl}/pattern`, JSON.stringify({pattern: newPattern})); 
      } catch(e) {
        //Consume
      }
    }
  },
  mounted() {
    this.$store.dispatch('loadStateFromLocalStorage');
    this.editorPattern = this.pattern;
    this.$nextTick(() => {
      this.$store.dispatch('clearLog');
      this.$store.commit('loaded', true);
      this.consoleOut('Ready...');







    });
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