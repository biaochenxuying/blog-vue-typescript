<template>
  <div style="width: 100%">
    <div class="article clearfix">
      <div v-show="!isLoading"
           :style="{'width': isMobileOrPc ? '100%' : '75%'}"
           class="article-left fl">
        <div class="header">
          <h1 class="title">{{articleDetail.title}}</h1>
          <div class="author">
            <div class="avatar">
              <img class="auth-logo"
                   src="../assets/userLogo.jpeg"
                   alt="BiaoChenXuYing">
            </div>
            <div class="info">
              <span class="name">
                <span>{{articleDetail.author}}</span>
              </span>
              <div props-data-classes="user-follow-button-header"
                   data-author-follow-button="" />
              <div class="meta">
                <span class="publish-time">
                  {{articleDetail.create_time? formatTime(articleDetail.create_time): ''}}
                </span>
                <span class="wordage">
                  字数 {{articleDetail.numbers}}
                </span>
                <span class="views-count">
                  阅读 {{articleDetail.meta.views}}
                </span>
                <span class="comments-count">
                  评论 {{articleDetail.meta.comments}}
                </span>
                <span class="likes-count">
                  喜欢 {{articleDetail.meta.likes}}
                </span>
              </div>
            </div>
            <div class="tags "
                 title="标签">
              <el-tag size="mini"
                      v-for="tag in articleDetail.tags"
                      :key="tag._id"
                      class="tag"
                      type="success">{{tag.name}}</el-tag>
            </div>
            <span class="clearfix" />
          </div>
        </div>
        <div class="content">
          <div id="content"
               class="article-detail"
               v-html="articleDetail.content">
          </div>
        </div>
        <div class="heart">
          <el-button type="danger"
                     size="large"
                     icon="heart"
                     :loading="isLoading"
                     @click="likeArticle">
            点赞
          </el-button>
        </div>
        <div class="comment">
          <el-input placeholder="文明社会，理性评论"
                    type="textarea"
                    v-model="content"></el-input>
          <el-button style="margin-top: 15px"
                     type="primary"
                     :loading="btnLoading"
                     @click="handleAddComment">发 送</el-button>
        </div>
        <CommentList v-if="!isLoading"
                     :numbers="articleDetail.meta.comments"
                     :list="articleDetail.comments"
                     :article_id="articleDetail._id"
                     @refreshArticle="refreshArticle" />
      </div>
      <div v-if="!isMobileOrPc"
           style="width: 23%"
           class="article-right fr anchor"
           v-html="articleDetail.toc"></div>
      <LoadingCustom v-if="isLoading"></LoadingCustom>
    </div>

  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import {
  timestampToTime,
  getQueryStringByName,
  isMobileOrPc
} from "@/utils/utils";
import markdown from "@/utils/markdown";
import LoadingCustom from "@/components/loading.vue";
import CommentList from "@/components/commentList.vue";
import {
  ArticleDetailIF,
  LikeParams,
  ArticleDetailParams
} from "@/types/index";

declare let document: Document | any;

@Component({
  components: {
    LoadingCustom,
    CommentList
  }
})
export default class ArticleDetail extends Vue {
  private btnLoading: boolean = false;
  private isLoadEnd: boolean = false;
  private isLoading: boolean = false;
  private isMobileOrPc: boolean = isMobileOrPc();
  private params: ArticleDetailParams = {
    id: "",
    type: 1 //文章类型 => 1: 普通文章，2: 简历，3: 管理员介绍
  };
  private content: string = "";
  private articleDetail: ArticleDetailIF = {
    toc: "",
    _id: "",
    author: "biaochenxuying",
    category: [],
    comments: [],
    create_time: "",
    desc: "",
    content: "",
    id: 16,
    img_url: "",
    numbers: 0,
    keyword: [],
    like_users: [],
    meta: { views: 0, likes: 0, comments: 0 },
    origin: 0,
    state: 1,
    tags: [],
    title: "",
    update_time: ""
  };
  private cacheTime: number = 0; // 缓存时间
  private times: number = 0; // 评论次数
  private likeTimes: number = 0; // 点赞次数

  mounted(): void {
    this.params.id = this.$route.query.article_id;
    // this.params.id = "5c8cfe5d26bb39b22d3a7aec";
    if (this.$route.path === "/about") {
      this.params.type = 3;
    }
    this.handleSearch();
  }

  refreshArticle(): void {
    this.handleSearch();
  }

  private async handleAddComment(): Promise<void> {
    if (!this.articleDetail._id) {
      this.$message({
        message: "该文章不存在！",
        type: "error"
      });
      return;
    }

    if (this.times > 2) {
      this.$message({
        message: "您今天评论的次数已经用完，明天再来评论吧！",
        type: "warning"
      });
      return;
    }

    let now = new Date();
    let nowTime = now.getTime();
    if (nowTime - this.cacheTime < 4000) {
      this.$message({
        message: "您评论太过频繁，1 分钟后再来留言吧！",
        type: "warning"
      });
      return;
    }

    if (!this.content) {
      this.$message({
        message: "请输入内容!",
        type: "warning"
      });
      return;
    }
    let user_id = "";
    if (window.sessionStorage.userInfo) {
      let userInfo = JSON.parse(window.sessionStorage.userInfo);
      user_id = userInfo._id;
    } else {
      this.$message({
        message: "登录才能评论，请先登录！",
        type: "warning"
      });
      return;
    }

    this.btnLoading = true;
    await this.$https.post(this.$urls.addComment, {
      article_id: this.articleDetail._id,
      user_id,
      content: this.content
    });
    this.btnLoading = false;
    this.times++;
    this.cacheTime = nowTime;
    this.content = "";
    this.$message({
      message: "操作成功",
      type: "success"
    });
    this.handleSearch();
  }

