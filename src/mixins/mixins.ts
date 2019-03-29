
// https://github.com/vuejs/vue-class-component#using-mixins
// mixin.js
import Vue from 'vue'
import Component from 'vue-class-component'

// You can declare a mixin as the same style as components.
@Component
export default class MyMixin extends Vue {
  mixinValue = 'Hello'
}