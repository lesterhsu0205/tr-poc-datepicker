<template>
  <div id="app">
    <DatePicker v-model="date" />
    {{ date }}
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
