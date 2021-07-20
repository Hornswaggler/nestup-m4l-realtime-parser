<template>
  <v-app>
    <v-main>
      <Layout/>
    </v-main>
  </v-app>
</template>
<script>
import Layout from './components/Layout'

export default {
  name: 'App',
  components: {Layout},
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