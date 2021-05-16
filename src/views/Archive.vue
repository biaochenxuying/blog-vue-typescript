<template>
  <div class="archive left">
    <el-timeline>
      <el-timeline-item
        v-for="(l, i) in state.articlesList"
        :key="l.year"
        placement="top"
        hide-timestamp
      >
        <h3 class="year">{{l.year}}</h3>

        <el-timeline-item
          v-for="(item, index) in l.list"
          :key="item._id"
          :color="item.state === 1 ? 'green' : item.state === 3 ? 'red' : ''"
          placement="top"
          hide-timestamp
        >
          <router-link
            :to="`/articleDetail?article_id=${item._id}`"
            target="_blank"
          >
            <h3 class="title">{{item.title}}</h3>
          </router-link>
          <p>{{formatTime(item.create_time)}}</p>
        </el-timeline-item>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, onMounted } from "vue";
import { timestampToTime } from "../utils/utils";
import { ParamsArchive, ArchiveData } from "../types/index";
import service from "../utils/https";
import urls from "../utils/urls";

export default defineComponent({
  name: "Archive",
  setup() {
    const state = reactive({
      isLoadEnd: false,
      isLoading: false,
      articlesList: [] as Array<any>,
      total: 0,
      params: {
        keyword: "",
        likes: "", // 是否是热门文章
        state: 1, // 文章发布状态 => 0 草稿，1 已发布,'' 代表所有文章
        article: 1,
        tag_id: "",
        category_id: "",
        pageNum: 1,
        pageSize: 10,
      } as ParamsArchive
    });

    const formatTime = (value: string | Date): string => {
      return timestampToTime(value, true);
    }

    const handleSearch = async (): Promise<void> => {
      state.isLoading = true;
      const data: ArchiveData = await service.get(
        urls.getArticleList,
        {
          params: state.params,
        }
      );
      state.isLoading = false;
      state.articlesList = [...state.articlesList, ...data.list];
      state.total = data.count;
      state.params.pageNum++;
      if (state.total === state.articlesList.length) {
        state.isLoadEnd = true;
      }
    }

    onMounted(() => {
      handleSearch();
    })

    return {
      state,
      formatTime,
      handleSearch
    };
  },
});
</script>
<style lang="less" scoped>
.archive {
  padding: 40px 0;
  .year {
    font-size: 30px;
    font-weight: bold;
    color: #000;
    margin-top: 0;
  }
  a {
    text-decoration: none;
  }

  .title {
    color: #333;
    &:hover {
      color: #1890ff;
    }
  }
}
</style>

