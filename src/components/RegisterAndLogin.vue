<template>
  <el-dialog
    title="登录"
    :width="isMobile ? '90%' : '50%'"
    v-model="dialogDodel"
    @close="cancel"
    :show-close="true"
  >
    <el-form>
      <el-formItem
        label="邮箱"
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="params.email"
          placeholder="邮箱"
          autocomplete="off"
        >
        </el-input>
      </el-formItem>
      <el-formItem
        label="密码"
        :label-width="formLabelWidth"
      >
        <el-input
          type="password"
          placeholder="密码"
          v-model="params.password"
          autocomplete="off"
        ></el-input>
      </el-formItem>
      <el-formItem
        v-if="handleFlag === 'register'"
        label="昵称"
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="params.name"
          placeholder="用户名或昵称"
          autocomplete="off"
        ></el-input>
      </el-formItem>
      <el-formItem
        v-if="handleFlag === 'register'"
        label="手机"
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="params.phone"
          placeholder="手机号"
          autocomplete="off"
        ></el-input>
      </el-formItem>
      <el-formItem
        v-if="handleFlag === 'register'"
        label="简介"
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="params.desc"
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
        :loading="btnLoading"
        type="primary"
        @click="handleOk"
      >登 录</el-button>
      <el-button
        v-if="handleFlag === 'register'"
        :loading="btnLoading"
        type="primary"
        @click="handleOk"
      >注 册</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import config from "../utils/config";
import { RegAndLogParams, UserInfo } from "../types/index";

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
  data() {
    return {
      dialogDodel: this.visible,
      btnLoading: false,
      loading: false,
      formLabelWidth: this.isMobile ? "40px" : "60px",
      params: {
        email: "",
        name: "",
        password: "",
        phone: "",
        desc: "",
      } as RegAndLogParams,
    };
  },
  watch: {
    dialogDodel: {
      handler(val: any, oldVal: any) {
        this.$emit("cancel", val);
      },
      immediate: true,
    },
    visible: {
      handler(val: any, oldVal: any) {
        this.dialogDodel = val;
      },
      immediate: true,
    },
  },
  // computed: {
  //   dialogVisible(): boolean {
  //     return this.visible;
  //   },
  // },
  methods: {
    handleOAuth(): void {
      // 保存授权前的页面链接内容
      let preventHistory: object = {
        name: this.$route.name,
        query: this.$route.query,
      };
      window.sessionStorage.preventHistory = JSON.stringify(preventHistory);
      // window.location.href = 'https://github.com/login/oauth/authorize?client_id=6de90ab270aea2bdb01c&redirect_uri=http://biaochenxuying.cn/login'
      window.location.href = `${config.oauth_uri}?client_id=${config.client_id}&redirect_uri=${config.redirect_uri}`;
    },
    handleOk(): void {
      const reg = new RegExp(
        "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"
      ); //正则表达式
      if (!this.params.email) {
        // Message.warning("邮箱不能为空！");
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
      }
      if (this.handleFlag === "register") {
        if (!this.params.password) {
          (this as any).$message({
            message: "密码不能为空！",
            type: "warning",
          });
          return;
        } else if (!this.params.name) {
          (this as any).$message({
            message: "用户名不能为空！",
            type: "warning",
          });
          return;
        }
        const re = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if (this.params.phone && !re.test(this.params.phone)) {
          (this as any).$message({
            message: "请输入正确的手机号!",
            type: "warning",
          });
          return;
        }
      }
      this.submit();
    },
    cancel(): boolean {
      this.$emit("cancel", false);
      return false;
    },
    async submit(): Promise<void> {
      let data: any = "";
      this.btnLoading = true;
      if (this.handleFlag === "register") {
        data = await (this as any).$https.post(
          (this as any).$urls.register,
          this.params
        );
      } else {
        data = await (this as any).$https.post(
          (this as any).$urls.login,
          this.params
        );
      }
      this.btnLoading = false;

      const userInfo: UserInfo = {
        _id: data._id,
        name: data.name,
        avatar: data.avatar,
      };
      (this as any).$store.commit("SAVE_USER", {
        userInfo,
      });
      window.sessionStorage.userInfo = JSON.stringify(userInfo);
      this.$emit("ok", false);
      (this as any).$message({
        message: "操作成功",
        type: "success",
      });
    },
  },
  setup() {},
});
</script>
<style scoped>
.dialog-footer {
  text-align: right;
}
</style>