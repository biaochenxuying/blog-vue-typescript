<template>
  <div class="right slider">
    <img
      class="right-logo"
      src="../assets/userLogo.jpeg"
      alt=""
    >
    <div class="title">夜尽天明</div>
    <div class="right-content">
      <!-- <div class="item">
        <div class="num">123</div>粉丝
      </div>
      <div class="item">
        <div class="num">123</div>文章
      </div>
      <div class="item">
        <div class="num">123</div>字数
      </div>
      <div class="item">
        <div class="num">123</div>收获喜欢
      </div> -->
    </div>
    <div class="tags">
      <div class="title">标签云</div>
      <router-link
        v-for="item in state.list"
        class="item"
        :key="item._id"
        :to="`/articles?tag_id=${item._id}&tag_name=${item.name}&category_id=`"
      >
        <span :key="item._id">{{item.name}}</span>
      </router-link>
    </div>
    <div class="introduce">
      <div class="title">技术以内的 BB</div>
      <div class="content">
        <img
          style="width:100%;"
          src="../assets/BiaoChenXuYing.png"
          alt="全栈修炼"
        />
      </div>
    </div>
    <div class="introduce">
      <div class="title">开源项目的 BB</div>
      <div class="content">
        <img
          style="width:100%;"
          src="../assets/FrontEndGitHub.png"
          alt="前端GitHub"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Params, TagsData } from "../types/index";
import { defineComponent, reactive, onMounted } from "vue";
import service from "../utils/https";
import urls from "../utils/urls";

export default defineComponent({
  name: "CustomSlider",
  setup(props, context) {
    const state = reactive({
      isLoadEnd: false,
      isLoading: false,
      list: [] as Array<any>,
      total: 0,
      params: {
        keyword: "",
        pageNum: 1,
        pageSize: 100,
      } as Params,
    });

    const handleSearch = async (): Promise<void> => {
      state.isLoading = true;
      const data: TagsData = await service.get(urls.getTagList, {
        params: state.params,
      });
      state.isLoading = false;

      state.list = [...state.list, ...data.list];
      state.total = data.count;
      state.params.pageNum++;
      if (state.total === state.list.length) {
        state.isLoadEnd = true;
      }
    };

    onMounted(() => {
      handleSearch();
    });

    return {
      state,
    };
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.slider {
  padding-top: 50px;
}
.right {
  text-align: center;
  .right-logo {
    width: 130px;
    border-radius: 50%;
    animation: mylogo 3s;
    -moz-animation: mylogo 3s; /* Firefox */
    -webkit-animation: mylogo 3s; /* Safari and Chrome */
    -o-animation: mylogo 3s; /* Opera */
    animation-iteration-count: infinite;
  }
  .title {
    font-size: 25px;
    font-weight: bold;
  }
  .right-content {
    padding: 10px 0 20px 0;
    margin-bottom: 10px;
    border-bottom: 1px solid #eee;
    .item {
      display: inline-block;
      padding: 0 10px;
      color: #969696;
      border-right: 1px solid #eee;
      &:last-child {
        border-right: none;
      }
      .num {
        color: #333;
      }
    }
  }
  .introduce {
    margin-bottom: 10px;
    border-bottom: 1px solid #eee;
    .title {
      font-size: 14px;
      color: #969696;
    }
    .content {
      color: #333;
      line-height: 26px;
      text-align: left;
      padding: 20px 0;
    }
    .footer {
      padding-bottom: 10px;
    }
  }
  .tags {
    min-height: 200px;
    padding: 5px 0 20px 0;
    margin-bottom: 10px;
    border-bottom: 1px solid #eee;
    .title {
      font-size: 14px;
      color: #969696;
    }
    .item {
      display: inline-block;
      cursor: pointer;
      padding: 5px 10px;
      border-radius: 5px;
      background-color: #eee;
      color: #333;
      margin: 10px 10px 0 0;
      text-decoration: none;
      &:hover {
        color: #409eff;
      }
    }
  }
  .classification {
    padding: 5px 0 20px 0;
    .title {
      font-size: 14px;
      color: #969696;
    }
    .item {
      text-align: center;
      padding: 10px;
      border-bottom: 1px solid #eee;
      color: #666;
      margin: 10px 10px 0 0;
    }
  }
}
@keyframes mylogo {
  0% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
  25% {
    transform: rotate(0deg) scale(1, 1);
    opacity: 0.8;
  }
  100% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
}

@-moz-keyframes mylogo {
  0% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
  25% {
    transform: rotate(0deg) scale(1, 1);
    opacity: 0.8;
  }
  100% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
}

@-webkit-keyframes mylogo {
  0% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
  25% {
    transform: rotate(0deg) scale(1, 1);
    opacity: 0.8;
  }
  100% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
}

@-o-keyframes mylogo {
  0% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
  25% {
    transform: rotate(0deg) scale(1, 1);
    opacity: 0.8;
  }
  100% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
}
</style>
