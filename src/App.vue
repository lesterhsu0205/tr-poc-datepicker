<template>
  <div id="app">
    Selected Date : {{ date }}
    <DatePicker v-model="date" />
  </div>
</template>

<script>
import DatePicker from './components/DatePicker'

export default {
  name: 'App',
  components: {
    DatePicker
  },
  data: function() {
    return {
      date: null
    }
  }
}
</script>
