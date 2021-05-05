<template>
  <div class="container">
    <Nav v-if="isShowNav" />
    <div class="layout">
      <router-view />
      <CustomSlider v-if="isShowSlider"></CustomSlider>
    </div>
    <ArrowUp></ArrowUp>
    <!-- <Footer v-if="isShowNav"></Footer> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";
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
    Nav: defineAsyncComponent(() =>
      import('./components/Nav.vue')
    ),
    CustomSlider: defineAsyncComponent(() =>
      import('./components/CustomSlider.vue')
    ),
    Footer: defineAsyncComponent(() =>
      import('./components/Footer.vue')
    ),
    ArrowUp: defineAsyncComponent(() =>
      import('./components/Footer.vue')
    ),
  },
  data() {
    return {
      isShowNav: false,
      isShowSlider: false,
    };
  },
  watch: {
    $route: function (val: any, oldVal: any) {
      this.routeChange(val, oldVal);
      // const referrer: any = document.getElementById("referrer");
      // if (val.path === "/") {
      //   this.isShowNav = false;
      //   referrer.setAttribute("content", "always");
      // } else {
      //   this.isShowNav = true;
      //   referrer.setAttribute("content", "never");
      // }
      // if (
      //   val.path === "/articles" ||
      //   val.path === "/archive" ||
      //   val.path === "/project" ||
      //   val.path === "/timeline" ||
      //   val.path === "/message"
      // ) {
      //   this.isShowSlider = true;
      // } else {
      //   this.isShowSlider = false;
      // }
      // if (isMobileOrPc()) {
      //   this.isShowSlider = false;
      // }
    },
  },
  methods: {
    routeChange(val: any, oldVal: any): void {
      const referrer: any = document.getElementById("referrer");
      if (val.path === "/") {
        this.isShowNav = false;
        referrer.setAttribute("content", "always");
      } else {
        this.isShowNav = true;
        referrer.setAttribute("content", "never");
      }
      if (
        val.path === "/articles" ||
        val.path === "/archive" ||
        val.path === "/project" ||
        val.path === "/timeline" ||
        val.path === "/message"
      ) {
        this.isShowSlider = true;
      } else {
        this.isShowSlider = false;
      }
      if (isMobileOrPc()) {
        this.isShowSlider = false;
      }
    },
  },
  mounted(): void {
    this.routeChange(this.$route, this.$route);
  },
});
</script>

<style lang="less">
@import url("./less/monokai_sublime.less");
@import url("./less/index.less");
@import url("./less/mobile.less");
#app {
    font-family: Avenir,Helvetica,Arial,sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    color: #2c3e50;
    width: 1200px;
    margin: 0 auto;
    padding-top: 61px;
}
img {
  vertical-align: bottom;
}
</style>
