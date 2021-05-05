<template>
  <img
    alt="Vue logo"
    src="../assets/logo.png"
  />
  <h1>{{ msg }}</h1>
  <!-- <button @click="inCrement"> count is: </button> -->
  <el-button
    icon="el-icon-success"
    type="primary"
    @click="inCrement"
  >count is: {{ count }}</el-button>
  <p>{{ count }}</p>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { key } from '../store'

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: {
      type: String,
      default: 'Hello Vue 3 + TypeScript + Vite'
    }
  },
  setup() {
    const store = useStore(key)

    const count = computed(() => store.state.count)

    return {
      count,
      inCrement: () => store.commit('increment')
    }
  }
})
</script>
