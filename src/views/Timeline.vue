<template>
  <div class="timeline left">
    <el-timeline>
      <el-timeline-item
        v-for="(l, i) in list"
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
import { defineComponent } from "vue";
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
import { Params, TimelineList, TimelinesData } from "../types/index";

export default defineComponent({
  name: "Timeline",
  components: {
    LoadEnd,
    LoadingCustom,
  },
  data() {
    return {
      isLoadEnd: false,
      isLoading: false,
      list: [] as TimelineList[],
      total: 0,
      params: {
        keyword: "",
        pageNum: 1,
        pageSize: 10,
      } as Params,
    };
  },
  mounted(): void {
    this.handleSearch();
    window.onscroll = () => {
      if (getScrollTop() + getWindowHeight() > getDocumentHeight() - 100) {
        // 如果不是已经没有数据了，都可以继续滚动加载
        if (this.isLoadEnd === false && this.isLoading === false) {
          this.handleSearch();
        }
      }
    };
  },
  methods: {
    formatTime(value: string | Date): string {
      return timestampToTime(value, true);
    },
    async handleSearch(): Promise<void> {
      this.isLoading = true;
      const data: TimelinesData = await (this as any).$https.get(
        (this as any).$urls.getTimeAxisList,
        {
          params: this.params,
        }
      );
      this.isLoading = false;

      this.list = [...this.list, ...data.list];
      this.total = data.count;
      this.params.pageNum++;
      if (this.total === this.list.length) {
        this.isLoadEnd = true;
      }
    },
  },
  setup() {},
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

