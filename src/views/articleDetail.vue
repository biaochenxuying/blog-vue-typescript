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

declare var document: any;

@Component({
  components: {
    LoadingCustom,
    CommentList
  }
})
export default class ArticleDetail extends Vue {
  reverse: boolean = true;
  btnLoading: boolean = false;
  isLoadEnd: boolean = false;
  isLoading: boolean = false;
  isMobileOrPc: boolean = isMobileOrPc();
  articlesList: Array<object> = [];
  listList: Array<object> = [];
  total: number = 0;
  params: any = {
    id: "",
    type: 1 //文章类型 => 1: 普通文章，2: 简历，3: 管理员介绍
  };
  content: string = "";
  articleDetail: any = {
    toc: "",
    _id: "",
    author: "biaochenxuying",
    category: [],
    comments: [],
    create_time: "",
    desc: "",
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

  mounted() {
    this.params.id = this.$route.query.article_id;
    // this.params.id = "5c8cfe5d26bb39b22d3a7aec";
    if (this.$route.path === "/about") {
      this.params.type = 3;
    }
    this.handleSearch();
  }

  refreshArticle() {
    this.handleSearch();
  }

  async handleAddComment() {
    if (!this.articleDetail._id) {
      this.$message({
        message: "该文章不存在！",
        type: "error"
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
    const res: any = await this.$https.post(this.$urls.addComment, {
      article_id: this.articleDetail._id,
      user_id,
      content: this.content
    });
    this.btnLoading = false;
    if (res.status === 200) {
      if (res.data.code === 0) {
        this.content = "";
        this.$message({
          message: res.data.message,
          type: "success"
        });
        this.handleSearch();
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

  beforeDestroy() {
    document.title = "BiaoChenXuYing 的博客网站";
    document
      .getElementById("keywords")
      .setAttribute("content", "BiaoChenXuYing 的博客网站");
    document
      .getElementById("description")
      .setAttribute(
        "content",
        "分享 WEB 全栈开发等相关的技术文章，热点资源，全栈程序员的成长之路。"
      );
  }

  formatTime(value: any) {
    return timestampToTime(value, true);
  }

  async handleSearch() {
    this.isLoading = true;
    const res: any = await this.$https.post(
      this.$urls.getArticleDetail,
      this.params
    );
    this.isLoading = false;
    if (res.status === 200) {
      if (res.data.code === 0) {
        this.articleDetail = res.data.data;
        const article = markdown.marked(res.data.data.content);
        // console.log("this.articleDetail :", this.articleDetail.tags);
        article.then((res: any) => {
          this.articleDetail.content = res.content;
          this.articleDetail.toc = res.toc;
          // console.log("this.articleDetail.toc :", this.articleDetail.toc);
        });
        let keyword = res.data.data.keyword.join(",");
        let description = res.data.data.desc;
        let title = res.data.data.title;
        document.title = title;
        document.querySelector("#keywords").setAttribute("content", keyword);
        document
          .querySelector("#description")
          .setAttribute("content", description);
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

  async likeArticle() {
    if (!this.articleDetail._id) {
      this.$message({
        message: "该文章不存在！",
        type: "warning"
      });
      return;
    }
    let user_id: any = "";
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
    let params: any = {
      id: this.articleDetail._id,
      user_id
    };
    const res: any = await this.$https.post(this.$urls.likeArticle, params);
    this.isLoading = false;
    if (res.status === 200) {
      if (res.data.code === 0) {
        ++this.articleDetail.meta.likes;
        this.$message({
          message: res.data.message,
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
  color: #999;
  text-align: center;
  padding: 50px;
  font-size: 16px;
}
.clearfix {
  clear: both;
}
</style>

