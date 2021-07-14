<template>
  <div id="app">
    Here we go..... apiUrl:{{apiUrl}} {{number}}
  </div>
</template>

<script>

export default {
  name: 'App',
  data: () => ({
    apiUrl:'',
    number:2
  }),
  mounted(){
    const apiUrl = process.env.VUE_APP_API_URL;
  this.apiUrl = apiUrl;
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
