<template>
  <div class="project left">
    <el-row :gutter="20">
      <el-col
        class="el-col-pointer"
        :span="state.isMobileOrPc ? 24 : 12"
        v-for="(l, index) in state.list"
        :key="l._id"
        style="margin-bottom: 20px"
      >
        <a
          :href="l.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          <el-card shadow="hover">
            <img
              :src="l.img"
              class="image"
            >
            <div style="padding: 14px;">
              <h4>{{l.title}}</h4>
              <div class="content">{{l.content}}</div>
              <span>
                {{formatTime(l.start_time)}}--
              </span>
              <span>
                {{formatTime(l.end_time)}}
              </span>
            </div>
          </el-card>
        </a>
      </el-col>
    </el-row>
    <LoadingCustom v-if="state.isLoading"></LoadingCustom>
    <LoadEnd v-if="state.isLoadEnd"></LoadEnd>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, onMounted } from "vue";
import service from "../utils/https";
import urls from "../utils/urls";
import LoadEnd from "../components/LoadEnd.vue";
import LoadingCustom from "../components/Loading.vue";
import {
  getScrollTop,
  getDocumentHeight,
  getWindowHeight,
  timestampToTime,
  isMobileOrPc,
} from "../utils/utils";
import { Params, ProjectList, ProjectsData } from "../types/index";

export default defineComponent({
  name: "Project",
  components: {
    LoadEnd,
    LoadingCustom,
  },
  setup() {
    const state = reactive({
      reverse: true,
      isLoadEnd: false,
      isLoading: false,
      isMobileOrPc: isMobileOrPc(),
      list: [] as ProjectList[],
      total: 0,
      params: {
        keyword: "",
        pageNum: 1,
        pageSize: 10,
      } as Params
    });

    const formatTime = (value: string | Date): string => {
      return timestampToTime(value, true);
    };

    const handleSearch = async (): Promise<void> => {
      state.isLoading = true;
      const data: ProjectsData = await service.get(urls.getProjectList, {
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
      window.onscroll = () => {
        if (getScrollTop() + getWindowHeight() > getDocumentHeight() - 100) {
          // 如果不是已经没有数据了，都可以继续滚动加载
          if (state.isLoadEnd === false && state.isLoading === false) {
            handleSearch();
          }
        }
      };
    });

    return {
      state,
      formatTime,
      handleSearch,
    };
  }
});
</script>
<style lang="less" scoped>
.project {
  overflow: hidden;
  padding: 40px 0;
  .el-col-pointer {
    cursor: pointer;
  }
  .content {
    height: 70px;
    text-overflow: ellipsis;
  }
  .image {
    width: 100%;
    height: 250px;
  }
}
</style>

