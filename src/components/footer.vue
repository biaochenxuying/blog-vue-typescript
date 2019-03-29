
<template>
  <div class="footer"> 全栈修炼 ©2018 Created by BiaoChenXuYing </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class Footer extends Vue {}
</script>
<style scoped>
.footer {
  text-align: center;
  padding: 20px;
  font-weight: bold;
}
</style>

