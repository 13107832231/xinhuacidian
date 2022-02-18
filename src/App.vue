<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
  <!-- <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />
  <div :class="classes.red">测试样式</div> -->

  <router-view></router-view>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  import HelloWorld from './components/HelloWorld.vue'

  export default defineComponent({
    name: 'App',
    data() {
      return {}
    },
    components: {
      HelloWorld
    }
  })
</script>

<style>
  #app {
    /* text-align: center; */
    color: #333;
  }
</style>
<style lang="less" scoped></style>
