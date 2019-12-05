<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" /> -->
    <DatePicker></DatePicker>
  </div>
</template>

<script>
// import HelloWorld frosm './components/HelloWorld'
import DatePicker from './components/DatePicker'

export default {
  name: 'App',
  components: {
    // HelloWorld,
    DatePicker
  }
}
</script>

<style>
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
