<template>
  <div class="left clearfix">
    <h3
      v-if="state.params.tag_id"
      class="left-title"
    >{{state.tag_name}} 相关的文章：</h3>
    <ul
      class="articles-list"
      id="list"
    >
      <transition-group name="el-fade-in">
        <li
          v-for="(article) in state.articlesList"
          :key="article._id"
          class="item"
        >
          <a
            :href="state.href + article._id"
            target="_blank"
          >
            <img
              class="wrap-img img-blur-done"
              :data-src="article.img_url"
              data-has-lazy-src="false"
              src="../assets/bg.jpg"
              alt="文章封面"
            />
            <div class="content">
              <h4 class="title">{{article.title}}</h4>
              <p class="abstract">{{article.desc}}</p>
              <div class="meta">
                <span>查看 {{article.meta.views}}</span>
                <span>评论 {{article.meta.comments}}</span>
                <span>赞 {{article.meta.likes}}</span>
                <span
                  v-if="article.create_time"
                  class="time"
                >
                  {{formatTime(article.create_time)}}
                </span>
              </div>
            </div>
          </a>
        </li>
      </transition-group>
    </ul>
    <LoadingCustom v-if="state.isLoading"></LoadingCustom>
    <LoadEnd v-if="state.isLoadEnd"></LoadEnd>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, nextTick } from "vue";
import service from "../utils/https";
import urls from "../utils/urls";
import LoadEnd from "../components/LoadEnd.vue";
import LoadingCustom from "../components/Loading.vue";
import {
  throttle,
  getScrollTop,
  getDocumentHeight,
  getWindowHeight,
  getQueryStringByName,
  timestampToTime,
} from "../utils/utils";
import { ArticlesParams, ArticlesData } from "../types/index";

// 获取可视区域的高度
const viewHeight = window.innerHeight || document.documentElement.clientHeight;
// 用新的 throttle 包装 scroll 的回调
const lazyload = throttle(() => {
  // 获取所有的图片标签
  const imgs = document.querySelectorAll("#list .item img");
  // num 用于统计当前显示到了哪一张图片，避免每次都从第一张图片开始检查是否露出
  let num = 0;
  for (let i = num; i < imgs.length; i++) {
    // 用可视区域高度减去元素顶部距离可视区域顶部的高度
    let distance = viewHeight - imgs[i].getBoundingClientRect().top;
    let imgItem: any = imgs[i];
    // 如果可视区域高度大于等于元素顶部距离可视区域顶部的高度，说明元素露出
    if (distance >= 100) {
      // 给元素写入真实的 src，展示图片
      let hasLaySrc = imgItem.getAttribute("data-has-lazy-src");
      if (hasLaySrc === "false") {
        imgItem.src = imgItem.getAttribute("data-src");
        imgItem.setAttribute("data-has-lazy-src", "true");
      }
      // 前 i 张图片已经加载完毕，下次从第 i+1 张开始检查是否露出
      num = i + 1;
    }
  }
}, 1000);

export default defineComponent({
  name: "Articles",
  components: {
    LoadEnd,
    LoadingCustom,
  },
  watch: {
    $route: {
      handler(val: any, oldVal: any) {
        this.routeChange(val, oldVal);
      },
      immediate: true,
    },
  },
  setup(props, context) {
    const state = reactive({
      isLoadEnd: false,
      isLoading: false,
      articlesList: [] as Array<any>,
      total: 0,
      tag_name: decodeURI(getQueryStringByName("tag_name")),
      params: {
        keyword: "",
        likes: "", // 是否是热门文章
        state: 1, // 文章发布状态 => 0 草稿，1 已发布,'' 代表所有文章
        tag_id: getQueryStringByName("tag_id"),
        category_id: getQueryStringByName("category_id"),
        pageNum: 1,
        pageSize: 10,
      } as ArticlesParams,
      href:
        import.meta.env.MODE === "development"
          ? "http://localhost:3001/articleDetail?article_id="
          : "https://biaochenxuying.cn/articleDetail?article_id="
    });

    const formatTime = (value: string | Date): string => {
      return timestampToTime(value, true);
    };

    const handleSearch = async (): Promise<void> => {
      state.isLoading = true;
      const data: ArticlesData = await service.get(
        urls.getArticleList,
        {
          params: state.params,
        }
      );
      state.isLoading = false;
      state.articlesList = [...state.articlesList, ...data.list];
      state.total = data.count;
      state.params.pageNum++;
      nextTick(() => {
        lazyload();
      });
      if (data.list.length === 0 || state.total === state.articlesList.length) {
        state.isLoadEnd = true;
        document.removeEventListener("scroll", () => {});
        window.onscroll = null;
      }
    };

    const routeChange = (val: any, oldVal: any): void => {
      state.tag_name = decodeURI(getQueryStringByName("tag_name"));
      state.params.tag_id = getQueryStringByName("tag_id");
      state.params.category_id = getQueryStringByName("category_id");
      state.articlesList = [];
      state.params.pageNum = 1;
      handleSearch();
    }

    onMounted(() => {
      handleSearch();
      window.onscroll = () => {
        if (getScrollTop() + getWindowHeight() > getDocumentHeight() - 100) {
          // 如果不是已经没有数据了，都可以继续滚动加载
          if (state.isLoadEnd === false && state.isLoading === false) {
            handleSearch();
          }
        }
      };
      document.addEventListener("scroll", lazyload);
    });

    return {
      state,
      formatTime,
      handleSearch,
      routeChange
    };
  }
});
</script>


<style lang="less" scoped>
.left {
  .articles-list {
    margin: 0;
    padding: 0;
    list-style: none;
    .title {
      color: #333;
      margin: 7px 0 4px;
      display: inherit;
      font-size: 18px;
      font-weight: 700;
      line-height: 1.5;
    }
    .item > div {
      padding-right: 140px;
    }
    .item .wrap-img {
      position: absolute;
      top: 50%;
      margin-top: -50px;
      right: 0;
      width: 125px;
      height: 100px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
        border: 1px solid #f0f0f0;
      }
    }
    li {
      line-height: 20px;
      position: relative;
      // width: 100%;
      padding: 15px 0px;
      padding-right: 150px;
      border-bottom: 1px solid #f0f0f0;
      word-wrap: break-word;
      cursor: pointer;
      &:hover {
        .title {
          color: #000;
        }
      }
      .abstract {
        min-height: 30px;
        margin: 0 0 8px;
        font-size: 13px;
        line-height: 24px;
        color: #555;
      }
      .meta {
        padding-right: 0 !important;
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        a {
          margin-right: 10px;
          color: #b4b4b4;
          &::hover {
            transition: 0.1s ease-in;
            -webkit-transition: 0.1s ease-in;
            -moz-transition: 0.1s ease-in;
            -o-transition: 0.1s ease-in;
            -ms-transition: 0.1s ease-in;
          }
        }
        span {
          margin-right: 10px;
          color: #666;
        }
      }
    }
  }
}
</style>