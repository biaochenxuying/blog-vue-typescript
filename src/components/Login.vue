<template>
  <Dialog
    title="登录"
    width="60%"
    :visible="dialogVisible"
    @close="cancel"
  >
    <Form>
      <FormItem
        label="邮箱"
        placeholder="邮箱"
        :label-width="formLabelWidth"
      >
        <Input
          v-model="params.email"
          autocomplete="off"
        ></Input>
      </FormItem>
      <FormItem
        label="密码"
        :label-width="formLabelWidth"
      >
        <Input
          type="password"
          placeholder="密码"
          v-model="params.password"
          autocomplete="off"
        ></Input>
      </FormItem>
    </Form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <Button
        type="success"
        @click="handleOAuth"
      >github 授权登录</Button>
      <Button
        type="primary"
        @click="handleOk"
      >确 定</Button>
    </div>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import config from "../utils/config";
import { LoginParams, UserInfo } from "../types/index";

export default defineComponent({
  name: "Login",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      btnLoading: false,
      loading: false,
      formLabelWidth: "60px",
      params: {
        email: "",
        password: "",
      } as LoginParams,
    };
  },
  computed: {
    dialogVisible(): boolean {
      return this.visible;
    },
  },
  methods: {
    handleOAuth(): void {
      // 保存授权前的页面链接内容
      let preventHistory = {
        pathname: window.location.pathname,
        search: window.location.search,
      };
      window.sessionStorage.preventHistory = JSON.stringify(preventHistory);
      // window.location.href = 'https://github.com/login/oauth/authorize?client_id=6de90ab270aea2bdb01c&redirect_uri=http://biaochenxuying.cn/login'
      window.location.href = `${config.oauth_uri}?client_id=${config.client_id}&redirect_uri=${config.redirect_uri}`;
    },
    handleOk(): void {
      const reg = new RegExp(
        "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"
      );
      if (!this.params.email) {
        (this as any).$message({
          message: "邮箱不能为空！",
          type: "warning",
        });
        return;
      } else if (!reg.test(this.params.email)) {
        (this as any).$message({
          message: "请输入格式正确的邮箱！",
          type: "warning",
        });
        return;
      } else if (!this.params.password) {
        (this as any).$message({
          message: "密码不能为空",
          type: "warning",
        });
        return;
      }
      this.submit();
    },
    cancel(): boolean {
      this.$emit("cancel", false);
      return false;
    },
    async submit(): Promise<void> {
      const data: UserInfo = await (this as any).$https.post(
        (this as any).$urls.login,
        this.params
      );
      const userInfo: UserInfo = {
        _id: data._id,
        name: data.name,
        avatar: data.avatar,
      };
      window.sessionStorage.userInfo = JSON.stringify(userInfo);
      this.$emit("ok", false);
      (this as any).$message({
        message: "登录成功",
        type: "success",
      });
    },
  },
  setup() {},
});
</script>