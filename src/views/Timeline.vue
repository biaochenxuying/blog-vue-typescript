<template>
  <div class="timeline left">
    <el-timeline>
      <el-timeline-item
        v-for="(l, i) in state.list"
        :key="l._id"
        :color="l.state === 1 ? 'green' : l.state === 3 ? 'red' : ''"
        placement="top"
        hide-timestamp
      >
        <el-card>
          <h3>{{l.title}}</h3>
          <p>{{l.content}}</p>
          <p>
            <span>
              {{formatTime(l.start_time)}}--
            </span>
            <span>
              {{formatTime(l.end_time)}}
            </span>
          </p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
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
} from "../utils/utils";
import { Params, TimelineList, TimelinesData } from "../types/index";


export default defineComponent({
  name: "Timeline",
  components: {
    LoadEnd,
    LoadingCustom,
  },
  setup() {
    const state = reactive({
      isLoadEnd: false,
      isLoading: false,
      list: [] as TimelineList[],
      total: 0,
      params: {
        keyword: "",
        pageNum: 1,
        pageSize: 10,
      } as Params,
    });

    const formatTime = (value: string | Date): string => {
      return timestampToTime(value, true);
    };

    const handleSearch = async (): Promise<void> => {
      state.isLoading = true;
      const data: TimelinesData = await service.get(urls.getTimeAxisList, {
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
.timeline {
  padding: 40px 0;
  .year {
    font-size: 34px;
    font-weight: bold;
    color: #000;
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

