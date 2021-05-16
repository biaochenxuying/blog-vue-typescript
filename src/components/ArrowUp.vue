
<template>
  <div>
    <i
      v-show="isShowBtn"
      @click="topFunction"
      class="el-icon-arrow-up"
    ></i>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, onMounted } from "vue";

export default defineComponent({
  name: "ArrowUp",
  setup() {
    const state = reactive({
      isShowBtn: false,
    });

    onMounted(() => {
      // 当网页向下滑动 20px 出现"返回顶部" 按钮
      window.onscroll = (): void => {
        if (
          window.document.body.scrollTop > 100 ||
          window.document.documentElement.scrollTop > 100
        ) {
          state.isShowBtn = true;
        } else {
          state.isShowBtn = false;
        }
      };
    });

    const topFunction = (): void => {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }

    return {
      state,
      topFunction
    };
  },
});
</script>
<style scoped>
.el-icon-arrow-up {
  position: fixed;
  bottom: 50px;
  right: 40px;
  z-index: 99;
  border: none;
  outline: none;
  background-color: rgb(119, 118, 118);
  cursor: pointer;
  padding: 15px;
  color: white;
  border-radius: 50%;
}

.el-icon-arrow-up:hover {
  background-color: #555;
}
</style>

