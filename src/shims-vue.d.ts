
// import Vue from "vue";
// import VueRouter, { Route } from "vue-router";

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  interface Vue {
    // $router: VueRouter; // 这表示this下有这个东西
    // $route: Route;
    $https: any;
    $urls: any;
    $Message: any;
    $Modal: any;
  }
  const component: DefineComponent<{}, {}, Vue, any>
  // const component: DefineComponent<{}, {}, any>
  export default component
}

