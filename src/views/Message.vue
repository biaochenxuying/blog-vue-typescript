<template>
  <div class="message left">
    <el-form
      :model="state.params"
      status-icon
      :rules="state.rules"
      ref="params"
      label-width="50px"
      class="demo-ruleForm"
    >
      <el-form-item
        label="邮箱"
        prop="email"
      >
        <el-input
          type="text"
          placeholder="必填"
          v-model="state.params.email"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="手机"
        prop="phone"
      >
        <el-input
          v-model="state.params.phone"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="名字"
        prop="name"
      >
        <el-input v-model="state.params.name"></el-input>
      </el-form-item>
      <el-form-item
        label="内容"
        prop="content"
      >
        <el-input
          type="textarea"
          placeholder="必填"
          v-model="state.params.content"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="state.btnLoading"
          @click="submit"
        >提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import service from "../utils/https";
import urls from "../utils/urls";
import { MessageParams, RulesItem, Rules } from "../types/index";

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

export default defineComponent({
  name: "Message",
  setup() {
    const state = reactive({
      btnLoading: false,
      cacheTime: 0, // 缓存时间
      times: 0, // 留言次数
      params: {
        email: "",
        phone: "",
        name: "",
        content: "",
      } as MessageParams,
      rules: {
        email: [{ validator: check, trigger: "blur" }],
        phone: [{ validator: checkPhone, trigger: "blur" }],
        name: [{ validator: checkName, trigger: "blur" }],
        content: [{ validator: checkContent, trigger: "blur" }],
      } as Rules,
    });

    const submit = async (): Promise<void> => {
      if (state.times > 3) {
        ElMessage({
          message: "您今天留言的次数已经用完，明天再来留言吧！",
          type: "warning",
        });
        return;
      }

      let now = new Date();
      let nowTime = now.getTime();
      if (nowTime - state.cacheTime < 60000) {
        ElMessage({
          message: "您留言太过频繁，1 分钟后再来留言吧！",
          type: "warning",
        });
        return;
      }

      const reg: RegExp = new RegExp(
        "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"
      );
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
      } else if (!state.params.phone) {
        ElMessage({
          message: "手机不能为空",
          type: "warning",
        });
        return;
      } else if (!state.params.name) {
        ElMessage({
          message: "名字不能为空",
          type: "warning",
        });
        return;
      } else if (!state.params.content) {
        ElMessage({
          message: "内容不能为空",
          type: "warning",
        });
        return;
      }
      state.btnLoading = true;
      await service.post(urls.addMessage, state.params);
      state.btnLoading = false;

      state.times++;
      state.cacheTime = nowTime;
      ElMessage({
        message: "感谢您的留言，有必要的，博主有空都会回复您的 ！",
        type: "success",
      });
      state.params.content = "";
    };

    return {
      state,
      submit,
    };
  },
});
</script>
<style scoped>
.message {
  padding: 100px 20px 0 20px;
}
</style>
