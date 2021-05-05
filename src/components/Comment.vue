<template>
  <el-dialog
    title="评论"
    width="60%"
    v-model="dialogDodel"
    @close="cancel"
  >
    <el-form>
      <el-form-item>
        <el-input
          type="textarea"
          v-model="content"
          placeholder="文明社会，理性评论"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="default"
        @click="cancel"
      >取消</el-button>
      <el-button
        type="primary"
        @click="handleOk"
      >确 定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import config from "../utils/config";
import { ToUser } from "../types/index";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Comment",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    comment_id: {
      type: String,
      default: "",
    },
    article_id: {
      type: String,
      default: "",
    },
    to_user: {
      // type: any,
      default: {},
    },
  },
  emits: ["ok", "cancel"],
  data() {
    return {
      dialogDodel: this.visible,
      btnLoading: false,
      content: "",
      cacheTime: 0, // 缓存时间
      times: 0, // 留言次数
    };
  },
  watch: {
    dialogDodel: {
      handler(val: any, oldVal: any) {
        if (!val) {
          this.$emit("cancel", val);
        }
      },
      // immediate: true
    },
    visible: {
      handler(val: any, oldVal: any) {
        console.log("val: ", val);
        this.dialogDodel = val;
      },
      // immediate: true
    },
  },
  // computed: {
  //   dialogVisible(): boolean {
  //     return this.visible;
  //   },
  // },
  methods: {
    cancel(): boolean {
      this.$emit("cancel", false);
      return false;
    },
    async handleOk(): Promise<void> {
      if (!this.article_id) {
        (this as any).$message({
          message: "该文章不存在！",
          type: "error",
        });
        return;
      }

      if (this.times > 2) {
        (this as any).$message({
          message: "您今天评论的次数已经用完，明天再来评论吧！",
          type: "warning",
        });
        return;
      }

      let now = new Date();
      let nowTime = now.getTime();
      if (nowTime - this.cacheTime < 4000) {
        (this as any).$message({
          message: "您评论太过频繁，1 分钟后再来评论吧！",
          type: "warning",
        });
        return;
      }

      if (!this.content) {
        (this as any).$message({
          message: "评论内容不能为空",
          type: "error",
        });
        return;
      }

      let user_id = "";
      if (window.sessionStorage.userInfo) {
        let userInfo = JSON.parse(window.sessionStorage.userInfo);
        user_id = userInfo._id;
      } else {
        (this as any).$message({
          message: "登录才能评论，请先登录！",
          type: "warning",
        });
        return;
      }
      this.btnLoading = true;
      await (this as any).$https.post((this as any).$urls.addThirdComment, {
        article_id: this.article_id,
        user_id,
        comment_id: this.comment_id,
        to_user: JSON.stringify(this.to_user),
        content: this.content,
      });
      this.btnLoading = false;
      this.times++;

      this.cacheTime = nowTime;
      this.content = "";
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
