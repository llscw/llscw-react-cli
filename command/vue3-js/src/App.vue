<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      你好呀！
    </a>
    <a href="https://vuejs.org/" target="_blank">
      世界4～$$_currentEnv_$$
    </a>
    <test />
  </div>
</template>

<script>
import test from './test.vue'
export default {
    components: {
        test
    },
    mounted() {
        console.log('$$_currentEnv_$$')
        const a = 234
        a = 23
    }
}
</script>

<style scoped>
</style>
