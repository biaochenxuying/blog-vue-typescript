<template>
  <el-dialog
    title="登录"
    :width="isMobile ? '90%' : '50%'"
    v-model="state.dialogDodel"
    @close="cancel"
    :show-close="true"
  >
    <el-form>
      <el-formItem
        label="邮箱"
        :label-width="state.formLabelWidth"
      >
        <el-input
          v-model="state.params.email"
          placeholder="邮箱"
          autocomplete="off"
        >
        </el-input>
      </el-formItem>
      <el-formItem
        label="密码"
        :label-width="state.formLabelWidth"
      >
        <el-input
          type="password"
          placeholder="密码"
          v-model="state.params.password"
          autocomplete="off"
        ></el-input>
      </el-formItem>
      <el-formItem
        v-if="handleFlag === 'register'"
        label="昵称"
        :label-width="state.formLabelWidth"
      >
        <el-input
          v-model="state.params.name"
          placeholder="用户名或昵称"
          autocomplete="off"
        ></el-input>
      </el-formItem>
      <el-formItem
        v-if="handleFlag === 'register'"
        label="手机"
        :label-width="state.formLabelWidth"
      >
        <el-input
          v-model="state.params.phone"
          placeholder="手机号"
          autocomplete="off"
        ></el-input>
      </el-formItem>
      <el-formItem
        v-if="handleFlag === 'register'"
        label="简介"
        :label-width="state.formLabelWidth"
      >
        <el-input
          v-model="state.params.desc"
          placeholder="个人简介"
          autocomplete="off"
        ></el-input>
      </el-formItem>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="success"
        @click="handleOAuth"
      >github 授权登录</el-button>
      <el-button
        v-if="handleFlag === 'login'"
        :loading="state.btnLoading"
        type="primary"
        @click="handleOk"
      >登 录</el-button>
      <el-button
        v-if="handleFlag === 'register'"
        :loading="state.btnLoading"
        type="primary"
        @click="handleOk"
      >注 册</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { key } from '../store'
import config from "../utils/config";
import { RegAndLogParams, UserInfo } from "../types/index";
import service from "../utils/https";
import urls from "../utils/urls";

export default defineComponent({
  name: "RegisterAndLogin",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    handleFlag: {
      type: String,
      default: false,
    },
    isMobile: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["ok", "cancel"],
  setup(props, context) {
    const store = useStore(key);
    const state = reactive({
      dialogDodel: props.visible,
      btnLoading: false,
      loading: false,
      formLabelWidth: props.isMobile ? "40px" : "60px",
      params: {
        email: "",
        name: "",
        password: "",
        phone: "",
        desc: "",
      } as RegAndLogParams,
    });

    const route = useRoute();
    const handleOAuth = (): void => {
      // 保存授权前的页面链接内容
      let preventHistory: object = {
        name: route.name,
        query: route.query,
      };
      window.sessionStorage.preventHistory = JSON.stringify(preventHistory);
      // window.location.href = 'https://github.com/login/oauth/authorize?client_id=6de90ab270aea2bdb01c&redirect_uri=http://biaochenxuying.cn/login'
      window.location.href = `${config.oauth_uri}?client_id=${config.client_id}&redirect_uri=${config.redirect_uri}`;
    };

    const submit = async (): Promise<void> => {
      let data: any = "";
      state.btnLoading = true;
      if (props.handleFlag === "register") {
        data = await service.post(urls.register, state.params);
      } else {
        data = await service.post(urls.login, state.params);
      }
      state.btnLoading = false;

      const userInfo: UserInfo = {
        _id: data._id,
        name: data.name,
        avatar: data.avatar,
      };
      store.commit("SAVE_USER", {
        userInfo,
      });
      window.sessionStorage.userInfo = JSON.stringify(userInfo);
      context.emit("ok", false);
      ElMessage({
        message: "操作成功",
        type: "success",
      });
    };

    const handleOk = (): void => {
      const reg = new RegExp(
        "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"
      ); //正则表达式
      if (!state.params.email) {
        ElMessage({
          message: "邮箱不能为空！",
          type: "warning",
        });
        return;
      } else if (!reg.test(state.params.email)) {
        ElMessage({
          message: "请输入格式正确的邮箱！",
          type: "warning",
        });
        return;
      }
      if (props.handleFlag === "register") {
        if (!state.params.password) {
          ElMessage({
            message: "密码不能为空！",
            type: "warning",
          });
          return;
        } else if (!state.params.name) {
          ElMessage({
            message: "用户名不能为空！",
            type: "warning",
          });
          return;
        }
        const re = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if (state.params.phone && !re.test(state.params.phone)) {
          ElMessage({
            message: "请输入正确的手机号!",
            type: "warning",
          });
          return;
        }
      }
      submit();
    };

    const cancel = (): boolean => {
      context.emit("cancel", false);
      return false;
    };

    watch(props, (val, oldVal) => {
      state.dialogDodel = val.visible;
    });

    return {
      state,
      handleOAuth,
      handleOk,
      submit,
      cancel,
    };
  },
});
</script>
<style scoped>
.dialog-footer {
  text-align: right;
}
</style>