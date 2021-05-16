<template>
  <el-dialog
    title="评论"
    width="60%"
    v-model="state.dialogDodel"
    @close="cancel"
  >
    <el-form>
      <el-form-item>
        <el-input
          type="textarea"
          v-model="state.content"
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
import { ElMessage } from "element-plus";
import { defineComponent, reactive, watch } from "vue";
import service from "../utils/https";
import urls from "../utils/urls";

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
  setup(props, context) {
    const state = reactive({
      dialogDodel: props.visible,
      btnLoading: false,
      content: "",
      cacheTime: 0, // 缓存时间
      times: 0, // 留言次数
    });

    const cancel = (): boolean => {
      context.emit("cancel", false);
      return false;
    };

    const handleOk = async (): Promise<void> => {
      if (!props.article_id) {
        ElMessage({
          message: "该文章不存在！",
          type: "error",
        });
        return;
      }

      if (state.times > 2) {
        ElMessage({
          message: "您今天评论的次数已经用完，明天再来评论吧！",
          type: "warning",
        });
        return;
      }

      let now = new Date();
      let nowTime = now.getTime();
      if (nowTime - state.cacheTime < 4000) {
        ElMessage({
          message: "您评论太过频繁，1 分钟后再来评论吧！",
          type: "warning",
        });
        return;
      }

      if (!state.content) {
        ElMessage({
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
        ElMessage({
          message: "登录才能评论，请先登录！",
          type: "warning",
        });
        return;
      }
      state.btnLoading = true;
      await service.post(urls.addThirdComment, {
        article_id: props.article_id,
        user_id,
        comment_id: props.comment_id,
        to_user: JSON.stringify(props.to_user),
        content: state.content,
      });
      state.btnLoading = false;
      state.times++;

      state.cacheTime = nowTime;
      state.content = "";
      context.emit("ok", false);
      ElMessage({
        message: "操作成功",
        type: "success",
      });
    };

    watch(props, (val, oldVal) => {
      state.dialogDodel = val.visible;
    });

    return {
      state,
      cancel,
      handleOk,
    };
  },
});
</script>
<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
