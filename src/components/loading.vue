<template>
  <div class="loading">
    <img src="../assets/loading.svg"
         alt="拼命加载中...">
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class LoadingCustom extends Vue {}
</script>
<style scoped>
.loading {
  text-align: center;
  padding: 30px;
}
</style>
