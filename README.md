# tr-poc-datepicker

## Project setup

```bash
yarn install
```

### Compiles and hot-reloads for development

```bash
yarn serve
```

* <http://localhost:9000>

### Compiles and minifies for production

```bash
yarn build
```

* ${root}/dist/

### Lints and fixes files

```bash
yarn lint
```

## Usage

* Import component in script tag.

```xml
<script>
```

```javascript
  import DatePicker from './components/DatePicker'

  export default {
    components: {
      DatePicker
    },
    data: function() {
      return {
        date: null
      }
    }
  }
```

```xml
</script>
```

* In template tag.

```xml
<template>

  <DatePicker v-model="date" />

</template>
```

### Properties

Name          | Type  | Default | Description|
--------------|:-----:|--------:| ----------:|
v-model       | string|  null   | Two-way binding for dayte in component.|

