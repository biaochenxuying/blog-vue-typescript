<template>
  <div class="message left">
    <el-form :model="params"
             status-icon
             :rules="rules"
             ref="params"
             label-width="50px"
             class="demo-ruleForm">
      <el-form-item label="邮箱"
                    prop="email">
        <el-input type="text"
                  placeholder="必填"
                  v-model="params.email"
                  autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="手机"
                    prop="phone">
        <el-input v-model="params.phone"
                  autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="名字"
                    prop="name">
        <el-input v-model="params.name"></el-input>
      </el-form-item>
      <el-form-item label="内容"
                    prop="content">
        <el-input type="textarea"
                  placeholder="必填"
                  v-model="params.content"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   :loading="btnLoading"
                   @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { MessageParams, RulesItem, Rules } from "@/types/index";

const check = (
  rule: any,
  value: string | any,
  callback: Function | any
): any => {
  if (!value) {
    return callback(new Error("邮箱不能为空"));
  }
};
const checkPhone = (
  rule: any,
  value: string | any,
  callback: Function | any
): any => {
  if (!value) {
    return callback(new Error("手机不能为空"));
  }
};
const checkName = (
  rule: any,
  value: string | any,
  callback: Function | any
): any => {
  if (!value) {
    return callback(new Error("名字不能为空"));
  }
};
const checkContent = (
  rule: any,
  value: string | any,
  callback: Function | any
) => {
  if (!value) {
    return callback(new Error("内容不能为空"));
  }
};

@Component({})
export default class Message extends Vue {
  // initial data
  private btnLoading: boolean = false;
  private cacheTime: number = 0; // 缓存时间
  private times: number = 0; // 留言次数
  private params: MessageParams = {
    email: "",
    phone: "",
    name: "",
    content: ""
  };
  private rules: Rules = {
    email: [{ validator: check, trigger: "blur" }],
    phone: [{ validator: checkPhone, trigger: "blur" }],
    name: [{ validator: checkName, trigger: "blur" }],
    content: [{ validator: checkContent, trigger: "blur" }]
  };

  // use prop values for initial data

  // lifecycle hook
  mounted() {}

  // method
  private async submit(): Promise<void> {
    if (this.times > 3) {
      this.$message({
        message: "您今天留言的次数已经用完，明天再来留言吧！",
        type: "warning"
      });
      return;
    }

    let now = new Date();
    let nowTime = now.getTime();
    if (nowTime - this.cacheTime < 60000) {
      this.$message({
        message: "您留言太过频繁，1 分钟后再来留言吧！",
        type: "warning"
      });
      return;
    }

    const reg: RegExp = new RegExp(
      "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"
    );
    if (!this.params.email) {
      this.$message({
        message: "邮箱不能为空！",
        type: "warning"
      });
      return;
    } else if (!reg.test(this.params.email)) {
      this.$message({
        message: "请输入格式正确的邮箱！",
        type: "warning"
      });
      return;
    } else if (!this.params.phone) {
      this.$message({
        message: "手机不能为空",
        type: "warning"
      });
      return;
    } else if (!this.params.name) {
      this.$message({
        message: "名字不能为空",
        type: "warning"
      });
      return;
    } else if (!this.params.content) {
      this.$message({
        message: "内容不能为空",
        type: "warning"
      });
      return;
    }
    this.btnLoading = true;
    await this.$https.post(this.$urls.addMessage, this.params);
    this.btnLoading = false;

    this.times++;
    this.cacheTime = nowTime;
    this.$message({
      message: "感谢您的留言，有必要的，博主有空都会回复您的 ！",
      type: "success"
    });
    this.params.content = "";
  }
}
</script>
<style scoped>
.message {
  padding: 100px 20px 0 20px;
}
</style>
