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

var check = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error("邮箱不能为空"));
  }
};
var checkContent = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error("内容不能为空"));
  }
};

@Component({})
export default class Message extends Vue {
  // initial data
  btnLoading: boolean = false;
  params: any = {
    email: "",
    phone: "",
    name: "",
    content: ""
  };
  rules: any = {
    email: [{ validator: check, trigger: "blur" }],
    content: [{ validator: checkContent, trigger: "blur" }]
  };

  // use prop values for initial data

  // lifecycle hook
  mounted() {}

  // method
  async submit() {
    const reg: any = new RegExp(
      "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"
    ); //正则表达式
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
    } else if (!this.params.content) {
      this.$message({
        message: "内容不能为空",
        type: "warning"
      });
      return;
    }
    let res: any = "";
    this.btnLoading = true;
    res = await this.$https.post(this.$urls.addMessage, this.params);
    this.btnLoading = false;
    if (res.status === 200) {
      if (res.data.code === 0) {
        this.$message({
          message: "感谢您的留言，有必要的，博主有空都会回复您的 ！",
          type: "success"
        });
      } else {
        this.$message({
          message: res.data.message,
          type: "error"
        });
      }
    } else {
      this.$message({
        message: "网络错误!",
        type: "error"
      });
    }
  }
}
</script>
<style scoped>
.message {
  padding: 100px 20px 0 20px;
}
</style>
