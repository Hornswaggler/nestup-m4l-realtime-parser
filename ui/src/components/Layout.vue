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
          @click="handleStorePattern"
        >Store =></v-btn>
      </v-col>

      <v-col cols="3" style="display:flex; flex-direction:column;padding-left:0;margin-left:0; ">
        <div>
          <v-list
            dense
            outlined
            style='height: 89vh;overflow:auto'
          >
            <v-list-item-group
              v-model="selectedPattern"
              color="primary"
            >
              <v-list-item
                v-for="(storedPattern) in patternCollection"
                :key="storedPattern.id"
                style="text-align:left;"
              >
                <v-list-item-content>
                  <v-list-item-title 
                    v-text="storedPattern.pattern"
                  ></v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-icon
                    color="yellow darken-3"
                    @click="event => {
                      event.stopPropagation();
                      handleDeletePattern({event, id: storedPattern.id})
                    }"
                  >
                    mdi-delete
                  </v-icon>
                </v-list-item-action>
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
            <p style='white-space: pre;font-size:10px;'>{{log}}</p>
          </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { RhythmParser, Nestup } from '@cutelab/nestup/dist/nestup.bundle';

export default {
  name: 'Layout',
  data: () => ({
    dial: 0,
    socket:{send: () => {}, onerror: () =>{}, onmessage: ()=>{}},
    editorPattern: '',
    selectedPattern: -1,
    messagequeue:[]
  }),
  computed:{
    ...mapState(['pattern', 'id', 'port', 'storedPatterns', 'newPatternStore', 'log', 'loaded']),
    ...mapGetters(['apiUrl']),
    patternCollection() {
      if(!this.storedPatterns) return;
      return Object.keys(this.storedPatterns).map(key => ({
      ...this.storedPatterns[key],
      id: key
    }))
    }
  },
  watch: {
    editorPattern(newPattern){
      const {$store:{commit}, tryPattern} = this;
      commit('pattern', newPattern); 

      this.consoleOut(JSON.stringify(this.loaded));
      if(this.loaded) tryPattern(newPattern);
    },
    selectedPattern(newPattern){
      console.log(JSON.stringify(this.storedPatterns));
      if(newPattern != null && this.patternCollection.length >= newPattern) {
        this.editorPattern = this.patternCollection[newPattern].pattern || '';
        // this.editorPattern = this.storedPatterns[newPattern].pattern;
      }
    }
  },
  methods: {
    ...mapActions(['consoleOut']),
    handleStorePattern(){
      console.log('Handling store pattern', this.editorPattern);
      this.$store.dispatch('addPattern', this.editorPattern);
      this.selectedPattern = this.patternCollection.length - 1;
    },
    handleDeletePattern({event, id}){
      console.log('Deleting at id:', id, event);
      this.$store.dispatch('deletePattern', id);
    },
    connect(){
      this.socket = new WebSocket(`ws://localhost:${this.port}/`);

      this.socket.onerror = e => {
        console.error(e);
      };

      this.socket.onopen = () => {
        this.$store.commit('loaded', true);
        this.sendPending();
      };

      this.socket.onmessage = ({data}) => {
        this.consoleOut(`Received: ${data}`);
      };
      
    },
    sendPending(){
      this.messagequeue.map(message =>{
        this.socket.send(JSON.stringify(message));
      });
      this.messagequeue = [];
    },
    send(data){
      const READY_STATE = {
        CONNECTED: 1
      };

      if(this.socket.readyState === READY_STATE.CONNECTED){
        this.sendPending();
        this.socket.send(JSON.stringify(data));
      } else {
        this.$store.commit('loaded', false);
        this.messagequeue.push(data);
        this.connect();
      }
    },
    tryPattern(newPattern){
      const {consoleOut} = this;

      try{
        new Nestup((new RhythmParser()).parse(newPattern));
      }catch{
        return;
      }      

      try{
        consoleOut(`Pattern Queued: ${newPattern}`);
        this.send({pattern: this.editorPattern});
      } catch(e) {
        //Consume
        console.error(e);
      }
    }
  },
  mounted() {
    // localStorage.clear();
    this.$store.dispatch('loadStateFromLocalStorage');
    this.editorPattern = this.pattern;
    console.log('Mounted', this.pattern, this.patternCollection.findIndex(({pattern}) => pattern === this.pattern));
    this.selectedPattern = this.patternCollection.findIndex(({pattern}) => pattern===this.pattern);
    this.connect();
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
  .v-list-item__action{
    margin: 0;
  }
}

</style>