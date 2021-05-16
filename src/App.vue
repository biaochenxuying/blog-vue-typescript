<template>
  <div class="container">
    <Nav v-if="state.isShowNav" />
    <div class="layout">
      <router-view />
      <CustomSlider v-if="state.isShowSlider"></CustomSlider>
    </div>
    <ArrowUp></ArrowUp>
    <!-- <Footer v-if="isShowNav"></Footer> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, reactive, onMounted } from "vue";
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router';
import { isMobileOrPc } from "./utils/utils";

// 移动端 rem 单位适配
if (isMobileOrPc()) {
  // width * 100 / 750 = width / 7.5
  // 1rem = 100px
  var width = window.screen.width;
  window.document.getElementsByTagName("html")[0].style.fontSize =
    width / 7.5 + "px";
}

export default defineComponent({
  name: "App",
  components: {
    Nav: defineAsyncComponent(() => import("./components/Nav.vue")),
    CustomSlider: defineAsyncComponent(
      () => import("./components/CustomSlider.vue")
    ),
    Footer: defineAsyncComponent(() => import("./components/Footer.vue")),
    ArrowUp: defineAsyncComponent(() => import("./components/Footer.vue")),
  },
  watch: {
    $route: function (val: any, oldVal: any) {
      this.routeChange(val, oldVal);
    },
  },
  setup() {
    const state = reactive({
      isShowNav: false,
      isShowSlider: false,
    });

    // const router = useRouter();
    const route = useRoute();

    const routeChange = (val: any, oldVal: any): void => {
      const referrer: any = document.getElementById("referrer");
      if (val.path === "/") {
        state.isShowNav = false;
        referrer.setAttribute("content", "always");
      } else {
        state.isShowNav = true;
        referrer.setAttribute("content", "never");
      }
      const navs = [
        "/articles",
        "/archive",
        "/archive",
        "/project",
        "/timeline",
        "/message",
      ];
      if (navs.includes(val.path)) {
        state.isShowSlider = true;
      } else {
        state.isShowSlider = false;
      }
      if (isMobileOrPc()) {
        state.isShowSlider = false;
      }
    };

    onMounted(() => {
        routeChange(route, route);
    })

    // onBeforeRouteUpdate((to: any, from: any) => {
    //     console.log(to, "=====");
    //     console.log(from, "=====");
    //     routeChange(to, from);
    // });

    return {
      state,
      routeChange,
    };
  },
});
</script>

<style lang="less">
@import url("./less/monokai_sublime.less");
@import url("./less/index.less");
@import url("./less/mobile.less");
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  // width: 1200px;
  padding-top: 61px;
}
img {
  vertical-align: bottom;
}
</style>
