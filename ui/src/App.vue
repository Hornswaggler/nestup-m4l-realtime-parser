<template>
  <v-app class="jed">
    <v-main>
      <Layout :port="port" :id="id" :apiPort="apiPort"/>
    </v-main>
  </v-app>
</template>

<script>
import Layout from './components/Layout'

export default {
  name: 'App',
  components: {Layout},
  data: () => ({
    apiPort:'8080',
    pattern:'',
    id:0,
    port:0
  }),

  mounted(){
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const {id, port} = params;

    this.id = id;
    this.port = port;
    this.$store.commit('id', id);
    this.$store.commit('port', port);
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

</style>