  beforeDestroy(): void {
    document.title = "夜尽天明的博客网站";
    document
      .getElementById("keywords")
      .setAttribute("content", "夜尽天明 的博客网站");
    document
      .getElementById("description")
      .setAttribute(
        "content",
        "分享大前端开发等相关的技术文章，热点资源，全栈程序员的成长之路。"
      );
  }

  // // The class component now treats beforeRouteEnter
  // // and beforeRouteLeave as Vue Router hooks
  // beforeRouteEnter (to, from, next) {
  //   console.log('beforeRouteEnter')
  //   next() // needs to be called to confirm the navigation
  // }

  // beforeRouteLeave (to, from, next) {
  //   console.log('beforeRouteLeave')
  //   document.title = "夜尽天明的博客网站";
  //   document
  //     .getElementById("keywords")
  //     .setAttribute("content", "夜尽天明 的博客网站");
  //   document
  //     .getElementById("description")
  //     .setAttribute(
  //       "content",
  //       "分享大前端开发等相关的技术文章，热点资源，全栈程序员的成长之路。"
  //     );
  //   next() // needs to be called to confirm the navigation
  // }

  async handleSearch(): Promise<void> {
    this.isLoading = true;
    const data: any = await this.$https.post(
      this.$urls.getArticleDetail,
      this.params
    );
    this.isLoading = false;

    this.articleDetail = data;
    const article = markdown.marked(data.content);
    article.then((res: any) => {
      this.articleDetail.content = res.content;
      this.articleDetail.toc = res.toc;
    });
    let keyword = data.keyword.join(",");
    let description = data.desc;
    let title = data.title;
    document.title = title;
    document.querySelector("#keywords").setAttribute("content", keyword);
    document.querySelector("#description").setAttribute("content", description);
  }

  async likeArticle(): Promise<void> {
    if (!this.articleDetail._id) {
      this.$message({
        message: "该文章不存在！",
        type: "warning"
      });
      return;
    }

    if (this.likeTimes > 0) {
      this.$message({
        message: "您已经点过赞了！悠着点吧！",
        type: "warning"
      });
      return;
    }

    let user_id: string = "";
    if (window.sessionStorage.userInfo) {
      let userInfo = JSON.parse(window.sessionStorage.userInfo);
      user_id = userInfo._id;
    } else {
      this.$message({
        message: "登录才能点赞，请先登录！",
        type: "warning"
      });
      return;
    }
    let params: LikeParams = {
      id: this.articleDetail._id,
      user_id
    };
    await this.$https.post(this.$urls.likeArticle, params);
    this.isLoading = false;

    this.likeTimes++;
    ++this.articleDetail.meta.likes;
    this.$message({
      message: "操作成功",
      type: "success"
    });
  }
}
</script>
<style lang="less" scoped>
.anchor {
  display: block;
  position: sticky;
  top: 213px;
  margin-top: 213px;
  border-left: 1px solid #eee;
  .anchor-ul {
    position: relative;
    top: 0;
    max-width: 250px;
    border: none;
    -moz-box-shadow: 0 0px 0px #fff;
    -webkit-box-shadow: 0 0px 0px #fff;
    box-shadow: 0 0px 0px #fff;

    li.active {
      color: #009a61;
    }
  }
  a {
    color: #333;
  }
}
.article {
  width: 100%;
  .header {
    .title {
      margin: 20px 0 0;
      text-align: center;
      font-size: 34px;
      font-weight: bold;
    }
    .author {
      position: relative;
      margin: 30px 0 40px;
      padding-left: 50px;
      .avatar {
        position: absolute;
        left: 0;
        top: 0;
        width: 48px;
        height: 48px;
        vertical-align: middle;
        display: inline-block;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .info {
        float: left;
        vertical-align: middle;
        // display: inline-block;
        margin-left: 8px;
        a {
          color: #333;
        }
      }
      .name {
        margin-right: 3px;
        font-size: 16px;
        vertical-align: middle;
      }
      .meta {
        margin-top: 5px;
        font-size: 12px;
        color: #969696;
        span {
          padding-right: 5px;
        }
      }
      .tags {
        float: right;
        padding-top: 15px;
        // padding-right: 20px;
        .tag {
          // padding: 0 10px;
          margin-left: 5px;
          border-right: 2px solid #eee;
        }
      }
    }
  }
  .content {
    min-height: 300px;
  }
}
.heart {
  height: 60px;
  text-align: center;
  margin: 50px;
}
.loader {
  color: rgb(226, 44, 44);
  text-align: center;
  padding: 50px;
  font-size: 16px;
}
.clearfix {
  clear: both;
}
</style>

