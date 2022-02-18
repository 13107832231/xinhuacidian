<template>
  <button @click="handleClick">点击emit-click事件</button>
  <button @click="handleOpen">点击emit-open事件</button>
  <button @click="childEmit">父组件传参</button>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  export default defineComponent({
    emits: {
      click: null, //click事件没有检验
      open: (value) => {
        if (typeof value === 'string') {
          console.log(31231312)
          return true
        } else {
          return false
        }
      }
    },
    // emits: ['click', 'open', 'my-emit'],
    setup(props, { emit }) {
      const handleClick = () => {
        emit('click')
      }
      const handleOpen = function () {
        emit('open', '1')
      }
      const childEmit = () => {
        console.log(childEmit, 'childEmit')
        emit('my-emit', '我是子组件值')
      }
      return {
        handleClick,
        handleOpen,
        childEmit
      }
    },
    data() {
      return {}
    },
    methods: {}
  })
</script>
<style scoped></style>
