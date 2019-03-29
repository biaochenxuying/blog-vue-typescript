
<template>
  <div class="comment-list">
    <div class="top-title">
      <span>{{numbers}} 条评论</span>
    </div>
    <div v-for="(item, i) in list"
         :key="i"
         class="item">
      <div class="item-header">
        <div class="author">
          <div class="avator">
            <img v-if="item.user.avatar.length < 10"
                 src="../assets/user.png"
                 alt="默认图片">
            <img v-else
                 :src="item.user.avatar"
                 alt="">
          </div>
        </div>
        <div class="info">
          <div class="name">
            {{item.user.name}}
            {{item.user.type === 0 ? '(作者)' : ''}}
          </div>
          <div class="time">
            {{formatTime(item.create_time)}}
          </div>
        </div>
      </div>
      <div class="comment-detail">{{item.content}}</div>
      <div class="item-comment">
        <div @click="showCommentModal(item, false)"
             class="message">
          <el-button size="small">回复</el-button>
        </div>
      </div>
      <div v-for="e in item.other_comments"
           :key="e._id"
           class="item-other">
        <div class="item-header">
          <div class="author">
            <div class="avator">
              <img v-if="e.user.avatar.length < 10"
                   src="../assets/user.png"
                   alt="默认图片">
              <img v-else
                   :src="e.user.avatar"
                   alt="">
            </div>
          </div>
          <div class="info">
            <div class="name">
              {{e.user.name}}
              {{e.user.type === 0 ? '(作者)' : ''}}
            </div>
            <div class="time">
              {{formatTime(e.create_time)}}
            </div>
          </div>
        </div>
        <div class="comment-detail">
          {{'@' + e.to_user.name}}
          {{e.to_user.type === 0 ? '(作者)' : ''}}：{{e.content}}
        </div>
        <div class="item-comment">
          <!-- {/* <a class="like">  赞
									</a> */} -->
          <div class="message">
            <el-button @click="showCommentModal(item, e)"
                       size="small">回复</el-button>
          </div>
        </div>
      </div>
    </div>
    <Comment :visible="visible"
             :to_user="to_user"
             :comment_id="comment_id"
             :article_id="article_id"
             @handleOk="handleOk"
             @cancel="handleCancel" />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { timestampToTime } from "@/utils/utils";
import Comment from "@/components/comment.vue";

@Component({
  components: {
    Comment
  }
})
export default class CommentList extends Vue {
  @Prop({ default: [] }) list!: Array<object>;
  @Prop({ default: 0 }) numbers!: number;
  @Prop({ default: "" }) article_id!: string;
  visible: boolean = false;
  content: any = "";
  comment_id: any = "";
  to_user: any = {};

  formatTime(value: any) {
    return timestampToTime(value, true);
  }

  handleCancel() {
    this.visible = false;
  }

  // @Emit("refreshArticle")
  handleOk() {
    this.visible = false;
    this.$emit("refreshArticle");
  }

  // 添加评论
  showCommentModal(item: any, secondItem: any) {
    if (!window.sessionStorage.userInfo) {
      this.$message({
        message: "登录才能点赞，请先登录！",
        type: "warning"
      });
      return false;
    }
    // 添加三级评论
    if (secondItem) {
      this.visible = true;
      this.comment_id = item._id;
      this.to_user = secondItem.user;
    } else {
      // 添加二级评论
      this.visible = true;
      this.comment_id = item._id;
      this.to_user = item.user;
    }
  }
}
</script>
<style lang="less" scoped>
.comment-list {
  text-align: center;
  // padding: 20px;
}
.comment-list {
  text-align: left;
  margin-top: 30px;
  padding-top: 30px;
  position: relative;
  // padding-left: 58px;
  border-top: 1px solid #eee;
  .avatar {
    position: absolute;
    left: 0px;
  }
  .el-icon-circle-plus {
    font-size: 40px;
  }
}
.clearfix {
  clear: both;
}
.comment-list {
  margin-top: 30px;
  .top-title {
    padding-bottom: 20px;
    font-size: 17px;
    font-weight: 700;
    border-bottom: 1px solid #f0f0f0;
  }
  .item {
    padding: 20px 0 30px;
    border-bottom: 1px solid #f0f0f0;
    .item-header {
      position: relative;
      padding-left: 45px;
      padding-bottom: 10px;
      .author {
        position: absolute;
        left: 0;
        display: inline-block;
        .avator {
          display: inline-block;
          margin-right: 5px;
          width: 40px;
          height: 40px;
          vertical-align: middle;
          img {
            width: 100%;
            height: 100%;
            // border: 1px solid #ddd;
            border-radius: 50%;
          }
        }
      }
      .info {
        display: inline-block;
        .name {
          font-size: 15px;
          color: #333;
        }
        .time {
          font-size: 12px;
          color: #969696;
        }
      }
    }
    .comment-detail {
      min-height: 40px;
    }
    .item-comment {
      .like {
        margin-right: 20px;
      }
    }
  }
}
.item-other {
  margin: 20px;
  padding: 10px;
  border-left: 2px solid #f0f0f0;
  .item-header {
    position: relative;
    padding-left: 45px;
    padding-bottom: 10px;
    .author {
      position: absolute;
      left: 0;
      display: inline-block;
      .avator {
        display: inline-block;
        margin-right: 5px;
        width: 38px;
        height: 38px;
        vertical-align: middle;
        img {
          width: 100%;
          height: 100%;
          // border: 1px solid #ddd;
          border-radius: 50%;
        }
      }
    }
    .info {
      display: inline-block;
      .name {
        font-size: 15px;
        color: #333;
      }
      .time {
        font-size: 12px;
        color: #969696;
      }
    }
  }
  .comment-detail {
    min-height: 40px;
    border-bottom: 1px dashed #f0f0f0;
  }
  .message {
    padding: 10px;
  }
}
</style>

