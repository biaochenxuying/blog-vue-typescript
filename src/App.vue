<template>
  <div id="app"
       class="container">
    <Nav v-if="isShowNav" />
    <div class=" layout">
      <router-view />
      <Slider v-if="isShowSlider"></Slider>
    </div>
    <ArrowUp></ArrowUp>
    <Footer v-show="isShowNav"></Footer>
  </div>
</template>
<script lang="ts">
import { Vue, Watch } from "vue-property-decorator";
import Component from "vue-class-component";
import { Route } from "vue-router";
import Nav from "@/components/nav.vue"; // @ is an alias to /src
import Slider from "@/components/slider.vue"; // @ is an alias to /src
import Footer from "@/components/footer.vue"; // @ is an alias to /src
import ArrowUp from "@/components/arrowUp.vue"; // @ is an alias to /src
import { isMobileOrPc } from "@/utils/utils";

// 移动端 rem 单位适配
if (isMobileOrPc()) {
  // width * 100 / 750 = width / 7.5
  // 1rem = 100px
  var width = window.screen.width;
  window.document.getElementsByTagName("html")[0].style.fontSize =
    width / 7.5 + "px";
}

@Component({
  components: {
    Nav,
    Slider,
    ArrowUp,
    Footer
  }
})
export default class App extends Vue {
  private isShowNav: boolean = false;
  private isShowSlider: boolean = false;
  mounted(): void {
    this.routeChange(this.$route, this.$route);
  }
  @Watch("$route")
  routeChange(val: Route, oldVal: Route): void {
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
  }
}
</script>

<style lang="less">
@import url("./less/index.less");
@import url("./less/mobile.less");
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
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
