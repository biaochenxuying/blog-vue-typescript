<template>
  <Dialog title="登录"
          width="60%"
          :visible="dialogVisible"
          @close="cancel">
    <Form>
      <FormItem label="邮箱"
                placeholder="邮箱"
                :label-width="formLabelWidth">
        <Input v-model="params.email"
               autocomplete="off"></Input>
      </FormItem>
      <FormItem label="密码"
                :label-width="formLabelWidth">
        <Input type="password"
               placeholder="密码"
               v-model="params.password"
               autocomplete="off"></Input>
      </FormItem>
    </Form>
    <div slot="footer"
         class="dialog-footer">
      <Button type="success"
              @click="handleOAuth">github 授权登录</Button>
      <Button type="primary"
              @click="handleOk">确 定</Button>
    </div>
  </Dialog>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import { Dialog, Form, FormItem, Input, Button, Message } from "element-ui";
import config from "@/utils/config";
import { LoginParams, UserInfo } from "@/types/index";

@Component({
  components: {
    Dialog,
    Form,
    FormItem,
    Input,
    Button
  }
})
export default class Login extends Vue {
  @Prop({ default: false }) visible!: boolean;

  // initial data
  private btnLoading: boolean = false;
  private loading: boolean = false;
  private formLabelWidth: string = "60px";
  private params: LoginParams = {
    email: "",
    password: ""
  };

  // lifecycle hook
  mounted() {
    // this.greet();
  }

  // computed
  get dialogVisible(): boolean {
    return this.visible;
  }

  // method
  private handleOAuth(): void {
    // 保存授权前的页面链接内容
    let preventHistory = {
      pathname: window.location.pathname,
      search: window.location.search
    };
    window.sessionStorage.preventHistory = JSON.stringify(preventHistory);
    // window.location.href = 'https://github.com/login/oauth/authorize?client_id=6de90ab270aea2bdb01c&redirect_uri=http://biaochenxuying.cn/login'
    window.location.href = `${config.oauth_uri}?client_id=${config.client_id}&redirect_uri=${config.redirect_uri}`;
  }

  private handleOk(): void {
    const reg = new RegExp(
      "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"
    );
    if (!this.params.email) {
      Message.warning("邮箱不能为空！");
      return;
    } else if (!reg.test(this.params.email)) {
      Message.warning("请输入格式正确的邮箱！");
      return;
    } else if (!this.params.password) {
      Message.warning("密码不能为空");
      return;
    }
    this.submit();
  }

  // this.$emit
  @Emit()
  private cancel(): boolean {
    return false;
  }
  @Emit("ok")
  private async submit(): Promise<void> {
    const data: UserInfo = await this.$https.post(
      this.$urls.login,
      this.params
    );
    const userInfo: UserInfo = {
      _id: data._id,
      name: data.name,
      avatar: data.avatar
    };
    window.sessionStorage.userInfo = JSON.stringify(userInfo);
    Message.success("登录成功");
  }
}
</script>