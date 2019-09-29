import Vue from "vue";
import Vuex from "vuex";
// import * as types from "./types";
import user from "./modules/user";

Vue.use(Vuex);
const initPageState = () => {
  return {
    // user: {
    //   username: "",
    //   password: ""
    // }
  };
};
const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  modules: {
    user
  },
  state: initPageState(),
  mutations: {
    // [types.SET_USER](state, pageState = {}) {
    //   for (const prop in pageState) {
    //     state[prop] = pageState[prop];
    //   }
    // }
  },
  actions: {}
});

export default store;
