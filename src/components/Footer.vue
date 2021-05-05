
<template>
  <div class="footer">
    <div>全栈修炼 ©2018 Created by BiaoChenXuYing</div>
    <div class="number">
      <a href="http://www.beian.miit.gov.cn" target="_blank"
        >粤ICP备18141506号</a
      >
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Footer",
});
</script>
<style scoped>
.footer {
  text-align: center;
  padding: 20px;
  font-weight: bold;
}
</style>

